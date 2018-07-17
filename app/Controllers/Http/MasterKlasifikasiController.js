'use strict'

const MasterKlasifikasi = use('App/Models/MasterKlasifikasi')
const Response = use('App/Helpers/ResponseHelper')

class MasterKlasifikasiController {
    async listAll(){
        try {
            const data = await MasterKlasifikasi.query()
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }
}

module.exports = MasterKlasifikasiController
