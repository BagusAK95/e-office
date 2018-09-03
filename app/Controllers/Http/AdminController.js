'use strict'

const Hash = use('Hash')
const Admin = use('App/Models/Admin')
const Response = use('App/Helpers/ResponseHelper')

class AdminController {
    async getToken ({ request, auth }) {
        try {
            const { email, password } = request.all()
            const data = await Admin.query().where({'email': email}).first()
            if (data) {
                const isSame = await Hash.verify(password, data.password)
                if (isSame) {
                    if (data.status == 1) {
                        const token = await auth.authenticator('jwt_sys').generate(data)

                        return Response.format(true, null, token)
                    } else {
                        return Response.format(false, 'Admin tidak aktif', null)
                    }
                } else {
                    return Response.format(false, 'Kata sandi salah', null)
                }
            } else {
                return Response.format(false, 'Email tidak ditemukan', null)
            }    
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async getProfile({ auth }) {
        try {
            const user = await auth.authenticator('jwt_sys').getUser()
            return Response.format(true, null, user)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async editProfile({ request, auth }) {
        try {
            const user = await auth.authenticator('jwt_sys').getUser()
            
            const data = request.only(['nama_lengkap', 'nohp', 'email', 'foto'])

            const update = await Admin.query()
                                      .where('id', user.id)
                                      .update(data)
            if (update > 0) {
                return Response.format(true, null, update)
            } else {
                return Response.format(false, 'Admin tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = AdminController
