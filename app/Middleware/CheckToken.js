'use strict'

class CheckToken {
  async handle ({ request }, next) {
    try {
      const user = await auth.getUser()
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

module.exports = CheckToken
