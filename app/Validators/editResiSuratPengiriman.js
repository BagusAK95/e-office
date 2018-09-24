'use strict'

const Response = use('App/Helpers/ResponseHelper')

class editResiSuratPengiriman {
  get rules () {
    return {
      kurir: 'required',
      resi: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = editResiSuratPengiriman
