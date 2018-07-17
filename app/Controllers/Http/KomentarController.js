'use strict'

const Komentar = use('App/Models/Komentar')
const Response = use('App/Helpers/ResponseHelper')

class KomentarController {
    async add({ request, auth }){
        try {
            const user = await auth.getUser()

            let data = request.all()
            data.nip_pengirim = user.nip

            const insert = await Komentar.create(data)
            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async list({ request }) {
        try {
            let sql = []
            if (request.get().id_surat_masuk) {
                sql.push('id_surat_masuk = ' + request.get().id_surat_masuk)
            }
            if (request.get().id_disposisi) {
                sql.push('id_disposisi = ' + request.get().id_disposisi)
            }
    
            const data = await Komentar.query()
                                       .whereRaw(sql.join(' AND '))
                                       .with('pengirim_')
                                       .orderBy('tgl', 'asc')
                                       .paginate(Number(request.get().page), Number(request.get().limit))
                        
            return Response.format(true, null, data)
        } catch (error) {            
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const destroy = await Komentar.query()
                                          .where({ id: Number(params.id), nip_pengirim: user.nip })
                                          .delete()
            if (destroy > 0) {                
                return Response.format(true, null, destroy)
            } else {
                return Response.format(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = KomentarController
