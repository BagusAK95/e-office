'use strict'

const Response = use('App/Helpers/ResponseHelper')

class sendSuratTembusan {
  get rules () {
    return {
      tgl_terima: 'required',
      nomor_agenda: 'required',
      lampiran: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = sendSuratTembusan
