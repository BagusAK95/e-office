'use strict'

const SuratMasuk = use('App/Models/SuratMasuk')
const MasterPegawai = use('App/Models/MasterPegawai')
const Response = use('App/Helpers/ResponseHelper')

class SuratMasukController {
    async add({ request, auth }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const user = await auth.getUser()
            
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            let data = request.all()
            data.instansi_penerima = instansi
            data.nip_tata_usaha = user.nip
            data.keyword = ''.concat(data.nomor_surat, ' | ', data.nama_instansi, ' | ', data.perihal, ' | ', data.nama_pengirim, ' | ', data.nama_penerima)
            
            const dataPimpinan = await MasterPegawai.query()
                                                    .whereRaw('kode_lokasi = ' + instansi + ' AND kode_eselon IS NOT NULL')
                                                    .first()
            if (dataPimpinan) {
                data.nip_pimpinan = dataPimpinan.nip
            }

            const insert = await SuratMasuk.create(data)
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
                    sql.push(`nip_pimpinan = '` + user.nip + `'`)
                    break;
                default:
                    sql.push(`(nip_penerima = '` + user.nip + `' OR nip_tembusan = '` + user.nip + `')`)
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
                return Response.format(false, 'Data tidak ditemukan', null)
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
                                         .first()
            if (data) {
                if (data.nip_pimpinan == user.nip) {
                    if (data.status_pimpinan == 0) {
                        data.status_pimpinan = 1
                        data.tgl_baca_pimpinan = new Date()
                        await data.save()                    
                    }
                } else if (data.nip_penerima == user.nip) {
                    if (data.status_penerima == 0) {
                        data.status_penerima = 1
                        data.tgl_baca_penerima = new Date()
                        await data.save()                    
                    }
                } else if (data.nip_tembusan == user.nip) {
                    if (data.status_tembusan == 0) {
                        data.status_tembusan = 1
                        data.tgl_baca_tembusan = new Date()
                        await data.save()                    
                    }
                }
                
                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = SuratMasukController
