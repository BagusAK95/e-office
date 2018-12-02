const fs = use('fs')
const Moment = use('moment')
const SuratKeluar = use('App/Models/SuratKeluar')
const MasterKantor = use('App/Models/MasterKantor')
const Login = use('App/Models/Login')

const TemplateHelper = {
  format: async function (id, status) {
    const surat = await SuratKeluar.find(id)
    const pimpinan = await Login.find(surat.nip_penandatangan)
    const kantor = await MasterKantor.find(pimpinan.instansi)

    return new Promise((resolve, reject) => {
      fs.readFile('template.html', async (err, data) => {
        let html = data.toString()

        Moment.locale('id');

        let sifat = ''
        switch (surat.kecepatan) {
          case 1:
            sifat = 'Biasa'
            break;
          case 2:
            sifat = 'Segera'
            break;
          case 3:
            sifat = 'Amat Segera'
            break;
        }

        const arrIdPenerima = JSON.parse(surat.arr_penerima).map((e) => e.id_instansi)
        const arrDataPenerima = await MasterKantor.query().whereIn('kdlokasi', arrIdPenerima)
        const arrStrpenerima = []
        arrDataPenerima.forEach(penerima => {
          if (!penerima.pimpinan) penerima.pimpinan = 'Kepala'
          if (!penerima.singkatan) penerima.singkatan = penerima.nmlokasi

          arrStrpenerima.push('<li style="margin: 0in 0in 0.0001pt 0px; text-align: justify; line-height: 130%; font-size: 11pt; font-family: Calibri, sans-serif;"><span style="font-size: 12.0pt; line-height: 130%; font-family: Arial, sans-serif;">' + penerima.pimpinan + ' ' + penerima.singkatan + '</span></li>')
        })

        html = html.replace('{Kop}', '<img src="http://latihaneoffice.patikab.go.id' + pimpinan.kop_surat + '" />')
        if (status === false) {
          html = html.replace('{Tanda Tangan}', '<img src="http://latihaneoffice.patikab.go.id' + pimpinan.ttd + '" />')
        } else {
          html = html.replace('{Tanda Tangan}', '<img src="http://latihaneoffice.patikab.go.id' + pimpinan.ttd_stempel + '" />')
        }
        html = html.replace('{Tanggal}', Moment(surat.tgl_surat).format('DD MMMM YYYY'))
        html = html.replace('{Nomor}', surat.nomor_surat)
        html = html.replace('{Tujuan}', arrStrpenerima.join(''))
        html = html.replace('{Isi}', surat.isi_surat)
        html = html.replace('{Instansi}', kantor.nmlokasi)
        html = html.replace('{Sifat}', sifat)
        html = html.replace('{Perihal}', surat.perihal)
        html = html.replace('{Jabatan}', pimpinan.nama_jabatan)
        html = html.replace('{Nama}', pimpinan.nama_lengkap)
        html = html.replace('{NIP}', pimpinan.nip)

        resolve(html)
      })
    })
  }
}

module.exports = TemplateHelper
