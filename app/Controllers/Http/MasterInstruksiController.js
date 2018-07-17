'use strict'

const MasterInstruksi = use('App/Models/MasterInstruksi')
const Response = use('App/Helpers/ResponseHelper')

class MasterInstruksiController {
    async listAll(){
        try {
            const data = await MasterInstruksi.query()
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }
}

module.exports = MasterInstruksiController
