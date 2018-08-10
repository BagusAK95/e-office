'use strict'

const Response = use('App/Helpers/ResponseHelper')

class CheckToken {
  async handle ({ auth, response }, next, rule) {
    try {
      const user = await auth.getUser()
      if (rule[0] == 'admin') {
        if (user.level != 1) {
          return response.send(Response.format(false, 'Akses ditolak', null))
        }
      }

      if (rule[1]) {
        if (user.akses) {
          if (user.akses.split(',').indexOf(rule[1]) == -1) {
            return response.send(Response.format(false, 'Akses ditolak', null))
          }  
        } else {
          return response.send(Response.format(false, 'Akses ditolak', null))
        }
      }

      await next()
    } catch (error) {
      return response.send(Response.format(false, 'Token tidak valid', null))
    }
  }
}

module.exports = CheckToken
