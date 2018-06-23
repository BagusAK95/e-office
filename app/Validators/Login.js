'use strict'

class Login {
  get rules () {
    return {
      nip: 'required',
      password: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send({
      success: false,
      message: errorMessages[0].message,
      data: null
    })
  }
}

module.exports = Login
