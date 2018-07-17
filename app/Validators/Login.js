'use strict'

const Response = use('App/Helpers/ResponseHelper')

class Login {
  get rules () {
    return {
      nip: 'required',
      password: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = Login
