'use strict'

const Log = use('App/Models/Log')
const Response = use('App/Helpers/ResponseHelper')

class LogController {
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
            if (user.level == 1) {
                if (request.get().nip) {
                    sql.push(`nip = '` + request.get().nip + `'`)
                } else {
                    sql.push(`nip = '` + user.nip + `'`)
                }
            } else {
                sql.push(`nip = '` + user.nip + `'`)
            }
            sql.push('instansi = ' + user.instansi)

            const data = await Log.query()
                                  .whereRaw(sql.join(' AND '))
                                  .orderBy('tgl', 'desc')
                                  .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async list_Sys({ request }) {
        try {
            let sql = []
            if (request.get().tgl_awal) {
                sql.push(`tgl >= '` + request.get().tgl_awal + ` 00:00:00'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl <= '` + request.get().tgl_akhir + ` 23:59:59'`)
            }
            sql.push('nip = ' + request.get().instansi)
            sql.push('instansi = ' + request.get().instansi)

            const data = await Log.query()
                                  .whereRaw(sql.join(' AND '))
                                  .orderBy('tgl', 'desc')
                                  .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }
}

module.exports = LogController
