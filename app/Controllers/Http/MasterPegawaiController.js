'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')

class MasterPegawaiController {
    async list({params, auth}){
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
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)                
        }
    }

    async listByLocation({ params }) {
        try {
            const data = await MasterPegawai.query()
                                            .where('kode_lokasi', params.kode_lokasi)
                                            .orderBy('kode_eselon', 'desc')
                                            .orderBy('kode_jabatan', 'desc')
            if (data.length > 0) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)                
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            const data = await MasterPegawai.query()
                                            .whereBetween('kode_lokasi', [startLokasi, endLokasi])
            if (data) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)                
        }
    }

    async listAllSubEmployes({ auth }) {
        try {
            const user = await auth.getUser()

            let startLokasi = user.kode_lokasi.toString() 
            let endLokasi = user.kode_lokasi.toString().replace(/0+$/g, '')

            const objMatch = user.kode_lokasi.toString().match(/0+$/g)
            if (objMatch) {
                for (let i = 0; i < objMatch[0].split('').length; i++) {
                   endLokasi += '9' 
                }
            }
    
            const data = await MasterPegawai.query().whereBetween('kode_lokasi', [startLokasi, endLokasi])
            if (data) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }   
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async detail({params}){
        try {
            const data = await MasterPegawai.query()
                                            .where('nip', params.nip)
                                            .first()
            if (data) {
                return this.response(true, null, data)            
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
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
