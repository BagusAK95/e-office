'use strict'

const SuratKeluar = use('App/Models/SuratKeluar')
const SuratPemeriksa = use('App/Models/SuratPemeriksa')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')

class SuratKeluarController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser()

            let data = request.all()
            let arrPemeriksa = JSON.parse(data.arr_pemeriksa)

            data.nip_pembuat = user.nip
            data.nama_pembuat = user.nama_lengkap
            data.jabatan_pembuat = user.nama_jabatan
            data.keyword = ''.concat(data.nama_pembuat, ' | ', data.nama_penandatangan, ' | ', data.perihal)
            delete data.arr_pemeriksa
                    
            const insertKonsep = await SuratKeluar.create(data)

            /* --- Insert Pemeriksa --- */

            for (let i = 0; i < arrPemeriksa.length; i++) {
                arrPemeriksa[i].id_surat_keluar = insertKonsep.id

                if (i == 0) {
                    arrPemeriksa[i].status = 0
                }
            }

            await SuratPemeriksa.createMany(arrPemeriksa)

            /* --- Insert Pemeriksa --- */

            /* --- Kirim Notifikasi --- */

            Notification.send([user.nip, user.nama_lengkap], [arrPemeriksa[0].nip_pemeriksa], 'Mengirimkan Konsep Surat', '/konsep-surat/' + insertKonsep.id)

            /* --- Kirim Notifikasi --- */

            return Response.format(true, null, insertKonsep)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async ListConceptChecked({ request, auth }) {
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
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }
            sql.push('status_surat BETWEEN 1 AND 2')

            const data = await SuratKeluar.query()
                                        .whereRaw(sql.join(' AND '))
                                        .whereHas('pemeriksa_', (pemeriksa) => {
                                            pemeriksa.where('nip_pemeriksa', user.nip)
                                        })
                                        .orderBy('tgl', 'desc')
                                        .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async ListConceptMaked({ request, auth }) {
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
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }
            sql.push(`nip_pembuat = '` + user.nip + `'`)
            sql.push('status_surat BETWEEN 1 AND 2')

            const data = await SuratKeluar.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl', 'desc')
                                        .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = SuratKeluarController
