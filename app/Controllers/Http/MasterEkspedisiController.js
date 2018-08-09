'use strict'

const MasterEkspedisi = use('App/Models/MasterEkspedisi')
const Response = use('App/Helpers/ResponseHelper')

class MasterEkspedisiController {
    async listAll() {
        try {
            const data = await MasterEkspedisi.query()
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = MasterEkspedisiController
