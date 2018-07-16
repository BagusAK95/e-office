'use strict'

class CheckToken {
  async handle ({ auth, response }, next) {
    try {
      await auth.getUser()
      await next()
    } catch (error) {
      response.send({
        success: false, 
        message: 'Token tidak valid',
        data: null
      })
    }
  }
}

module.exports = CheckToken
