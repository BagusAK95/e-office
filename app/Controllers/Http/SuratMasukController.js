'use strict'

const SuratMasuk = use('App/Models/SuratMasuk')
const MasterPegawai = use('App/Models/MasterPegawai')

class SuratMasukController {
    async add({ request, auth }) { //Todo: Kirim Notifikasi ke Pemimpin
        try {
            const user = await auth.getUser()
            if (user.akses.split(',').indexOf('suratmasuk') == -1) {
                return this.response(false, 'Akses ditolak', null)
            }

            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            let data = request.all()
            data.instansi_penerima = instansi
            data.nip_tata_usaha = user.nip
            data.keyword = ''.concat(data.nomor_surat, ' | ', data.nama_instansi, ' | ', data.perihal, ' | ', data.nama_pengirim, ' | ', data.nama_penerima)
            
            const dataPimpinan = await MasterPegawai.query().whereRaw('kode_lokasi = ' + instansi + ' AND kode_eselon IS NOT NULL').first()
            if (dataPimpinan) {
                data.nip_pimpinan = dataPimpinan.nip
            }

            const insert = await SuratMasuk.create(data)
            return this.response(true, null, insert)
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async list({ params, auth }) {
        try {
            const user = await auth.getUser()
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            
            let sql = []
            if (params.tgl_awal != '%7Btgl_awal%7D') {
                sql.push(`tgl_surat >= '` + params.tgl_awal + `'`)
            }
            if (params.tgl_akhir != '%7Btgl_akhir%7D') {
                sql.push(`tgl_surat <= '` + params.tgl_akhir + `'`)
            }
            if (params.keyword != '%7Bkeyword%7D') {
                sql.push(`MATCH(keyword) AGAINST('` + params.keyword + `' IN BOOLEAN MODE)`)
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

            console.log(sql.join(' AND '))
            const data = await SuratMasuk.query()
                                        .whereRaw(sql.join(' AND '))
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

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()
            if (user.akses.split(',').indexOf('suratmasuk') == -1) {
                return this.response(false, 'Akses ditolak', null)
            }
            
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            const destroy = await SuratMasuk.query().whereRaw(`id = ` + params.id + ` AND instansi_penerima = ` + instansi).delete()
            if (destroy > 0) {
                return this.response(true, null, destroy)                
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)
        }
    }

    async detail({ params, auth}) {
        try {
            const user = await auth.getUser()
            
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            const data = await SuratMasuk.query()
                                         .whereRaw(`id = ` + params.id + ` AND instansi_penerima = ` + instansi)
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

module.exports = SuratMasukController
