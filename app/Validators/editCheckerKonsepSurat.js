'use strict'

const Response = use('App/Helpers/ResponseHelper')

class editCheckerKonsepSurat {
  get rules () {
    return {
      arr_pemeriksa: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = editCheckerKonsepSurat
