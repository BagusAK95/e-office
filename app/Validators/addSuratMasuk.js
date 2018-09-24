'use strict'

const Response = use('App/Helpers/ResponseHelper')

class addSuratMasuk {
  get rules () {
    return {
      tgl_terima: 'required',
      tgl_surat: 'required',
      nomor_surat: 'required',
      nomor_agenda: 'required',
      perihal: 'required',
      jenis_instansi: 'required',
      nama_instansi: 'required',
      nama_pengirim: 'required',
      jabatan_pengirim: 'required',
      alamat_pengirim: 'required',
      klasifikasi: 'required',
      keamanan: 'required',
      kecepatan: 'required',
      lampiran: 'required'
    }
  }

  async fails (errorMessages) {
    return this.ctx.response.send(Response.format(false, errorMessages[0].message, null))
  }
}

module.exports = addSuratMasuk
