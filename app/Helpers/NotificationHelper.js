const Request = use('request')
const AsyncLoop = require('node-async-loop')
const Notifikasi = use('App/Models/Notifikasi')
const Login = use('App/Models/Login')

const NotificationHelper = {
    send: function(nip_pengirim, nip_penerima, isi, url) {
        AsyncLoop(nip_penerima, async (nip, next) => {
            try {
                const insert = await Notifikasi.create({
                    nip_pengirim: nip_pengirim,
                    nip_penerima: nip,
                    isi: isi,
                    url: url
                })

                if (insert) {
                    const user = await Login.query().where('nip', nip).first()
                    if (user) {
                        for (let i = 1; i <= 2; i++) {
                            let firebase = ((i == 1) ? user.firebase_web : user.firebase_app)

                            const form = {
                                notification: {
                                  title: 'e-office',
                                  body: isi
                                },
                                to: firebase
                            }

                            Request.post({url: 'https://fcm.googleapis.com/fcm/send', form: form})
                        }

                        next()
                    } else {
                        next()
                    }
                } else {
                    next()
                }
            } catch (error) {
                next()
            }
        })
    }
}

module.exports = NotificationHelper