'use strict'

const Response = use('App/Helpers/ResponseHelper')

class editProfilePassword {
  get rules () {
    return {
      password_old: 'required',
      password_new: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = editProfilePassword
