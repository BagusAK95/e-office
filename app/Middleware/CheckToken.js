'use strict'

const Response = use('App/Helpers/ResponseHelper')

class CheckToken {
  async handle ({ auth, response }, next) {
    try {
      await auth.getUser()
      await next()
    } catch (error) {
      response.send(Response.format(false, 'Token tidak valid', null))
    }
  }
}

module.exports = CheckToken
