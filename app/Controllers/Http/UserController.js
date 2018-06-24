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

            const edit = await Login.query().whereRaw(`(nip = '` + params.nip + `') AND (kode_lokasi BETWEEN ` + startLokasi + ` AND ` +  endLokasi + `)`).update(data)
            if (edit > 0) {
                return this.response(true, null, edit)
            } else {
                return this.response(false, 'Not found', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async destroy({ params, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            const destroy = await Login.query().whereRaw(`(nip = '` + params.nip + `') AND (kode_lokasi BETWEEN ` + startLokasi + ` AND ` +  endLokasi + `)`).delete()
            if (destroy > 0) {
                return this.response(true, null, destroy)                
            } else {
                return this.response(false, 'Not found', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async list({ params, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')
            const sql1 = '(kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi + ')'
            const sql2 = (params.nama != '%7Bnama%7D') ? ` AND (nama_lengkap LIKE '%` + params.nama + `%')` : ''

            const data = await Login.query()
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

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')
            const sql1 = '(kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi + ')'
            const sql2 = ` AND (nip = '` + params.nip + `')`

            const data = await Login.query().whereRaw(sql1 + sql2).first()
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

module.exports = UserController
