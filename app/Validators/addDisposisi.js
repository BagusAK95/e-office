'use strict'

const Response = use('App/Helpers/ResponseHelper')

class addDisposisi {
  get rules () {
    return {
      id_surat_masuk: 'required',
      nip_penerima: 'required',
      nama_penerima: 'required',
      jabatan_penerima: 'required',
      instruksi: 'required',
      isi_disposisi: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = addDisposisi
