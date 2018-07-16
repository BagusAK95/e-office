'use strict'

class CheckTokenAdmin {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.getUser()
      if (user.level != 1) {
        response.send({
          success: false, 
          message: 'Akses ditolak',
          data: null
        })
      } else {
        await next()
      }
    } catch (error) {
      response.send({
        success: false, 
        message: 'Token tidak valid',
        data: null
      })
    }
  }
}

module.exports = CheckTokenAdmin
