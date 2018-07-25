'use strict'

const Disposisi = use('App/Models/Disposisi')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')
const SuratMasuk = use('App/Models/SuratMasuk')

class DisposisiController {
    async add({ request, auth }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const user = await auth.getUser()

            const data = request.all()
            data.nip_pengirim = user.nip
            data.nama_pengirim = user.nama_lengkap
            data.jabatan_pengirim = user.nama_jabatan
            data.keyword = ''.concat(data.nama_penerima, ' | ', data.isi_disposisi)

            const insert = await Disposisi.create(data)

            /* --- Kirim Notifikasi --- */
            
            const surat = await SuratMasuk.find(data.id_surat_masuk)
            if (surat) {
                Notification.send([user.nip, user.nama_lengkap], [data.nip_penerima], 'Mengirimkan Disposisi Surat Nomor ' + surat.nomor_surat, '/disposisi-masuk/' + insert.id)
            }

            /* --- Kirim Notifikasi --- */

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async listIn({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            sql.push(`nip_penerima = '` + user.nip + `'`)
            if (request.get().tgl_awal) {
                sql.push(`tgl_disposisi >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl_disposisi <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().keyword) {
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }

            const data = await Disposisi.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl_disposisi', 'desc')
                                        .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async listOut({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            sql.push(`nip_pengirim = '` + user.nip + `'`)
            if (request.get().tgl_awal) {
                sql.push(`tgl_disposisi >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl_disposisi <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().keyword) {
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }

            const data = await Disposisi.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl_disposisi', 'desc')
                                        .paginate(Number(request.get().page), Number(request.get().limit))

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async listAllByMail({ params }) {
        try {
            const data = await Disposisi.query()
                                        .where('id_surat_masuk', Number(params.id_surat_masuk))
                                        .orderBy('tgl_disposisi', 'desc')

            return Response.format(false, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const destroy = await Disposisi.query()
                                           .where({id: Number(params.id), nip_pengirim: user.nip})
                                           .delete()
            if (destroy > 0) {
                return Response.format(true, null, destroy)
            } else {
                return Response.format(false, 'Disposisi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Disposisi.query()
                                        .whereRaw(`id = ` + params.id + ` AND (nip_penerima = '` + user.nip + `' OR nip_pengirim = '` + user.nip + `')`)
                                        .with('instruksi_')
                                        .with('surat_')
                                        .first()
            if (data) {
                if (data.tgl_baca == null) {
                    data.tgl_baca = new Date()
                    await data.save()
                }

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Disposisi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async setStatus({ params, request, auth }) {
        try {
            const user = await auth.getUser()

            const disposisi = await Disposisi.query()
                                             .where({ id: params.id, nip_penerima: user.nip })
                                             .first()
            if (disposisi) {
                const surat = await SuratMasuk.find(disposisi.id_surat_masuk)
                if (surat) {
                    const data = request.only(['status', 'keterangan'])
                    if (data.status == 1) {
                        disposisi.status = 1
                        disposisi.keterangan = data.keterangan
                        disposisi.tgl_selesai = new Date()
                        disposisi.save()
            
                        /* --- Kirim Notifikasi --- */
                        
                        Notification.send([user.nip, user.nama_lengkap], [disposisi.nip_pengirim], 'Menyelesaikan Disposisi Surat Nomor ' + surat.nomor_surat, '/disposisi-keluar/' + params.id)
                        
                        /* --- Kirim Notifikasi --- */   
                    } else if (data.status == 2) {
                        disposisi.status = 2
                        disposisi.keterangan = data.keterangan
                        disposisi.save()
            
                        /* --- Kirim Notifikasi --- */
                        
                        Notification.send([user.nip, user.nama_lengkap], [disposisi.nip_pengirim], 'Menolak Disposisi Surat Nomor ' + surat.nomor_surat, '/disposisi-keluar/' + params.id)
                        
                        /* --- Kirim Notifikasi --- */                       
                    }

                    return Response.format(true, null, 1)
                } else {
                    return Response.format(false, 'Surat tidak ditemukan', null)
                }
            } else {
                return Response.format(false, 'Disposisi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }
}

module.exports = DisposisiController
