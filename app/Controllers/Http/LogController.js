'use strict'

const Log = use('App/Models/Log')

class LogController {
    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            if (request.get().tgl_awal) {
                sql.push(`tgl >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().nip) {
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
}

module.exports = LogController
