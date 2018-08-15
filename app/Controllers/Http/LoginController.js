'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')

class LoginController {
    async getToken ({ request, auth }) {
        try {
            const { nip, password } = request.all()
            const data = await Login.query().where({'nip': nip}).first() //Get berdasarakn NIP
            if (data) {
                const isSame = await Hash.verify(password, data.password) //Pencocokan password
                if (isSame) {
                    if (data.status == 1) {
                        const token = await auth.generate(data) //Generate token

                        //Tambah Log
                        Log.add(data, 'Login Dari IP ' + request.header('x-forwarded-for'), token)
                        
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
            return Response.format(false, error, null)            
        }
    }

    async setFirebase({ request, auth}){
        try {
            const user = await auth.getUser() //Get data user yang login

            //Prepare data
            const data = request.only(['firebase_device', 'firebase_token'])

            //Update ke database
            const update = await Login.query()
                                      .where('nip', user.nip)
                                      .update({
                                          ['firebase_' + data.firebase_device.toLowerCase()]: data.firebase_token,
                                          firebase_info: data.firebase_info
                                      })
            if (update > 0) {
                return Response.format(true, null, update)                
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async unsetFirebase({ request, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            //Prepare data
            const data = request.only(['firebase_device'])

            //Update ke database
            const update = await Login.query()
                                      .where('nip', user.nip)
                                      .update({
                                          ['firebase_' + data.firebase_device.toLowerCase()]: null 
                                      })
            if (update > 0) {
                return Response.format(true, null, update)                
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = LoginController
