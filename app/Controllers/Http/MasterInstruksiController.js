'use strict'

const MasterInstruksi = use('App/Models/MasterInstruksi')

class MasterInstruksiController {
    async listAll(){
        try {
            const data = await MasterInstruksi.query()
            if (data.length > 0) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Not found', null)
            }
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
