'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')

class UserController {
    async add({ request, auth }) { //Todo: Check Kode Lokasi
        try {
            const user = await auth.getUser()

            let data = request.all()
            data.password = await Hash.make(data.password)
            data.instansi = user.instansi
            data.keyword = ''.concat(data.nama_lengkap, ' | ', data.nama_jabatan)

            const insert = await Login.create(data)

            let level = ''
            switch (Number(data.level)) {
                case 1:
                    level = 'Admin'
                    break;
                case 2:
                    level = 'Pimpinan'
                    break;
                case 3:
                    level = 'Tata Usaha'
                    break;
                case 4:
                    level = 'Staff'
                    break;
                case 5:
                    level = 'Sekretaris'
                    break;
            }

            Log.add(user, 'Menambahkan ' + data.nama_lengkap + ' Sebagai ' + level, insert)

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async edit({ params, request, auth }) {
        try {
            const user = await auth.getUser()

            let data = request.only(['nohp', 'email', 'foto', 'password', 'level', 'akses', 'status'])
            if (data.password != null) {
                data.password = await Hash.make(data.password)
            }

            const edit = await Login.query()
                                    .where({ nip: params.nip, instansi: user.instansi })
                                    .update(data)
            if (edit > 0) {
                return Response.format(true, null, edit)
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Login.query()
                                    .where({ nip: params.nip, instansi: user.instansi })
                                    .first()
            if (data) {
                await data.delete()

                Log.add(user, 'Menghapus User ' + data.nama_lengkap, data)

                return Response.format(true, null, destroy)                
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            if (request.get().keyword) {
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }
            sql.push('instansi = ' + user.instansi)

            const data = await Login.query()
                                    .whereRaw(sql.join(' AND '))
                                    .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')
                                    .paginate(Number(request.get().page), Number(request.get().limit))
                            
            Log.add(user, 'Melihat Daftar User Pada Halaman ' + request.get().page)
                                    
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Login.query()
                                    .where({ nip: params.nip, instansi: user.instansi })
                                    .with('lokasi_')
                                    .first()
            if (data) {
                Log.add(user, 'Melihat Detail User ' + data.nama_lengkap)

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser() //Ambil data user yang login
            const data = await Login.query()
                                    .where('instansi', user.instansi)
                                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }
}

module.exports = UserController
