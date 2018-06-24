'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')

class MasterPegawaiController {
    async show({params}){
        try {
            const data = await MasterPegawai.query()
                                            .with('lokasi')
                                            .whereRaw(`nama LIKE '%` + params.nama + `%'`)
                                            .paginate(Number(params.page), Number(params.limit))
            if (data) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Not found', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)                
        }
    }

    async detail({params}){
        try {
            const data = await MasterPegawai.query()
                                            .where({nip: params.nip})
                                            .with('lokasi')
                                            .first()
            if (data) {
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

module.exports = MasterPegawaiController
