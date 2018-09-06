const Request = require('request')
const AsyncLoop = require('node-async-loop')
const Notifikasi = use('App/Models/Notifikasi')
const Login = use('App/Models/Login')
const Env = use('Env')

const NotificationHelper = {
    send: function(pengirim, penerima, isi, url) {
        AsyncLoop(penerima, async (nip, next) => {
            try {
                if (nip === "") {
                    next()
                } else {
                    const insert = await Notifikasi.create({
                        nip_pengirim: pengirim.nip,
                        nip_penerima: nip,
                        isi: pengirim.nama_lengkap.trim() + ' ' + isi.trim(),
                        url: url
                    })
    
                    if (insert) {
                        const user = await Login.query().where('nip', nip).first()
                        if (user) {
                            for (let i = 1; i <= 2; i++) {
                                const firebase = ((i == 1) ? user.firebase_web : user.firebase_app)
                                if (firebase) {
                                    const response = ((i == 1) ? 'response_web' : 'response_app')
    
                                    Request.post({
                                        url: 'https://fcm.googleapis.com/fcm/send',
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': 'key=' + Env.get('FIREBASE_SERVER_KEY')
                                        },
                                        body : JSON.stringify({
                                            notification: {
                                                title: pengirim.nama_lengkap.trim(),
                                                body: isi,
                                                icon: pengirim.foto,
                                                sound: 'the_little_dwarf.mp3',
                                                click_action: '/notifikasi/' + insert.id
                                            },
                                            data: {
                                                id: insert.id,
                                                title: pengirim.nama_lengkap.trim(),
                                                body: isi,
                                                icon: pengirim.foto,
                                                click_action: '/notifikasi/' + insert.id
                                            },
                                            to: firebase
                                        })
                                    }, async (err, resp, body) => {
                                        (err) ? insert[response] = err : insert[response] = body
                                        await insert.save()
                                    })
                                }
                            }
    
                            next()
                        } else {
                            next()
                        }
                    } else {
                        next()
                    }
                }
            } catch (error) {
                next()
            }
        })
    }
}

module.exports = NotificationHelper