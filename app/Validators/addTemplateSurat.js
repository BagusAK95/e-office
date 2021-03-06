'use strict'

class addTemplateSurat {
  get rules () {
    return {
      judul: 'required',
      isi: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = addTemplateSurat
