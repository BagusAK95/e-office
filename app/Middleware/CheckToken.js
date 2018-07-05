'use strict'

class CheckToken {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.getUser()
    } catch (error) {
      response.send({
        success: false, 
        message: 'Token tidak valid',
        data: null
      })
    }

    await next()
  }
}

module.exports = CheckToken
