'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')
const SuratMasuk = use('App/Models/SuratMasuk')
const Disposisi = use('App/Models/Disposisi')
const MasterKantor = use('App/Models/MasterKantor')

class UserController {
    async add({ request, auth }) { //Todo: Check Kode Lokasi
        try {
            const user = await auth.getUser()

            let data = request.all()
            data.password = await Hash.make(data.password)
            data.instansi = user.instansi
            data.keyword = ''.concat(data.nama_lengkap, ' | ', data.nama_jabatan)

            const insert = await Login.create(data)

            let level = ''
            switch (Number(data.level)) {
                case 1:
                    level = 'Admin'
                    break;
                case 2:
                    level = 'Pimpinan'
                    break;
                case 3:
                    level = 'Tata Usaha'
                    break;
                case 4:
                    level = 'Staff'
                    break;
                case 5:
                    level = 'Sekretaris'
                    break;
            }

            Log.add(user, 'Menambahkan ' + data.nama_lengkap + ' Sebagai ' + level, insert)

            return Response.format(true, null, insert)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async edit({ params, request, auth }) {
        try {
            const user = await auth.getUser()

            let data = request.only(['nohp', 'email', 'foto', 'password', 'level', 'akses', 'status', 'kop_surat', 'ttd', 'ttd_stempel'])
            if (data.password != null) {
                data.password = await Hash.make(data.password)
            }

            const edit = await Login.query()
                                    .where({ nip: params.nip, instansi: user.instansi })
                                    .update(data)
            if (edit > 0) {
                return Response.format(true, null, edit)
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Login.query()
                                    .where({ nip: params.nip, instansi: user.instansi })
                                    .first()
            if (data) {
                await data.delete()

                Log.add(user, 'Menghapus User ' + data.nama_lengkap, data)

                return Response.format(true, null, 1)                
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async list({ request, auth }) {
        try {
            const user = await auth.getUser()

            let sql = []
            if (request.get().keyword) {
                sql.push(`keyword LIKE '%` + request.get().keyword + `%'`)
            }
            sql.push('level not in (1,3)')
            sql.push('instansi = ' + user.instansi)

            const data = await Login.query()
                                    .whereRaw(sql.join(' AND '))
                                    .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')
                                    .paginate(Number(request.get().page), Number(request.get().limit))
                            
            Log.add(user, 'Melihat Daftar User Pada Halaman ' + request.get().page)
                                    
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async detail({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Login.query()
                                    .where({ nip: params.nip, instansi: user.instansi })
                                    .with('lokasi_')
                                    .first()
            if (data) {
                Log.add(user, 'Melihat Detail User ' + data.nama_lengkap)

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser() //Ambil data user yang login
            const data = await Login.query()
                                    .where('instansi', user.instansi)
                                    .whereNotIn('level', [1, 3])
                                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async listByLocation({ params }) {
        try {
            const data = await Login.query()
                                    .where('kode_lokasi', params.kode_lokasi)
                                    .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async listAllDispositionReciver({ params, auth }) {
        try {
            const user = await auth.getUser()

            const dataDisposisi = await Disposisi.query().where('id_surat_masuk', params.id_surat_masuk)
            const daftarPegawai = dataDisposisi.map(e => e.nip_penerima)
            
            const surat = await SuratMasuk.find(params.id_surat_masuk)
            if (surat) {
                if (user.nip == surat.nip_plt) {
                    const dataBawahan = await MasterKantor.query().where('kdparent', user.instansi)
                    const daftarBawahan = dataBawahan.map(e => e.kdlokasi)
                    if (daftarBawahan.length > 0) {
                        if (daftarPegawai.length > 0) {
                            const data = await Login.query()
                                                    .whereIn('kode_lokasi', daftarBawahan)
                                                    .where('kode_jabatan', 20000)
                                                    .whereNotIn('nip', daftarPegawai)
    
                            return Response.format(true, null, data)
                        } else {
                            const data = await Login.query()
                                                    .whereIn('kode_lokasi', daftarBawahan)
                                                    .where('kode_jabatan', 20000)
    
                            return Response.format(true, null, data)
                        }
                    } else {
                        if (daftarPegawai.length > 0) {
                            const data = await Login.query()
                                                    .where('kode_lokasi', user.instansi)
                                                    .whereNot('kode_jabatan', 20000)
                                                    .whereNotIn('nip', daftarPegawai)
    
                            return Response.format(true, null, data)
                        } else {
                            const data = await Login.query()
                                                    .where('kode_lokasi', user.instansi)
                                                    .whereNot('kode_jabatan', 20000)
    
                            return Response.format(true, null, data)
                        }
                    }
                } else {
                    const dataBawahan = await MasterKantor.query().where('kdparent', user.kode_lokasi)
                    const daftarBawahan = dataBawahan.map(e => e.kdlokasi)
                    if (daftarBawahan.length > 0) {
                        if (daftarPegawai.length > 0) {
                            const data = await Login.query()
                                                    .whereIn('kode_lokasi', daftarBawahan)
                                                    .where('kode_jabatan', 20000)
                                                    .whereNotIn('nip', daftarPegawai)
    
                            return Response.format(true, null, data)
                        } else {
                            const data = await Login.query()
                                                    .whereIn('kode_lokasi', daftarBawahan)
                                                    .where('kode_jabatan', 20000)
    
                            return Response.format(true, null, data)
                        }
                    } else {
                        if (user.kode_jabatan == 20000) { //Harus kepala bagian
                            if (daftarPegawai.length > 0) {
                                const data = await Login.query()
                                                        .where('kode_lokasi', user.kode_lokasi)
                                                        .whereNot('kode_jabatan', 20000)
                                                        .whereNotIn('nip', daftarPegawai)
        
                                return Response.format(true, null, data)
                            } else {
                                const data = await Login.query()
                                                        .where('kode_lokasi', user.kode_lokasi)
                                                        .whereNot('kode_jabatan', 20000)
        
                                return Response.format(true, null, data)
                            }    
                        } else {
                            return Response.format(true, null, [])
                        }
                    }
                }
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }             
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
    
    async listAllMailChecker({ auth }) {
        try {
            const user = await auth.getUser()

            let arrPegawai = []
            
            /* Get Atasan 1 */
            const atasan1 = await Login.query()
                                        .where({ kode_jabatan: 20000, kode_lokasi: user.kode_lokasi })
                                        .first()
            if (atasan1) {
                if (atasan1.level != 2 && atasan1.level != 5) {
                    if (atasan1.nip != user.nip) {
                        arrPegawai.push(atasan1)
                    }
                }
            }

            /* Get Atasan 2 */
            const lokasiAtasan2 = await MasterKantor.find(user.kode_lokasi)
            const atasan2 = await Login.query()
                                        .where({ kode_jabatan: 20000, kode_lokasi: lokasiAtasan2.kdparent })
                                        .first()
            if (atasan2) {
                if (atasan2.level != 2 && atasan2.level != 5) {
                    if (atasan2.nip != user.nip) {
                        arrPegawai.push(atasan2)
                    }
                }
            }

            /* Get Atasan 3 */
            const lokasiAtasan3 = await MasterKantor.find(lokasiAtasan2.kdparent)
            const atasan3 = await Login.query()
                                        .where({ kode_jabatan: 20000, kode_lokasi: lokasiAtasan3.kdparent })
                                        .first()
            if (atasan3) {
                if (atasan3.level != 2 && atasan3.level != 5) {
                    if (atasan3.nip != user.nip) {
                        arrPegawai.push(atasan3)
                    }
                }
            }

            /* Get Sekretaris */
            const sekretaris = await Login.query()
                                        .where({ level: 5, instansi: user.instansi })
                                        .first()
            if (sekretaris) {
                if (sekretaris.nip != user.nip) {
                    arrPegawai.push(sekretaris)
                }
            }

            /* Get Pimpinan */
            const pimpinan = await Login.query()
                                        .where({ level: 2, instansi: user.instansi })
                                        .first()
            if (pimpinan) {
                if (pimpinan.nip != user.nip) {
                    arrPegawai.push(pimpinan)
                }
            }

            return Response.format(true, null, arrPegawai)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async listDeviceInfo({ request, auth }) {
        try {
            const user = await auth.getUser()

            const data = await Login.query()
                                    .where('instansi', user.instansi)
                                    .whereNot('firebase_info', null)
                                    .paginate(Number(request.get().page), Number(request.get().limit))
                            
            Log.add(user, 'Melihat Daftar Device Info Pada Halaman ' + request.get().page)
                                    
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    /* System */

    async detail_Sys({ params }) {
        try {
            const data = await Login.query()
                                    .where({ nip: params.nip, instansi: params.instansi })
                                    .with('lokasi_')
                                    .first()
            if (data) {
                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async list_Sys({ request }) {
        try {
            let sql = []
            if (request.get().keyword) {
                sql.push(`keyword LIKE '%` + request.get().keyword + `%'`)
            }
            sql.push('instansi = ' + request.get().instansi)

            const data = await Login.query()
                                    .whereRaw(sql.join(' AND '))
                                    .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')
                                    .paginate(Number(request.get().page), Number(request.get().limit))
                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async edit_Sys({ params, request }) {
        try {
            let data = request.only(['instansi', 'kode_lokasi', 'kode_jabatan', 'nama_jabatan', 'kode_eselon', 'golongan', 'nohp', 'email', 'foto', 'password', 'level', 'akses', 'status'])
            if (data.password != null) {
                data.password = await Hash.make(data.password)
            }

            const edit = await Login.query()
                                    .where({ nip: params.nip })
                                    .update(data)
            if (edit > 0) {
                return Response.format(true, null, edit)
            } else {
                return Response.format(false, 'User tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = UserController
