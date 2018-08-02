'use strict'

const Notifikasi = use('App/Models/Notifikasi')
const Response = use('App/Helpers/ResponseHelper')

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

                return Response.format(true, data.url, null)                
            } else {
                return Response.format(false, 'Notifikasi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = NotifikasiController
