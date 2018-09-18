'use strict'

const Notifikasi = use('App/Models/Notifikasi')
const Notification = use('App/Helpers/NotificationHelper')
const Response = use('App/Helpers/ResponseHelper')
const Login = use('App/Models/Login')

class NotifikasiController {
    async list({ request, auth }){
        try {
            const user = await auth.getUser()

            const data = await Notifikasi.query()
                                         .where('nip_penerima', user.nip)
                                         .with('pengirim_')
                                         .orderBy('tgl', 'desc')
                                         .paginate(Number(request.get().page), Number(request.get().limit))

            const count = await Notifikasi.query()
                                          .where({ nip_penerima: user.nip, status: 0 })
                                          .getCount()

            return Response.format(true, count, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async markAsRead({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const data = await Notifikasi.query()
                                         .where({id: params.id, nip_penerima: user.nip})
                                         .first()
            
            if (data) {
                data.status = 1
                data.save()

                return Response.format(true, data.url, data.isi)                
            } else {
                return Response.format(false, 'Notifikasi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async broadcast({ request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            if (!data.arr_penerima || data.arr_penerima == '') {
                const penerima = await Login.query().where({ instansi: user.instansi })
                const arr_penerima = penerima.map(e => {
                    return e.nip
                })

                Notification.send(user, arr_penerima, 'Broadcast: ' + data.pesan, null, data.gambar)
                return Response.format(true, null, arr_penerima.length)
            } else {
                Notification.send(user, data.arr_penerima.split(','), 'Broadcast: ' + data.pesan, null, data.gambar)
                return Response.format(true, null, data.arr_penerima.split(',').length)
            }
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }
}

module.exports = NotifikasiController
