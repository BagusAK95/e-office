'use strict'

const Response = use('App/Helpers/ResponseHelper')
const SuratTembusan = use('App/Models/SuratTembusan')
const SuratMasuk = use('App/Models/SuratMasuk')
const Notification = use('App/Helpers/NotificationHelper')
const Log = use('App/Helpers/LogHelper')

class SuratTembusanController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()
            data.instansi = user.instansi

            const insert = await SuratTembusan.create(data)

            const surat = await SuratMasuk.find(data.id_surat_masuk)
            if (surat) {
                Notification.send([user.nip, user.nama_lengkap], [data.nip_penerima], 'Mengirimkan Surat Nomor ' + surat.nomor_surat + ' Sebagai Tembusan', '/tembusan/' + insert.id)                
            }

            Log.add(user, 'Menambahkan ' + data.nama_penerima + ' Sebagai Tembusan Surat Nomor ' + surat.nomor_surat, insert)

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
            sql.push(`instansi = ` + user.instansi)

            const data = await SuratTembusan.query()
                                            .whereRaw(sql.join(' AND '))
                                            .with('surat_')
                                            .orderBy('tgl', 'desc')
                                            .paginate(Number(request.get().page), Number(request.get().limit))
            
            Log.add(user, 'Melihat Daftar Tembusan Surat Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratTembusan.query()
                                            .where({id: params.id, nip_penerima: user.nip, instansi: user.instansi})
                                            .with('surat_')
                                            .first()
            if (data) {
                if (data.tgl_baca == null) {
                    data.tgl_baca = new Date()
                    data.save()
                }

                const dataJson = JSON.parse(JSON.stringify(data))
                Log.add(user, 'Melihat Detail Tembusan Surat Nomor ' + dataJson.surat_.nomor_surat)

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = SuratTembusanController
