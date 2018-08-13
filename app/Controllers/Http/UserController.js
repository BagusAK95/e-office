'use strict'

const Hash = use('Hash')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')
const SuratMasuk = use('App/Models/SuratMasuk')
const Disposisi = use('App/Models/Disposisi')

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

            let data = request.only(['nohp', 'email', 'foto', 'password', 'level', 'akses', 'status'])
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

                return Response.format(true, null, destroy)                
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
                sql.push(`MATCH(keyword) AGAINST('` + request.get().keyword + `' IN BOOLEAN MODE)`)
            }
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

            const dataDisposisi = await Disposisi.query()
                                                 .where('id_surat_masuk', params.id_surat_masuk)
            const daftarPegawai = dataDisposisi.map(e => e.nip_penerima)

            const surat = await SuratMasuk.find(params.id_surat_masuk)
            if (surat) {
                if (user.nip == surat.nip_plt) {
                    const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '')
                    let filterLokasi = []
                    for (let i = 1; i <= 9; i++) {
                        filterLokasi.push(Number(startLokasi + i + '0000'))
                    }

                    if (daftarPegawai.length > 0) {
                        const data = await Login.query()
                                                .whereIn('kode_lokasi', filterLokasi)
                                                .whereNotIn('nip', daftarPegawai)

                        return Response.format(true, null, data)
                    } else {
                        const data = await Login.query()
                                                .whereIn('kode_lokasi', filterLokasi)

                        return Response.format(true, null, data)
                    }
                } else {
                    const str = user.kode_lokasi.toString().replace(/([1-9])(0+$)/g, '')
                    const rgx = user.kode_lokasi.toString().match(/([1-9])(0+$)/g)
                    if (rgx) {
                        
                        const arr = rgx[0].split('')
                        let filterLokasi = []
                        for (let i = 1; i <= 9; i++) {
                            let startLokasi = str
                            for (let j = 0; j < arr.length; j++) {
                                if (j == 2) {
                                    startLokasi += i + ''
                                } else {
                                    startLokasi += arr[j]
                                }
                            }

                            filterLokasi.push(startLokasi)
                        }

                        if (daftarPegawai.length > 0) {
                            const data = await Login.query()
                                                    .whereIn('kode_lokasi', filterLokasi)
                                                    .whereNotIn('nip', daftarPegawai)
                                                            
                            return Response.format(true, null, data)
                        } else {
                            const data = await Login.query()
                                                    .whereIn('kode_lokasi', filterLokasi)
                                                            
                            return Response.format(true, null, data)
                        }
                    } else {
                        return Response.format(true, null, [])
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
            let arrLokasi = user.kode_lokasi.toString().match(/\d{5}$/g)[0].split('')

            /* Get Atasan 1 */
            if (arrLokasi[4] != "0") {
                arrLokasi[4] = "0"

                const atasan = await Login.query()
                                          .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                          .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')            
                                          .first()
                if (atasan) {
                    if (atasan.level != 2 && atasan.level != 5) {
                        arrPegawai.push(atasan)                        
                    }
                }
            } else {
                arrLokasi[2] = "0"

                const atasan = await Login.query()
                                          .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                          .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')            
                                          .first()
                if (atasan) {
                    if (atasan.level != 2 && atasan.level != 5) {
                        arrPegawai.push(atasan)                        
                    }
                }
            }

            /* Get Atasan 2 */
            if (arrLokasi[2] != "0") {
                arrLokasi[2] = "0"

                const atasan = await Login.query()
                                          .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                          .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')            
                                          .first()
                if (atasan) {
                    if (atasan.level != 2 && atasan.level != 5) {
                        arrPegawai.push(atasan)                        
                    }
                }
            }

            /* Get Sekretaris */
            const sekretaris = await Login.query()
                                        .where({ level: 5, instansi: user.instansi })
                                        .first()
            if (sekretaris) {
                arrPegawai.push(sekretaris)
            }

            /* Get Pimpinan */
            const pimpinan = await Login.query()
                                        .where({ level: 2, instansi: user.instansi })
                                        .first()
            if (pimpinan) {
                arrPegawai.push(pimpinan)
            }

            const arrFixPegawai = arrPegawai.filter((elem, index, self) => { return index == self.map((e) => e.nip).indexOf(elem.nip) })
            return Response.format(true, null, arrFixPegawai)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = UserController
