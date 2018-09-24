'use strict'

const Response = use('App/Helpers/ResponseHelper')

class addUser {
  get rules () {
    return {
      nip: 'required',
      nama_lengkap: 'required',
      password: 'required',
      kode_lokasi: 'required',
      level: 'required',
      akses: 'required',
      status: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = addUser
