'use strict'

const MasterKlasifikasi = use('App/Models/MasterKlasifikasi')

class MasterKlasifikasiController {
    async listAll(){
        try {
            const data = await MasterKlasifikasi.query()
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

module.exports = MasterKlasifikasiController
