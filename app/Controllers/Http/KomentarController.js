'use strict'

const Komentar = use('App/Models/Komentar')
const SuratMasuk = use('App/Models/SuratMasuk')
const Disposisi = use('App/Models/Disposisi')
const Response = use('App/Helpers/ResponseHelper')
const Array = use('App/Helpers/ArrayHelper')
const Notification = use('App/Helpers/NotificationHelper')
const Log = use('App/Helpers/LogHelper')

class KomentarController {
    async add({ request, auth }){
        try {
            const user = await auth.getUser() //Get data user yang login

            //Lengkapi data yang kurang
            let data = request.all()
            data.nip_pengirim = user.nip

            //Tambah data dari database
            const insert = await Komentar.create(data)

            let arr_penerima = []
            let konten = ''
            let nomor = ''
            let url = ''
            if (data.id_surat_masuk) {
                konten = 'Surat Masuk'

                //Ambil data surat dari database
                const surat = await SuratMasuk.find(data.id_surat_masuk)
                if (surat) {
                    arr_penerima = [surat.nip_tata_usaha, surat.nip_pimpinan, surat.nip_plt]
                    nomor = surat.nomor_surat
                    url = '/surat-masuk/' + data.id_surat_masuk

                    //Tambah log
                    Log.add(user, 'Mengomentari Surat Nomor ' + surat.nomor_surat, insert)
                } else {
                    return Response.format(false, 'Surat masuk tidak ditemukan', null)
                }
            } else if (data.id_disposisi) {
                konten = 'Disposisi Surat'

                //Get data disposisi dari database
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

                    //Tambah log
                    Log.add(user, 'Mengomentari Disposisi Dari ' + disposisi.nama_pengirim, insert)
                } else {
                    return Response.format(false, 'Disposisi tidak ditemukan', null)
                }
            }

            arr_penerima = Array.remove(arr_penerima, user.nip) //Hapus nip yang sama
            if (arr_penerima.length > 0) {
                //Kirim notifikasi
                Notification.send(user, arr_penerima, 'Mengomentari ' + konten + ' Nomor ' + nomor, url)
            }

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async list({ request }) {
        try {
            //Set SQL untuk filter
            let sql = []
            if (request.get().id_surat_masuk) {
                sql.push('id_surat_masuk = ' + request.get().id_surat_masuk)
            }
            if (request.get().id_disposisi) {
                sql.push('id_disposisi = ' + request.get().id_disposisi)
            }
    
            //Get data dari database
            const data = await Komentar.query()
                                       .whereRaw(sql.join(' AND '))
                                       .with('pengirim_')
                                       .orderBy('tgl', 'asc')
                                       .paginate(Number(request.get().page), Number(request.get().limit))
                        
            return Response.format(true, null, data)
        } catch (error) {            
            return Response.format(false, error, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login
            
            //Ambil data dari database
            const data = await Komentar.query()
                                    .where({ id: Number(params.id), nip_pengirim: user.nip })
                                    .first()
            if (data) {                
                await data.delete() //Delete data
                    
                //Tambah log
                if (data.id_surat_masuk) {
                    Log.add(user, 'Menghapus Komentar Untuk Surat Masuk', data)
                } else if (data.id_disposisi) {
                    Log.add(user, 'Menghapus Komentar Untuk Disposisi', data)
                }

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Komentar tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = KomentarController
