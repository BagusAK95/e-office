'use strict'

const MasterJabatan = use('App/Models/MasterJabatan')
const Response = use('App/Helpers/ResponseHelper')

class MasterJabatanController {
    async listAll_Sys() {
        try {
            const data = await MasterJabatan.query()

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = MasterJabatanController
