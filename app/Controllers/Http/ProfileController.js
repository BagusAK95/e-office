'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')

class ProfileController {
    async myProfile({auth}){
        try {
            const user = await auth.getUser()
            return this.response(true, null, user)            
        } catch (error) {
            return this.response(false, 'Missing or invalid jwt token', null)            
        }
    }

    async editProfile({ request, auth }) {
        try {
            const user = await auth.getUser()

            let data = request.only(['nohp', 'email', 'foto', 'password', 'level', 'akses', 'status'])
            if (data.password != null) {
                data.password = await Hash.make(data.password)
            }
    
            const edit = await Login.query().where('nip', user.nip).update(data)
            if (edit > 0) {
                return this.response(true, null, edit)                
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

module.exports = ProfileController
