'use strict'

const Disposisi = use('App/Models/Disposisi')

class DisposisiController {
    async add({ request }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const data = request.all()

            const insert = await Disposisi.create(data)
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

module.exports = DisposisiController
