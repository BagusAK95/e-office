'use strict'

const Komentar = use('App/Models/Komentar')
const SuratMasuk = use('App/Models/SuratMasuk')
const Disposisi = use('App/Models/Disposisi')

class KomentarController {
    async add({ request, auth }){
        try {
            const user = await auth.getUser()

            let data = request.all()
            data.nip_pengirim = user.nip

            if (data.id_surat_masuk) {
                const dataSurat = await SuratMasuk.query().where('id', data.id_surat_masuk).first()
                if (dataSurat) {
                    data.nip_penerima = dataSurat.nip_tata_usaha
                }
            }

            if (data.id_disposisi) {
                const dataDisposisi = await Disposisi.query().where('id', data.id_disposisi).first()
                if (dataDisposisi) {
                    data.nip_penerima = dataDisposisi.nip_pengirim
                }
            }

            const insert = await Komentar.create(data)
            return this.response(true, null, insert)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            if (request.get().id_surat_masuk) {
                sql.push('id_surat_masuk = ' + request.get().id_surat_masuk)
            }
            if (request.get().id_disposisi) {
                sql.push('id_disposisi = ' + request.get().id_disposisi)
            }
            sql.push(`(nip_pengirim = '` + user.nip + `' OR nip_penerima = '` + user.nip + `')`)
    
            const data = await Komentar.query()
                                        .whereRaw(sql.join(' AND '))
                                        .with('penerima_')
                                        .with('pengirim_')
                                        .paginate(Number(request.get().page), Number(request.get().limit))
            if (data) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }   
        } catch (error) {            
            return this.response(false, error.sqlMessage, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const destroy = await Komentar.query().where({ id: Number(params.id), nip_pengirim: user.nip }).delete()
            if (destroy > 0) {                
                return this.response(true, null, destroy)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async response(success, message, data) {
        return {
            success: success, 
            message: message,
            data: data
        }
    }
}

module.exports = KomentarController
