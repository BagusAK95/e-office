'use strict'

const SuratMasuk = use('App/Models/SuratMasuk')
const MasterPegawai = use('App/Models/MasterPegawai')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')

class SuratMasukController {
    async add({ request, auth }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const user = await auth.getUser()
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const dataPimpinan = await MasterPegawai.query().whereRaw('kode_lokasi = ' + instansi + ' AND kode_eselon IS NOT NULL').first()
            if (dataPimpinan == null) {
                return Response.format(false, 'Pimpinan tidak ditemukan.', null)
            }

            let data = request.all()
            data.instansi_penerima = instansi
            data.nip_tata_usaha = user.nip
            data.nama_tata_usaha = user.nama_lengkap
            data.jabatan_tata_usaha = user.nama_jabatan
            data.nip_pimpinan = dataPimpinan.nip
            data.nama_pimpinan = ''.concat(dataPimpinan.gelar_depan.trim(), ' ', dataPimpinan.nama.trim(), ' ', dataPimpinan.gelar_belakang.trim())
            data.jabatan_pimpinan = dataPimpinan.nama_jabatan
            data.status_surat = 1
            data.keyword = ''.concat(data.nomor_surat, ' | ', data.nama_instansi, ' | ', data.perihal, ' | ', data.nama_pengirim)

            const insert = await SuratMasuk.create(data)

            /* --- Kirim Notifikasi --- */
            let arr_penerima = [data.nip_pimpinan]
            if (data.nip_plt) {
                arr_penerima.push(data.nip_plt)
            }

            Notification.send(user.nip, arr_penerima, user.nama_lengkap + ' Mengirimkan Surat Nomor ' + data.nomor_surat, '')

            /* --- Kirim Notifikasi --- */

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            
            let sql = []
            if (request.get().tgl_awal) {
                sql.push(`tgl_surat >= '` + request.get().tgl_awal + `'`)
            }
            if (request.get().tgl_akhir) {
                sql.push(`tgl_surat <= '` + request.get().tgl_akhir + `'`)
            }
            if (request.get().keyword) {
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }

            switch (user.level) {
                case 3: //Tata Usaha
                    sql.push('instansi_penerima = ' + instansi)
                    break;
                case 2: //Pimpinan
                    sql.push('instansi_penerima = ' + instansi)
                    break;
                default: //Staff
                    sql.push(`nip_plt = '` + user.nip + `'`)
                    break;
            }

            const data = await SuratMasuk.query()
                                         .whereRaw(sql.join(' AND '))
                                         .orderBy('tgl_terima', 'desc')
                                         .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            const destroy = await SuratMasuk.query()
                                            .where({ id: Number(params.id), instansi_penerima: Number(instansi) })
                                            .delete()

            if (destroy > 0) {
                return Response.format(true, null, destroy)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detail({ params, auth}) {
        try {
            const user = await auth.getUser()
            
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            const data = await SuratMasuk.query()
                                         .where({ id: Number(params.id), instansi_penerima: Number(instansi) })
                                         .with('klasifikasi_')
                                         .with('tembusan_')
                                         .first()
            if (data) {
                if (data.nip_pimpinan == user.nip) {
                    if (data.tgl_baca_pimpinan == null) {
                        data.tgl_baca_pimpinan = new Date()
                        await data.save()                    
                    }
                } else if (data.nip_plt == user.nip) {
                    if (data.tgl_baca_plt == null) {
                        data.tgl_baca_plt = new Date()
                        await data.save()                    
                    }
                }
                
                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = SuratMasukController
