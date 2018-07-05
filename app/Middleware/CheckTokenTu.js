'use strict'

class CheckTokenTu {
  async handle ({ auth, response }, next) {
    try {
      const user = await auth.getUser()
      if (user.level != 3) {
        response.send({
          success: false, 
          message: 'Akses ditolak',
          data: null
        })
      }
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

module.exports = CheckTokenTu
