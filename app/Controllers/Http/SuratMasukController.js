'use strict'

const SuratPengiriman = use('App/Models/SuratPengiriman')
const SuratMasuk = use('App/Models/SuratMasuk')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')
const Log = use('App/Helpers/LogHelper')

class SuratMasukController {
    async add({ request, auth }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const user = await auth.getUser()
            const dataPimpinan = await Login.query()
                                            .where({ level: 2, instansi: user.instansi })
                                            .first()
            if (dataPimpinan == null) {
                return Response.format(false, 'Pimpinan tidak ditemukan.', null)
            }

            let data = request.all()
            data.instansi_penerima = user.instansi
            data.nip_tata_usaha = user.nip
            data.nama_tata_usaha = user.nama_lengkap
            data.jabatan_tata_usaha = user.nama_jabatan
            data.tgl_baca_tata_usaha = new Date()
            data.nip_pimpinan = dataPimpinan.nip
            data.nama_pimpinan = dataPimpinan.nama_lengkap
            data.jabatan_pimpinan = dataPimpinan.nama_jabatan
            data.status_surat = 1
            data.keyword = ''.concat(data.nomor_surat, ' | ', data.nama_instansi, ' | ', data.perihal, ' | ', data.nama_pengirim)

            const insert = await SuratMasuk.create(data)

            let arr_penerima = [data.nip_pimpinan]
            if (data.nip_plt) {
                arr_penerima.push(data.nip_plt)
            }

            Notification.send(user, arr_penerima, 'Mengirimkan Surat Nomor ' + data.nomor_surat, '/surat-masuk/' + insert.id)

            Log.add(user, 'Mengirimkan Surat Masuk Nomor ' + data.nomor_surat + ' Ke Pimpinan', insert)

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            if (request.get().tgl_awal) {
                sql.push(`tgl_surat >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl_surat <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().keyword) {
                sql.push(`keyword LIKE '%` + request.get().keyword + `%'`)
            }

            switch (user.level) {
                case 3: //Tata Usaha
                    sql.push('instansi_penerima = ' + user.instansi)
                    break;
                case 2: //Pimpinan
                    sql.push('instansi_penerima = ' + user.instansi)
                    sql.push('status_surat = 1')
                    break;
                default: //Staff
                    sql.push(`nip_plt = '` + user.nip + `'`)
                    sql.push('status_surat = 1')
                    break;
            }

            const data = await SuratMasuk.query()
                                         .whereRaw(sql.join(' AND '))
                                         .withCount('disposisi_ as total_disposisi')
                                         .orderBy('id', 'desc')
                                         .paginate(Number(request.get().page), Number(request.get().limit))
            
            Log.add(user, 'Melihat Daftar Surat Masuk Pada Halaman ' + request.get().page)
            
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await SuratMasuk.query()
                                        .where({ id: Number(params.id), instansi_penerima: user.instansi })
                                        .first()

            if (data) {
                await data.delete()

                Log.add(user, 'Menghapus Surat Masuk Nomor ' + data.nomor_surat, data)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async detail({ params, auth}) {
        try {
            const user = await auth.getUser()
            
            const data = await SuratMasuk.query()
                                         .where({ id: Number(params.id), instansi_penerima: user.instansi })
                                         .with('klasifikasi_')
                                         .first()
            if (data) {
                if (data.nip_pimpinan == user.nip) {
                    if (data.tgl_baca_pimpinan == null) {
                        data.tgl_baca_pimpinan = new Date()
                        await data.save()                    
                    }
                } else if (data.nip_plt == user.nip) {
                    if (data.tgl_baca_plt == null) {
                        data.tgl_baca_plt = new Date()
                        await data.save()                    
                    }
                } else if (data.nip_tata_usaha == user.nip) {
                    if (data.tgl_baca_tata_usaha == null) {
                        data.tgl_baca_tata_usaha = new Date()
                        await data.save()

                        await SuratPengiriman.query()
                                             .where({ id_instansi: user.instansi, id_surat_masuk: params.id })
                                             .update({ tgl_baca: new Date() })
                    }
                }
                
                Log.add(user, 'Melihat Detail Surat Masuk Nomor ' + data.nomor_surat)

                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async send({ params, request, auth }) {
        const user = await auth.getUser()
        const data = request.only(['tgl_terima', 'nomor_agenda', 'nip_plt', 'nama_plt', 'jabatan_plt', 'lampiran'])

        const dataSurat = await SuratMasuk.query()
                                        .where({ instansi_penerima: user.instansi, id: params.id })
                                        .first()
        if (dataSurat) {
            if (dataSurat.status_surat == 0) {
                const dataPimpinan = await Login.query()
                                            .where({ level: 2, instansi: user.instansi })
                                            .first()
                if (dataPimpinan) {
                    dataSurat.nip_tata_usaha = user.nip
                    dataSurat.nama_tata_usaha = user.nama_lengkap
                    dataSurat.jabatan_tata_usaha = user.nama_jabatan
                    dataSurat.nip_pimpinan = dataPimpinan.nip
                    dataSurat.nama_pimpinan = dataPimpinan.nama_lengkap
                    dataSurat.jabatan_pimpinan = dataPimpinan.nama_jabatan
                    dataSurat.nip_plt = data.nip_plt
                    dataSurat.nama_plt = data.nama_plt
                    dataSurat.jabatan_plt = data.jabatan_plt
                    dataSurat.tgl_terima = data.tgl_terima
                    dataSurat.nomor_agenda = data.nomor_agenda
                    dataSurat.lampiran = data.lampiran
                    dataSurat.status_surat = 1
                    dataSurat.keyword = ''.concat(dataSurat.nomor_surat, ' | ', dataSurat.nama_instansi, ' | ', dataSurat.perihal, ' | ', dataSurat.nama_pengirim)
                    dataSurat.save()

                    let arr_penerima = [dataPimpinan.nip]
                    if (data.nip_plt) {
                        arr_penerima.push(data.nip_plt)
                    }

                    Notification.send(user, arr_penerima, 'Mengirimkan Surat Nomor ' + dataSurat.nip_tata_usaha, '/surat-masuk/' + params.id)
                
                    Log.add(user, 'Mengirimkan Surat Masuk Nomor ' + dataSurat.nomor_surat + ' Ke Pimpinan', dataSurat)

                    return Response.format(true, null, 1)
                } else {
                    return Response.format(false, 'Pimpinan tidak ditemukan', null)
                }    
            } else {
                return Response.format(false, 'Surat masuk harus dalam status belum dikirim', null)                
            }
        } else {
            return Response.format(false, 'Surat tidak ditemukan', null)
        }
    }

    async unreadAmount({ auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            switch (user.level) {
                case 3: //Tata Usaha
                    sql.push(`nip_tata_usaha = '` + user.nip + `'`)
                    sql.push('tgl_baca_tata_usaha IS NULL')
                    break;
                case 2: //Pimpinan
                    sql.push(`nip_pimpinan = '` + user.nip + `'`)
                    sql.push('status_surat = 1')
                    sql.push('tgl_baca_pimpinan IS NULL')
                    break;
                default: //Staff
                    sql.push(`nip_plt = '` + user.nip + `'`)
                    sql.push('status_surat = 1')
                    sql.push('tgl_baca_plt IS NULL')
                    break;
            }
            sql.push('instansi_penerima = ' + user.instansi)

            const count = await SuratMasuk.query()
                                          .whereRaw(sql.join(' AND '))
                                          .getCount()
            
            return Response.format(true, null, count)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratMasukController
