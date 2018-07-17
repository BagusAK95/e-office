'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')

class UserController {
    async add({ request }) { //Todo: Check Kode Lokasi
        try {
            let data = request.all()
            data.password = await Hash.make(data.password)

            const insert = await Login.create(data)
            return this.response(true, null, insert)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async edit({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            let data = request.only(['nohp', 'email', 'foto', 'password', 'level', 'akses', 'status'])
            if (data.password != null) {
                data.password = await Hash.make(data.password)
            }

            const edit = await Login.query()
                                    .where('nip', params.nip)
                                    .whereBetween('kode_lokasi', [Number(startLokasi), Number(endLokasi)])
                                    .update(data)
            if (edit > 0) {
                return this.response(true, null, edit)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            const destroy = await Login.query()
                                       .where('nip', params.nip)
                                       .whereBetween('kode_lokasi', [Number(startLokasi), Number(endLokasi)])
                                       .delete()
            if (destroy > 0) {
                return this.response(true, null, destroy)                
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            let sql = []
            if (request.get().nama) {
                sql.push(`nama_lengkap LIKE '%` + request.get().nama + `%'`)
            }
            sql.push('kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi)

            const data = await Login.query()
                                    .whereRaw(sql.join(' AND '))
                                    .paginate(Number(request.get().page), Number(request.get().limit))
                                
            return this.response(true, null, data)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)            
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            const data = await Login.query()
                                    .where('nip', params.nip)
                                    .whereBetween('kode_lokasi', [Number(startLokasi), Number(endLokasi)])
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

module.exports = UserController
