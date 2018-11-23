'use strict'

const Response = use('App/Helpers/ResponseHelper')

class sendSuratKeluar {
  get rules () {
    return {
      nomor_surat: 'required',
      nomor_agenda: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = sendSuratKeluar
