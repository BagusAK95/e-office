'use strict'

const Disposisi = use('App/Models/Disposisi')

class DisposisiController {
    async add({ request, auth }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const user = await auth.getUser()
            if (user.akses.split(',').indexOf('disposisi') == -1) {
                return this.response(false, 'Akses ditolak', null)
            }

            const data = request.all()
            data.nip_pengirim = user.nip
            data.nama_pengirim = user.nama_lengkap
            data.jabatan_pengirim = user.nama_jabatan
            data.keyword = ''.concat(data.nama_penerima, ' | ', data.isi_disposisi)

            const insert = await Disposisi.create(data)
            return this.response(true, null, insert)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async listIn({ params, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            sql.push(`nip_penerima = '` + user.nip + `'`)
            if (params.tgl_awal != '%7Btgl_awal%7D') {
                sql.push(`tgl_disposisi >= '` + params.tgl_awal + `'`)
            }
            if (params.tgl_akhir != '%7Btgl_akhir%7D') {
                sql.push(`tgl_disposisi <= '` + params.tgl_akhir + `'`)
            }
            if (params.keyword != '%7Bkeyword%7D') {
                sql.push(`MATCH(keyword) AGAINST('` + params.keyword + `' IN BOOLEAN MODE)`)
            }

            const data = await Disposisi.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl_disposisi', 'desc')
                                        .paginate(Number(params.page), Number(params.limit))
            if (data) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)            
        }
    }

    async listOut({ params, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            sql.push(`nip_pengirim = '` + user.nip + `'`)
            if (params.tgl_awal != '%7Btgl_awal%7D') {
                sql.push(`tgl_disposisi >= '` + params.tgl_awal + `'`)
            }
            if (params.tgl_akhir != '%7Btgl_akhir%7D') {
                sql.push(`tgl_disposisi <= '` + params.tgl_akhir + `'`)
            }
            if (params.keyword != '%7Bkeyword%7D') {
                sql.push(`MATCH(keyword) AGAINST('` + params.keyword + `' IN BOOLEAN MODE)`)
            }

            const data = await Disposisi.query()
                                        .whereRaw(sql.join(' AND '))
                                        .orderBy('tgl_disposisi', 'desc')
                                        .paginate(Number(params.page), Number(params.limit))
            if (data) {
                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)            
        }
    }

    async listAllByMail({ params, auth }) {
        try {
            const data = await Disposisi.query()
                                        .where('id_surat_masuk', Number(params.id_surat_masuk))
                                        .orderBy('tgl_disposisi', 'desc')

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
            if (user.akses.split(',').indexOf('disposisi') == -1) {
                return this.response(false, 'Akses ditolak', null)
            }
            
            const destroy = await Disposisi.query().where({id: Number(params.id), nip_pengirim: user.nip}).delete()
            if (destroy > 0) {
                return this.response(true, null, destroy)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Disposisi.query()
                                        .whereRaw(`id = ` + params.id + ` AND (nip_penerima = '` + user.nip + `' OR nip_pengirim = '` + user.nip + `')`)
                                        .with('instruksi_')
                                        .with('surat_')
                                        .first()
            if (data) {
                if (data.status == 0) {
                    data.status = 1
                    data.tgl_baca = new Date()
                    await data.save()    
                }

                return this.response(true, null, data)
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

module.exports = DisposisiController
