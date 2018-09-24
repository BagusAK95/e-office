'use strict'

const Response = use('App/Helpers/ResponseHelper')

class editStatusKonsepSurat {
  get rules () {
    return {
      status: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = editStatusKonsepSurat
