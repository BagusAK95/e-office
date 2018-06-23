'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')

class LoginController {
    async getUser({auth}){
        try {
            const user = await auth.getUser()
        } catch (err) {
            return this.response(false, 'Missing or invalid jwt token', null)
        }
    }
    
    async getToken ({ request, auth }) {
        const { nip, password } = request.all()
        const data = await Login.query().where({'nip': nip}).first()
        if (data) {
            const isSame = await Hash.verify(password, data.password)
            if (isSame) {
                if (data.status == 1) {
                    const token = await auth.generate(data)
                    return this.response(false, null, token)
                } else {
                    return this.response(false, 'User is non active', null)
                }
            } else {
                return this.response(false, 'Invalid user password', null)
            }
        } else {
            return this.response(false, 'Cannot find user with provided nip', null)
        }
    }

    async addUser({ request }) {
        return await Login.create(request.post)
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
