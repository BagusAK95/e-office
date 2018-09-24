'use strict'

const Response = use('App/Helpers/ResponseHelper')

class editTujuanSurat {
  get rules () {
    return {
      nama: 'required',
      data: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = editTujuanSurat
