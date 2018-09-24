'use strict'

const Response = use('App/Helpers/ResponseHelper')

class addTujuanSurat {
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

module.exports = addTujuanSurat
