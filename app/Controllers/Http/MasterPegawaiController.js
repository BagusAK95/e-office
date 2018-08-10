'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const SuratMasuk = use('App/Models/SuratMasuk')

class MasterPegawaiController {
    async list({request, auth}){
        try {
            const user = await auth.getUser() //Get data user yang login
            
            //Varibale filter instansi
            const startLokasi = user.instansi
            const endLokasi = user.instansi.toString().replace(/\d{5}$/g, '99999')

            let sql = [] //Siapkan sql filter
            if (request.get().nama) {
                sql.push(`nama LIKE '%` + request.get().nama + `%'`)
            }
            sql.push('kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi)

            //Ambil data dari database
            const data = await MasterPegawai.query()
                                            .whereRaw(sql.join(' AND '))
                                            .paginate(Number(request.get().page), Number(request.get().limit))

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser() //Ambil data user yang login
            
            //Variable filter instansi
            const startLokasi = user.instansi
            const endLokasi = user.instansi.toString().replace(/\d{5}$/g, '99999')

            //Ambil data dari database
            const data = await MasterPegawai.query()
                                            .whereBetween('kode_lokasi', [startLokasi, endLokasi])
                                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async detail({params}){
        try {
            //Ambil data dari database
            const data = await MasterPegawai.query()
                                            .where('nip', params.nip)
                                            .first()
            if (data) {
                return Response.format(true, null, data)            
            } else {
                return Response.format(false, 'Pegawai tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }   
    }
}

module.exports = MasterPegawaiController
