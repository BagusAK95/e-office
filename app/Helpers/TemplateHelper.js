const fs = use('fs')
const Moment = use('moment')
const SuratKeluar = use('App/Models/SuratKeluar')
const MasterKantor = use('App/Models/MasterKantor')
const Login = use('App/Models/Login')

const TemplateHelper = {
  format: async function (id, disetujui, tandaTangan) {
    const surat = await SuratKeluar.find(id)
    const pimpinan = await Login.find(surat.nip_penandatangan)

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

        let pangkat = ''
        switch (pimpinan.golongan) {
          case 'I/a':
            pangkat = 'Juru Muda'
            break;
          case 'I/b':
            pangkat = 'Juru Muda Tingkat I'
            break;
          case 'I/c':
            pangkat = 'Juru'
            break;
          case 'I/d':
            pangkat = 'Juru Tingkat I'
            break;
          case 'II/a':
            pangkat = 'Pengatur Muda'
            break;
          case 'II/b':
            pangkat = 'Pengatur Muda Tingkat I'
            break;
          case 'II/c':
            pangkat = 'Pengatur'
            break;
          case 'II/d':
            pangkat = 'Pengatur Tingkat 1'
            break;
          case 'III/a':
            pangkat = 'Penata Muda'
            break;
          case 'III/b':
            pangkat = 'Penata Muda Tingkat I'
            break;
          case 'III/c':
            pangkat = 'Penata'
            break;
          case 'III/d':
            pangkat = 'Penata Tingkat I'
            break;
          case 'IV/a':
            pangkat = 'Pembina'
            break;
          case 'IV/b':
            pangkat = 'Pembina Tingkat I'
            break;
          case 'IV/c':
            pangkat = 'Pembina Utama Muda'
            break;
          case 'IV/d':
            pangkat = 'Pembina Utama Madya'
            break;
          case 'IV/e':
            pangkat = 'Pembina Utama'
            break;
          default:
            pangkat = ''
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
        if (disetujui === false) {
          if (tandaTangan) html = html.replace('{Tanda Tangan}', '<img src="http://latihaneoffice.patikab.go.id' + pimpinan.ttd + '" width="300px" />')
        } else {
          html = html.replace('{Tanda Tangan}', '<img src="http://latihaneoffice.patikab.go.id' + pimpinan.ttd_stempel + '" width="300px" />')
        }
        html = html.replace('{Tanggal}', Moment(surat.tgl_surat).format('DD MMMM YYYY'))
        html = html.replace('{Nomor}', surat.nomor_surat)
        html = html.replace('{Tujuan}', arrStrpenerima.join(''))
        html = html.replace('{Isi}', surat.isi_surat)
        html = html.replace('{Sifat}', sifat)
        html = html.replace('{Perihal}', surat.perihal)
        html = html.replace('{Jabatan}', pimpinan.nama_jabatan)
        html = html.replace('{Nama}', pimpinan.nama_lengkap)
        html = html.replace('{Pangkat}', pangkat)
        html = html.replace('{NIP}', pimpinan.nip)

        resolve(html)
      })
    })
  }
}

module.exports = TemplateHelper
