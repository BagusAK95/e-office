'use strict'

const Response = use('App/Helpers/ResponseHelper')

class sendBroadcast {
  get rules () {
    return {
      pesan: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = sendBroadcast
