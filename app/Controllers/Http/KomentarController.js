'use strict'

const Komentar = use('App/Models/Komentar')

class KomentarController {
    async add({ request, auth }){
        try {
            const user = await auth.getUser()
            
            let data = request.only(['id_disposisi', 'isi_komentar'])
            data.nip = user.nip

            const insert = await Komentar.create(data)
            return this.response(true, null, insert)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }
}

module.exports = KomentarController
