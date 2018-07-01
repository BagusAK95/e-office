'use strict'

const SuratMasuk = use('App/Models/SuratMasuk')

class SuratMasukController {
    async add({ request }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const data = request.all()

            const insert = await SuratMasuk.create(data)
            return this.response(true, null, insert)
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

module.exports = SuratMasukController
