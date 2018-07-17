'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')
const Response = use('App/Helpers/ResponseHelper')

class MasterPegawaiController {
    async list({request, auth}){
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            let sql = []
            if (request.get().nama) {
                sql.push(`nama LIKE '%` + request.get().nama + `%'`)
            }
            sql.push('kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi)

            const data = await MasterPegawai.query()
                                            .whereRaw(sql.join(' AND '))
                                            .paginate(Number(request.get().page), Number(request.get().limit))
                                    
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }

    async listByLocation({ params }) {
        try {
            const data = await MasterPegawai.query()
                                            .where('kode_lokasi', params.kode_lokasi)
                                            .orderBy('kode_eselon', 'desc')
                                            .orderBy('kode_jabatan', 'desc')
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            const data = await MasterPegawai.query()
                                            .whereBetween('kode_lokasi', [startLokasi, endLokasi])
                                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
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
    
            const data = await MasterPegawai.query()
                                            .whereBetween('kode_lokasi', [startLokasi, endLokasi])
                                            
            return Response.format(true, null, data)   
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detail({params}){
        try {
            const data = await MasterPegawai.query()
                                            .where('nip', params.nip)
                                            .first()
            if (data) {
                return Response.format(true, null, data)            
            } else {
                return Response.format(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }   
    }
}

module.exports = MasterPegawaiController
