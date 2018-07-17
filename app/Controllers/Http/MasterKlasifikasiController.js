'use strict'

const MasterKlasifikasi = use('App/Models/MasterKlasifikasi')

class MasterKlasifikasiController {
    async listAll(){
        try {
            const data = await MasterKlasifikasi.query()
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

module.exports = MasterKlasifikasiController
