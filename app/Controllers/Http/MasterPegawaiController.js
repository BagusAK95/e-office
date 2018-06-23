'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')

class MasterPegawaiController {
    async show({params}){
        const data = await MasterPegawai.query()
                                        .with('lokasi')
                                        .whereRaw((params.nama) ? `nama LIKE '%` + params.nama + `%'` : ``)
                                        .paginate(Number(params.page), Number(params.limit))
        return this.response(true, null, data)
    }

    async detail({params}){
        const data = await MasterPegawai.query()
                                        .where({nip: params.nip})
                                        .with('lokasi')
                                        .first()
        return this.response(true, null, data)
    }

    async response(success, message, data) {
        return {
            success: success, 
            message: message,
            data: data
        }
    }
}

module.exports = MasterPegawaiController
