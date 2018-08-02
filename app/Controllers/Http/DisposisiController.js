'use strict'

const Disposisi = use('App/Models/Disposisi')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')
const Log = use('App/Helpers/LogHelper')
const SuratMasuk = use('App/Models/SuratMasuk')

class DisposisiController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login
            const data = request.all() //Set data tambahan

            const surat = await SuratMasuk.find(data.id_surat_masuk) //Get data surat masuk
            if (surat) {
                data.instansi = user.instansi
                data.nip_pengirim = user.nip
                data.nama_pengirim = user.nama_lengkap
                data.jabatan_pengirim = user.nama_jabatan
                data.keyword = ''.concat(data.nama_penerima, ' | ', data.isi_disposisi)

                const insert = await Disposisi.create(data) //insert ke database

                //Kirim Notifikasi ke penerima
                Notification.send([user.nip, user.nama_lengkap], [data.nip_penerima], 'Mengirimkan Disposisi Surat Nomor ' + surat.nomor_surat, '/disposisi-masuk/' + insert.id)

                //Tambah Log
                Log.add(user, 'Mengirimkan Disposisi Surat Nomor ' + surat.nomor_surat + ' Untuk ' + data.nama_penerima, insert)

                return Response.format(true, null, insert)
            } else {
                return Response.format(false, 'Surat masuk tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async listIn({ request, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            let sql = [] //Siapkan SQL filter
            sql.push(`nip_penerima = '` + user.nip + `'`)
            sql.push(`instansi = ` + user.instansi)
            if (request.get().tgl_awal) {
                sql.push(`tgl_disposisi >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl_disposisi <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().keyword) {
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }

            //Get data dari database
            const data = await Disposisi.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl_disposisi', 'desc')
                                        .paginate(Number(request.get().page), Number(request.get().limit))
            
            //Tambah Log
            Log.add(user, 'Melihat Daftar Disposisi Masuk Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async listOut({ request, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            let sql = [] //Siapkan SQL filter
            sql.push(`nip_pengirim = '` + user.nip + `'`)
            sql.push(`instansi = ` + user.instansi)
            if (request.get().tgl_awal) {
                sql.push(`tgl_disposisi >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl_disposisi <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().keyword) {
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }

            //Ambil data dari database
            const data = await Disposisi.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl_disposisi', 'desc')
                                        .paginate(Number(request.get().page), Number(request.get().limit))

            //Tambah log
            Log.add(user, 'Melihat Daftar Disposisi Keluar Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async listAllByMail({ params, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            //Get data dari database
            const data = await Disposisi.query()
                                        .where({ id_surat_masuk: Number(params.id_surat_masuk), instansi: user.instansi })
                                        .orderBy('tgl_disposisi', 'desc')

            return Response.format(false, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login
            
            //Ambil data dari database
            const data = await Disposisi.query()
                                        .where({id: Number(params.id), nip_pengirim: user.nip, instansi: user.instansi})
                                        .with('surat_')
                                        .first()
            if (data) {
                await data.delete() //Delete data

                //Tambah log
                const dataJson = JSON.parse(JSON.stringify(data))
                Log.add(user, 'Menghapus Disposisi Surat Nomor ' + dataJson.surat_.nomor_surat + ' Untuk ' + data.nama_penerima, data)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Disposisi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser() //Ambil da

            const data = await Disposisi.query()
                                        .whereRaw(`instansi = ` + user.instansi + ` AND id = ` + params.id + ` AND (nip_penerima = '` + user.nip + `' OR nip_pengirim = '` + user.nip + `')`)
                                        .with('instruksi_')
                                        .with('surat_')
                                        .first()
            if (data) {
                if (data.tgl_baca == null) {
                    data.tgl_baca = new Date()
                    await data.save()
                }

                const dataJson = JSON.parse(JSON.stringify(data))
                Log.add(user, 'Melihat Detail Disposisi Surat Nomor ' + dataJson.surat_.nomor_surat)

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Disposisi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async setStatus({ params, request, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            //Get data disposisi dari database
            const disposisi = await Disposisi.query()
                                             .where({ id: params.id, nip_penerima: user.nip, instansi: user.instansi })
                                             .first()
            if (disposisi) {
                //Get data surat dari database
                const surat = await SuratMasuk.find(disposisi.id_surat_masuk)
                if (surat) {
                    const data = request.only(['status', 'keterangan'])
                    if (data.status == 1) {
                        //Lengkapi data yang kurang
                        disposisi.status = 1
                        disposisi.keterangan = data.keterangan
                        disposisi.tgl_selesai = new Date()
                        disposisi.save()
            
                        //Kirim notifikasi
                        Notification.send([user.nip, user.nama_lengkap], [disposisi.nip_pengirim], 'Menyelesaikan Disposisi Surat Nomor ' + surat.nomor_surat, '/disposisi-keluar/' + params.id)

                        //Tambah log
                        Log.add(user, 'Menyelesaikan Disposisi Dari ' + disposisi.nama_pengirim)
                    } else if (data.status == 2) {
                        //Lengkapi data yang kurang
                        disposisi.status = 2
                        disposisi.keterangan = data.keterangan
                        disposisi.save()
            
                        //Kirim notifikasi
                        Notification.send([user.nip, user.nama_lengkap], [disposisi.nip_pengirim], 'Menolak Disposisi Surat Nomor ' + surat.nomor_surat, '/disposisi-keluar/' + params.id)
                        
                        //Tambah log
                        Log.add(user, 'Menolak Disposisi Dari ' + disposisi.nama_pengirim)
                    }

                    return Response.format(true, null, 1)
                } else {
                    return Response.format(false, 'Surat tidak ditemukan', null)
                }
            } else {
                return Response.format(false, 'Disposisi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async unreadAmount({ auth }) {
        try {
            const user = await auth.getUser()
            const count = await Disposisi.query()
                                         .where({ instansi: user.instansi, nip_penerima: user.nip, tgl_baca: null })
                                         .getCount()
                
            return Response.format(true, null, count)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = DisposisiController
