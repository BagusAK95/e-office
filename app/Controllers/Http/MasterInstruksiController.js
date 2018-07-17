'use strict'

const MasterInstruksi = use('App/Models/MasterInstruksi')

class MasterInstruksiController {
    async listAll(){
        try {
            const data = await MasterInstruksi.query()
            return this.response(true, null, data)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)                
        }
    }

    async response(success, message, data) {
        return {
            success: success, 
            message: message,
            data: data
        }
    }
}

module.exports = MasterInstruksiController
