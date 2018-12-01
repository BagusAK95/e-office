'use strict'

const Response = use('App/Helpers/ResponseHelper')
const SuratTemplate = use('App/Models/SuratTemplate')
const Log = use('App/Helpers/LogHelper')

class SuratTemplateController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser()
            
            let data = request.all()
            data.instansi = user.instansi
            
            const insert = await SuratTemplate.create(data)

            Log.add(user, 'Membuat Template Surat Berjudul ' + data.judul, insert)

            return Response.format(true, null, insert)            
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async edit({ request, params, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const dataTemplate = await SuratTemplate.query()
                                                    .where({ id: params.id, instansi: user.instansi })
                                                    .first()
            if (dataTemplate) {
                dataTemplate.judul = data.judul
                dataTemplate.isi = data.isi
                await dataTemplate.save()

                Log.add(user, 'Mengubah Template Surat Berjudul ' + data.judul, data)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Template Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const dataTemplate = await SuratTemplate.query()
                                                    .where({ id: params.id, instansi: user.instansi })
                                                    .first()
            if (dataTemplate) {
                await dataTemplate.delete()
                
                Log.add(user, 'Menghapus Template Surat Berjudul ' + dataTemplate.judul, dataTemplate)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Template Surat tidak ditemukan', null)
            }
        } catch (error) {            
            return Response.format(false, error, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratTemplate.query()
                                            .whereRaw('instansi = ' + user.instansi + ' OR instansi IS NULL')
                                            .paginate(Number(request.get().page), Number(request.get().limit))

            Log.add(user, 'Melihat Daftar Template Surat Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratTemplate.query()
                                            .where({ id: params.id })
                                            .first()
            if (data) {
                Log.add(user, 'Melihat Detail Template Surat Dengan Judul ' + data.judul)

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Template Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    /* System */

    async add_Sys({ request, auth }) {
        try {
            const user = await auth.getUser()
            
            let data = request.all()
            
            const insert = await SuratTemplate.create(data)

            Log.add(user, 'Membuat Template Surat Berjudul ' + data.judul, insert)

            return Response.format(true, null, insert)            
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async edit_Sys({ request, params, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const dataTemplate = await SuratTemplate.query()
                                                    .where({ id: params.id })
                                                    .first()
            if (dataTemplate) {
                dataTemplate.judul = data.judul
                dataTemplate.isi = data.isi
                await dataTemplate.save()

                Log.add(user, 'Mengubah Template Surat Berjudul ' + data.judul, data)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Template Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async delete_Sys({ params, auth }) {
        try {
            const user = await auth.getUser()

            const dataTemplate = await SuratTemplate.query()
                                                    .where({ id: params.id })
                                                    .first()
            if (dataTemplate) {
                await dataTemplate.delete()
                
                Log.add(user, 'Menghapus Template Surat Berjudul ' + dataTemplate.judul, dataTemplate)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Template Surat tidak ditemukan', null)
            }
        } catch (error) {            
            return Response.format(false, error, null)
        }
    }

    async list_Sys({ request, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratTemplate.query()
                                            .paginate(Number(request.get().page), Number(request.get().limit))

            Log.add(user, 'Melihat Daftar Template Surat Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async detail_Sys({ params, auth }) {
        try {
            const user = await auth.getUser()
            const data = await SuratTemplate.query()
                                            .where({ id: params.id })
                                            .first()
            if (data) {
                Log.add(user, 'Melihat Detail Template Surat Dengan Judul ' + data.judul)

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Template Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratTemplateController
