'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')

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
                        return this.response(true, null, token)
                    } else {
                        return this.response(false, 'User tidak aktif', null)
                    }
                } else {
                    return this.response(false, 'Kata sandi salah', null)
                }
            } else {
                return this.response(false, 'NIP tidak ditemukan', null)
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

module.exports = LoginController
