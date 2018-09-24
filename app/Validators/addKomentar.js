'use strict'

const Response = use('App/Helpers/ResponseHelper')

class addKomentar {
  get rules () {
    return {
      isi_komentar: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = addKomentar
