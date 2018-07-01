'use strict'

class CheckTokenTu {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.getUser()
      if (user.level != 3) {
        response.send({
          success: false, 
          message: `You can't access this feature`,
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

module.exports = CheckTokenTu
