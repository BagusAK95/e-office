'use strict'

const Komentar = use('App/Models/Komentar')
const SuratMasuk = use('App/Models/SuratMasuk')
const Disposisi = use('App/Models/Disposisi')
const Response = use('App/Helpers/ResponseHelper')
const Array = use('App/Helpers/ArrayHelper')
const Notification = use('App/Helpers/NotificationHelper')

class KomentarController {
    async add({ request, auth }){
        try {
            const user = await auth.getUser()

            let data = request.all()
            data.nip_pengirim = user.nip

            const insert = await Komentar.create(data)

            /* --- Kirim Notifikasi --- */

            let arr_penerima = []
            let konten = ''
            let nomor = ''
            let url = ''
            if (data.id_surat_masuk) {
                konten = 'Surat Masuk'

                const surat = await SuratMasuk.find(data.id_surat_masuk)
                if (surat) {
                    arr_penerima = [surat.nip_tata_usaha, surat.nip_pimpinan, surat.nip_plt]
                    nomor = surat.nomor_surat
                    url = '/surat-masuk/' + data.id_surat_masuk
                }
            } else if (data.id_disposisi) {
                konten = 'Disposisi Surat'

                const disposisi = await Disposisi.query().where('id', data.id_disposisi).with('surat_').first()
                if (disposisi) {
                    const json = JSON.parse(JSON.stringify(disposisi))
                    arr_penerima = [disposisi.nip_penerima, disposisi.nip_pengirim]
                    nomor = json.surat_.nomor_surat

                    if (user.nip == disposisi.nip_penerima) {
                        url = '/disposisi-keluar/' + data.id_disposisi
                    } else {
                        url = '/disposisi-masuk/' + data.id_disposisi
                    }
                }
            }

            arr_penerima = Array.remove(arr_penerima, user.nip)
            if (arr_penerima.length > 0) {
                Notification.send([user.nip, user.nama_lengkap], arr_penerima, 'Mengomentari ' + konten + ' Nomor ' + nomor, url)
            }

            /* --- Kirim Notifikasi --- */

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
                return Response.format(false, 'Komentar tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = KomentarController
