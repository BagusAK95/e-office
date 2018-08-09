'use strict'

const SuratPengiriman = use('App/Models/SuratPengiriman')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')

class SuratPengirimanController {
    async updateResi({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const pengiriman = await SuratPengiriman.find(params.id)
            if (pengiriman) {
                pengiriman.kurir = data.kurir
                pengiriman.resi = data.resi
                pengiriman.save()

                Log.add(user, 'Update Resi Pengiriman Surat Ke ' + pengiriman.instansi, pengiriman)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Surat pengiriman tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratPengirimanController
