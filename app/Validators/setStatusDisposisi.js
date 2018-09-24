'use strict'

const Response = use('App/Helpers/ResponseHelper')

class setStatusDisposisi {
  get rules () {
    return {
      status: 'required',
      keterangan: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = setStatusDisposisi
