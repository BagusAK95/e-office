'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')

class MasterPegawaiController {
    async show({params, auth}){
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')
            const sql1 = '(kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi + ')'
            const sql2 = (params.nama != '%7Bnama%7D') ? ` AND (nama LIKE '%` + params.nama + `%')` : ''

            const data = await MasterPegawai.query()
                                            .whereRaw(sql1 + sql2)
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
