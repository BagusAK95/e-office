'use strict'

const MasterInstruksi = use('App/Models/MasterInstruksi')
const Response = use('App/Helpers/ResponseHelper')

class MasterInstruksiController {
    async listAll(){
        try {
            //Get data dari database
            const data = await MasterInstruksi.query()
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = MasterInstruksiController
