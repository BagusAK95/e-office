'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')

class LoginController {
    async getToken ({ request, auth }) {
        try {
            const { nip, password } = request.all()
            const data = await Login.query().where({'nip': nip}).first()
            if (data) {
                const isSame = await Hash.verify(password, data.password)
                if (isSame) {
                    if (data.status == 1) {
                        const token = await auth.generate(data)
                        return Response.format(true, null, token)
                    } else {
                        return Response.format(false, 'User tidak aktif', null)
                    }
                } else {
                    return Response.format(false, 'Kata sandi salah', null)
                }
            } else {
                return Response.format(false, 'NIP tidak ditemukan', null)
            }    
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async setFirebase({ request, auth}){
        try {
            const user = await auth.getUser()

            const data = request.only(['firebase_device', 'firebase_token'])

            const update = await Login.query()
                                      .where('nip', user.nip)
                                      .update({
                                          ['firebase_' + data.firebase_device.toLowerCase()]: data.firebase_token 
                                      })
            if (update > 0) {
                return Response.format(true, null, update)                
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = LoginController
