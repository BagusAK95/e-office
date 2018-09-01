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
}

module.exports = AdminController
