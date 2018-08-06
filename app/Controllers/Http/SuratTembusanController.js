'use strict'

const Response = use('App/Helpers/ResponseHelper')
const SuratTembusan = use('App/Models/SuratTembusan')
const Notification = use('App/Helpers/NotificationHelper')
const Log = use('App/Helpers/LogHelper')

class SuratTembusanController {
    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

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
                    sql.push('instansi_penerima = ' + user.instansi)
                    break;
                case 2: //Pimpinan
                    sql.push('instansi_penerima = ' + user.instansi)
                    sql.push('status_surat = 1')
                    break;
                default: //Staff
                    return Response.format(false, 'Akses ditolak', null)
                    break;
            }

            const data = await SuratTembusan.query()
                                            .whereRaw(sql.join(' AND '))
                                            .orderBy('tgl_terima', 'desc')
                                            .paginate(Number(request.get().page), Number(request.get().limit))
            
            Log.add(user, 'Melihat Daftar Surat Tembusan Pada Halaman ' + request.get().page)
            
            return Response.format(true, null, data)            
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async detail({ params, auth}) {
        try {
            const user = await auth.getUser()
            
            const data = await SuratTembusan.query()
                                            .where({ id: Number(params.id), instansi_penerima: user.instansi })
                                            .with('klasifikasi_')
                                            .first()
            if (data) {
                if (data.nip_pimpinan == user.nip) {
                    if (data.tgl_baca_pimpinan == null) {
                        data.tgl_baca_pimpinan = new Date()
                        await data.save()                    
                    }
                } else if (data.nip_tata_usaha == user.nip) {
                    if (data.tgl_baca_tata_usaha == null) {
                        data.tgl_baca_tata_usaha = new Date()
                        await data.save()
                    }
                }
                
                Log.add(user, 'Melihat Detail Surat Tembusan Nomor ' + data.nomor_surat)

                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async send({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.only(['tgl_terima', 'lampiran'])

            let dataSurat = await SuratTembusan.query()
                                                .where({ instansi_penerima: user.instansi, id: params.id })
                                                .first()
            if (dataSurat) {
                const dataPimpinan = await Login.query()
                                                .where({ level: 2, instansi: user.instansi })
                                                .first()
                if (dataPimpinan) {
                    dataSurat.nip_pimpinan = dataPimpinan.nip
                    dataSurat.nama_pimpinan = dataPimpinan.nama_lengkap
                    dataSurat.jabatan_pimpinan = dataPimpinan.nama_jabatan
                    dataSurat.tgl_terima = data.tgl_terima
                    dataSurat.lampiran = data.lampiran
                    dataSurat.status_surat = 1
                    dataSurat.keyword = ''.concat(dataSurat.nomor_surat, ' | ', dataSurat.nama_instansi, ' | ', dataSurat.perihal, ' | ', dataSurat.nama_pengirim)
                    dataSurat.save()

                    Notification.send([user.nip, user.nama_lengkap], [dataPimpinan.nip], 'Mengirimkan Surat Nomor ' + dataSurat.nip_tata_usaha + ' Sebagai Tembusan', '/surat-tembusan/' + params.id)
                
                    Log.add(user, 'Mengirimkan Surat Tembusan Nomor ' + dataSurat.nomor_surat + ' Ke Pimpinan', dataSurat)

                    return Response.format(true, null, 1)
                } else {
                    return Response.format(false, 'Pimpinan tidak ditemukan.', null)
                }
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)   
        }
    }

    async unreadAmount({ auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            switch (user.level) {
                case 3: //Tata Usaha
                    sql.push(`nip_tata_usaha = '` + user.nip + `'`)
                    sql.push('tgl_baca_tata_usaha IS NULL')
                    break;
                case 2: //Pimpinan
                    sql.push(`nip_pimpinan = '` + user.nip + `'`)
                    sql.push('status_surat = 1')
                    sql.push('tgl_baca_pimpinan IS NULL')
                    break;
                default:
                    return Response.format(false, 'Akses ditolak', null)
                    break;
            }
            sql.push('instansi_penerima = ' + user.instansi)

            const count = await SuratTembusan.query()
                                             .whereRaw(sql.join(' AND '))
                                             .getCount()
            
            return Response.format(true, null, count)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratTembusanController
