'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')

class ProfileController {
    async detail({auth}){
        try {
            const user = await auth.getUser()
            return Response.format(true, null, user)            
        } catch (error) {
            return Response.format(false, 'Token tidak valid', null)            
        }
    }

    async edit({ request, auth }) {
        try {
            const user = await auth.getUser()

            let data = request.only(['nohp', 'email', 'foto', 'level', 'akses', 'status'])
    
            const edit = await Login.query().where('nip', user.nip).update(data)
            if (edit > 0) {
                return Response.format(true, null, edit)                
            } else {
                return Response.format(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async editPassword({ request, auth }) {
        const user = await auth.getUser()

        let dataRequest = request.only(['password_old', 'password_new'])
        dataRequest.password_new = await Hash.make(dataRequest.password_new)

        const dataUser = await Login.query().where({'nip': user.nip}).first()
        if (dataUser) {
            const isSame = await Hash.verify(dataRequest.password_old, dataUser.password)
            if (isSame) {
                const edit = await Login.query().where('nip', user.nip).update({ password: dataRequest.password_new })
                if (edit > 0) {
                    return Response.format(true, null, edit)                
                } else {
                    return Response.format(false, 'Data tidak ditemukan', null)
                }
            } else {
                return Response.format(false, 'Kata sandi tidak cocok', null)
            }
        } else {
            return Response.format(false, 'Token tidak valid', null)
        }
    }
}

module.exports = ProfileController
