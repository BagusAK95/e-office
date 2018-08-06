'use strict'

const Disposisi = use('App/Models/Disposisi')
const SuratMasuk = use('App/Models/SuratMasuk')
const SuratKeluar = use('App/Models/SuratKeluar')
const SuratTembusan = use('App/Models/SuratTembusan')
const Response = use('App/Helpers/ResponseHelper')

class StatistikController {
    async total({ auth }) {
        try {
            const user = await auth.getUser()
            let arrData = []

            let sqlSuratMasuk = []
            switch (user.level) {
                case 3: //Tata Usaha
                    sqlSuratMasuk.push(`nip_tata_usaha = '` + user.nip + `'`)
                    break;
                case 2: //Pimpinan
                    sqlSuratMasuk.push(`nip_pimpinan = '` + user.nip + `'`)
                    sqlSuratMasuk.push('status_surat = 1')
                    break;
                default: //Staff
                    sqlSuratMasuk.push(`nip_plt = '` + user.nip + `'`)
                    sqlSuratMasuk.push('status_surat = 1')
                    break;
            }
            sqlSuratMasuk.push('instansi_penerima = ' + user.instansi)

            const countSuratMasuk = await SuratMasuk.query()
                                                    .whereRaw(sqlSuratMasuk.join(' AND '))
                                                    .getCount()
            arrData.push({ nama: 'Surat Masuk', total: countSuratMasuk })

            let sqlSuratTembusan = []
            switch (user.level) {
                case 3: //Tata Usaha
                    sqlSuratTembusan.push(`nip_tata_usaha = '` + user.nip + `'`)
                    break;
                case 2: //Pimpinan
                    sqlSuratTembusan.push(`nip_pimpinan = '` + user.nip + `'`)
                    sqlSuratTembusan.push('status_surat = 1')
                    break;
                default:
                    sqlSuratTembusan.push('status_surat = 9') //Biar Kosong Hasilnya
                    break;
            }
            sqlSuratTembusan.push('instansi_penerima = ' + user.instansi)

            const countSuratTembusan = await SuratTembusan.query()
                                                          .whereRaw(sqlSuratTembusan.join(' AND '))
                                                          .getCount()
            arrData.push({ nama: 'Surat Tembusan', total: countSuratTembusan })
            
            const countDisposisi = await Disposisi.query()
                                                  .where({ instansi: user.instansi, nip_penerima: user.nip })
                                                  .getCount()
            arrData.push({ nama: 'Disposisi', total: countDisposisi })

            const countKonsepSurat = await SuratKeluar.query()
                                                      .where('instansi_pengirim', user.instansi)
                                                      .whereBetween('status_surat', [1, 2])
                                                      .whereHas('pemeriksa_', (pemeriksa) => {
                                                          pemeriksa.where({ nip_pemeriksa: user.nip})
                                                                   .whereNot('status', 0)
                                                      })
                                                      .getCount()
            arrData.push({ nama: 'Konsep Surat', total: countKonsepSurat })
            
            const countSuratKeluar = await SuratKeluar.query()
                                                      .where({ instansi_pengirim: user.instansi, nip_tata_usaha: user.nip })
                                                      .whereBetween('status_surat', [3, 4])
                                                      .getCount()
            arrData.push({ nama: 'Surat Keluar', total: countSuratKeluar })

            return Response.format(true, null, arrData)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async unread({ auth }) {
        try {
            const user = await auth.getUser()
            let arrData = []

            let sqlSuratMasuk = []
            switch (user.level) {
                case 3: //Tata Usaha
                    sqlSuratMasuk.push(`nip_tata_usaha = '` + user.nip + `'`)
                    sqlSuratMasuk.push('tgl_baca_tata_usaha IS NULL')
                    break;
                case 2: //Pimpinan
                    sqlSuratMasuk.push(`nip_pimpinan = '` + user.nip + `'`)
                    sqlSuratMasuk.push('status_surat = 1')
                    sqlSuratMasuk.push('tgl_baca_pimpinan IS NULL')
                    break;
                default: //Staff
                    sqlSuratMasuk.push(`nip_plt = '` + user.nip + `'`)
                    sqlSuratMasuk.push('status_surat = 1')
                    sqlSuratMasuk.push('tgl_baca_plt IS NULL')
                    break;
            }
            sqlSuratMasuk.push('instansi_penerima = ' + user.instansi)

            const countSuratMasuk = await SuratMasuk.query()
                                                    .whereRaw(sqlSuratMasuk.join(' AND '))
                                                    .getCount()
            arrData.push({ nama: 'Surat Masuk', total: countSuratMasuk })

            let sqlSuratTembusan = []
            switch (user.level) {
                case 3: //Tata Usaha
                    sqlSuratTembusan.push(`nip_tata_usaha = '` + user.nip + `'`)
                    sqlSuratTembusan.push('tgl_baca_tata_usaha IS NULL')
                    break;
                case 2: //Pimpinan
                    sqlSuratTembusan.push(`nip_pimpinan = '` + user.nip + `'`)
                    sqlSuratTembusan.push('status_surat = 1')
                    sqlSuratTembusan.push('tgl_baca_pimpinan IS NULL')
                    break;
                default:
                    sqlSuratTembusan.push('status_surat = 9') //Biar Kosong Hasilnya
                    break;
            }
            sqlSuratTembusan.push('instansi_penerima = ' + user.instansi)

            const countSuratTembusan = await SuratTembusan.query()
                                                          .whereRaw(sqlSuratTembusan.join(' AND '))
                                                          .getCount()
            arrData.push({ nama: 'Surat Tembusan', total: countSuratTembusan })
            
            const countDisposisi = await Disposisi.query()
                                                  .where({ instansi: user.instansi, nip_penerima: user.nip, tgl_baca: null })
                                                  .getCount()
            arrData.push({ nama: 'Disposisi', total: countDisposisi })

            const countKonsepSurat = await SuratKeluar.query()
                                                      .where('instansi_pengirim', user.instansi)
                                                      .whereBetween('status_surat', [1, 2])
                                                      .whereHas('pemeriksa_', (pemeriksa) => {
                                                          pemeriksa.where({ nip_pemeriksa: user.nip, tgl_baca: null})
                                                                   .whereNot('status', 0)
                                                      })
                                                      .getCount()
            arrData.push({ nama: 'Konsep Surat', total: countKonsepSurat })
            
            const countSuratKeluar = await SuratKeluar.query()
                                                      .where({ instansi_pengirim: user.instansi, nip_tata_usaha: user.nip, tgl_baca_tata_usaha: null })
                                                      .whereBetween('status_surat', [3, 4])
                                                      .getCount()
            arrData.push({ nama: 'Surat Keluar', total: countSuratKeluar })

            return Response.format(true, null, arrData)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }    
}

module.exports = StatistikController
