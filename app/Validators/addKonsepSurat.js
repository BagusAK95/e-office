'use strict'

const Response = use('App/Helpers/ResponseHelper')

class addKonsepSurat {
  get rules () {
    return {
      nip_penandatangan: 'required',
      nama_penandatangan: 'required',
      jabatan_penandatangan: 'required',
      tgl_surat: 'required',
      arr_penerima: 'required',
      arr_pemeriksa: 'required',
      perihal: 'required',
      keamanan: 'required',
      kecepatan: 'required',
      klasifikasi: 'required',
      ringkasan: 'required',
      isi_surat: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = addKonsepSurat
