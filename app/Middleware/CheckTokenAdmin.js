'use strict'

class CheckTokenAdmin {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.getUser()
      if (user.level != 1) {
        response.send({
          success: false, 
          message: 'You are not admin',
          data: null
        })
      }
    } catch (error) {
      response.send({
        success: false, 
        message: 'Missing or invalid jwt token',
        data: null
      })
    }

    await next()
  }
}

module.exports = CheckTokenAdmin
