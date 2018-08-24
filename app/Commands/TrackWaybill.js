'use strict'

const {
  Command
} = require('@adonisjs/ace')
const SuratPengiriman = use('App/Models/SuratPengiriman')
const SuratKeluar = use('App/Models/SuratKeluar')
const Login = use('App/Models/Login')
const Notification = use('App/Helpers/NotificationHelper')
const Async = require('async')
const Request = require('request')
const Env = use('Env')

class TrackWaybill extends Command {
  static get signature() {
    return 'track-waybill'
  }

  static get description() {
    return 'Lacak Pengiriman Surat Keluar'
  }

  async handle(args, options) {
    this.process()
  }

  async process() {
    const listPengiriman = await SuratPengiriman.query().where('tgl_terima', null).whereNot('resi', null)
    Async.eachLimit(listPengiriman, 2, (pengiriman, next) => {
      Request.post({
        url: 'https://pro.rajaongkir.com/api/waybill',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
          key: Env.get('RAJAONGKIR_KEY'),
          waybill: pengiriman.resi,
          courier: pengiriman.kurir
        }
      }, async (err, resp, body) => {
        if (!err) {
          const jBody = JSON.parse(body)
          if (jBody.rajaongkir.status.code == 200) {
            if (jBody.rajaongkir.result.delivered == true) {
              pengiriman.tgl_terima = new Date(jBody.rajaongkir.result.delivery_status.pod_date)
              pengiriman.penerima = jBody.rajaongkir.result.delivery_status.pod_receiver
              await SuratPengiriman.query().where('id', pengiriman.id).update(pengiriman)

              //Kirim Notifikasi Ke Tata Usaha
              const dataTataUsaha = await Login.query()
                                               .where({ instansi: pengiriman.pengirim, level: 3 })
                                               .first()
              if (dataTataUsaha) {
                const dataSuratKeluar = await SuratKeluar.find(pengiriman.id_surat_keluar)
                if (dataSuratKeluar) {
                  const user = {
                    nip: null,
                    nama_lengkap: 'System',
                    foto: null
                  }
                  
                  Notification.send(user, [dataTataUsaha.nip], 'Mendeteksi Surat Nomor ' + dataSuratKeluar.nomor_surat + ' Telah Diterima Oleh ' + pengiriman.nama_instansi, '/surat-keluar/' + pengiriman.id_surat_keluar)                  
                }
              }

              console.log(pengiriman.kurir.toUpperCase() + ' (' + pengiriman.resi + ') => Delivered')
              next()
            } else {
              console.log(pengiriman.kurir.toUpperCase() + ' (' + pengiriman.resi + ') => In Shipping')
              next()
            }
          } else {
            console.log(pengiriman.kurir.toUpperCase() + ' (' + pengiriman.resi + ') => ' + jBody.rajaongkir.status.description)
            next()
          }
        } else {
          console.log(pengiriman.kurir.toUpperCase() + ' (' + pengiriman.resi + ') => ' + err)
          next()
        }
      })
    }, () => {
      console.log('No Queue, Wait Timeout 3 Hours...')
      this.waitTimeout()
    })
  }

  async waitTimeout() {
    setTimeout(() => {
      this.process()
    }, 10800000);
  }
}

module.exports = TrackWaybill
