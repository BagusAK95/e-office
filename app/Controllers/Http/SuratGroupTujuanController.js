'use strict'

const SuratGroupTujuan = use('App/Models/SuratGroupTujuan')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')

class SuratGroupTujuanController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()
            data.nip = user.nip

            const insert = await SuratGroupTujuan.create(data)
            
            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async edit({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const update = await SuratGroupTujuan.query()
                                                 .where({ nip: user.nip, id: params.id })
                                                 .update(data)
            if (update > 0) {
                return Response.format(true, null, update)
            } else {
                return Response.format(false, 'Group tujuan tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const destroy = await SuratGroupTujuan.query()
                                                  .where({ nip: user.nip, id: params.id })
                                                  .delete()
            if (destroy > 0) {
                return Response.format(true, null, destroy)
            } else {
                return Response.format(false, 'Group tujuan tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratGroupTujuan.query()
                                               .where('nip', user.nip)
                                               .paginate(Number(request.get().page), Number(request.get().limit))

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratGroupTujuan.query()
                                               .where({nip: user.nip, id: params.id})
                                               .first()
            if (data) {
                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Group tujuan tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratGroupTujuanController
