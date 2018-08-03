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
            
            Log.add(user, 'Menambah Tujuan Surat Dengan Nama ' + data.nama, data)

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async edit({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            let update = await SuratGroupTujuan.query()
                                               .where({ nip: user.nip, id: params.id })
                                               .first()
            if (update > 0) {
                update.nama = data.nama
                update.data = data.data
                await update.save()

                Log.add(user, 'Mengubah Tujuan Surat Dengan Nama ' + update.nama, update)

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

            const data = await SuratGroupTujuan.query()
                                               .where({ nip: user.nip, id: params.id })
                                               .first()
            if (data) {
                await data.delete()

                Log.add(user, 'Menghapus Tujuan Surat Dengan Nama ' + data.nama, data)

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

            Log.add(user, 'Melihat Daftar Tujuan Surat Pada Halaman ' + request.get().page)

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
                Log.add(user, 'Melihat Detail Tujuan Surat Dengan Nama ' + data.nama)

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
