'use strict'

const Response = use('App/Helpers/ResponseHelper')

class CheckTokenAdmin {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.getUser()
      if (user.level != 1) {
        response.send(Response.format(false, 'Akses ditolak', null))
      } else {
        await next()
      }
    } catch (error) {
      response.send(Response.format(false, 'Token tidak valid', null))
    }
  }
}

module.exports = CheckTokenAdmin
