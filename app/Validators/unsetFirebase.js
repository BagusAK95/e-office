'use strict'

const Response = use('App/Helpers/ResponseHelper')

class unsetFirebase {
  get rules () {
    return {
      firebase_device: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = unsetFirebase
