'use strict'

const Response = use('App/Helpers/ResponseHelper')

class CheckTokenSys {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.authenticator('jwt_sys').getUser()
      
      await next()
    } catch (error) {
      return response.send(Response.format(false, 'Token tidak valid', null))
    }
  }
}

module.exports = CheckTokenSys
