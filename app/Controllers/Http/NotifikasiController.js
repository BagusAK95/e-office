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
            return Response.format(false, error.sqlMessage, null)                
        }
    }

    async markAsRead({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const update = await Notifikasi.query()
                                           .where({id: params.id, nip_penerima: user.nip})
                                           .update({status: 1})
            
            if (update > 0) {
                return Response.format(true, null, update)                
            } else {
                return Response.format(false, 'Notifikasi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = NotifikasiController
