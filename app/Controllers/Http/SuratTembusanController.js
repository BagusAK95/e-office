'use strict'

const Response = use('App/Helpers/ResponseHelper')
const SuratTembusan = use('App/Models/SuratTembusan')
const SuratMasuk = use('App/Models/SuratMasuk')

class SuratTembusanController {
    async add({ request, auth }) {
        try {
            const user = auth.getUser()
            const data = request.all()
            const insert = await SuratTembusan.create(data)

            /* --- Kirim Notifikasi --- */

            const surat = await SuratMasuk.find(data.id_surat_masuk)
            if (surat) {
                Notification.send(user.nip, [data.nip_penerima], user.nama_lengkap + ' Mengirimkan Surat Sebagai Tembusan ' + surat.nomor_surat, '')                
            }

            /* --- Kirim Notifikasi --- */

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            if (request.get().tgl_awal) {
                sql.push(`tgl >= '` + request.get().tgl_awal + ` 00:00:00'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl <= '` + request.get().tgl_akhir + ` 23:59:59'`)
            }
            sql.push(`nip_penerima = '` + user.nip + `'`)
            sql.push('id_surat_masuk = ' + request.get().id_surat_masuk)

            const data = await SuratTembusan.query()
                                            .whereRaw(sql.join(' AND '))
                                            .with('surat_')
                                            .orderBy('tgl', 'desc')
                                            .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratTembusan.query()
                                            .where({id: params.id, nip_penerima: user.nip})
                                            .with('surat_')
                                            .first()
            if (data) {
                if (data.tgl_baca == null) {
                    data.tgl_baca = new Date()
                    data.save()
                }

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = SuratTembusanController
