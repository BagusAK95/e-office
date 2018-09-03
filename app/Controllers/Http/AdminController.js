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

            const checkEmail = await Admin.query()
                                          .where('email', data.email)
                                          .whereNot('id', user.id)
                                          .first()
            if (!checkEmail) {
                const update = await Admin.query()
                                          .where('id', user.id)
                                          .update(data)
                if (update > 0) {
                    return Response.format(true, null, update)
                } else {
                    return Response.format(false, 'Admin tidak ditemukan', null)
                }
            } else {
                return Response.format(false, 'Email sudah digunakan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async editPassword({ request, auth }) {
        try {
            const user = await auth.authenticator('jwt_sys').getUser()

            let dataRequest = request.only(['password_old', 'password_new'])
            dataRequest.password_new = await Hash.make(dataRequest.password_new)

            const dataUser = await Admin.query().where({'id': user.id}).first()
            if (dataUser) {
                const isSame = await Hash.verify(dataRequest.password_old, dataUser.password)
                if (isSame) {
                    const edit = await Admin.query().where('id', user.id).update({ password: dataRequest.password_new })
                    if (edit > 0) {
                        return Response.format(true, null, edit)
                    } else {
                        return Response.format(false, 'Admin tidak ditemukan', null)
                    }
                } else {
                    return Response.format(false, 'Kata sandi tidak cocok', null)
                }
            } else {
                return Response.format(false, 'Token tidak valid', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = AdminController
