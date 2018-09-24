'use strict'

const Response = use('App/Helpers/ResponseHelper')

class setFirebase {
  get rules () {
    return {
      firebase_device: 'required',
      firebase_token: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = setFirebase
