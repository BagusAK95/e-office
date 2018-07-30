'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const SuratMasuk = use('App/Models/SuratMasuk')

class MasterPegawaiController {
    async list({request, auth}){
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            let sql = []
            if (request.get().nama) {
                sql.push(`nama LIKE '%` + request.get().nama + `%'`)
            }
            sql.push('kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi)

            const data = await MasterPegawai.query()
                                            .whereRaw(sql.join(' AND '))
                                            .paginate(Number(request.get().page), Number(request.get().limit))
                                    
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }

    async listByLocation({ params }) {
        try {
            const data = await MasterPegawai.query()
                                            .where('kode_lokasi', params.kode_lokasi)
                                            .orderBy('kode_eselon', 'desc')
                                            .orderBy('kode_jabatan', 'desc')
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser()
            const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
            const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')

            const data = await MasterPegawai.query()
                                            .whereBetween('kode_lokasi', [startLokasi, endLokasi])
                                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)                
        }
    }

    async listAllDispositionReciver({ params, auth }) {
        try {
            const user = await auth.getUser()
            const surat = await SuratMasuk.find(params.id_surat_masuk)
            if (surat) {
                if (user.nip == surat.nip_plt) {
                    const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '10000')
                    const endLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '90000')

                    const data = await MasterPegawai.query()
                                                    .whereBetween('kode_lokasi', [startLokasi, endLokasi])

                    return Response.format(true, null, data)
                } else {
                    const str = user.kode_lokasi.toString().replace(/([1-9])(0+$)/g, '')
                    const rgx = user.kode_lokasi.toString().match(/([1-9])(0+$)/g)
                    if (rgx) {
                        let startLokasi = str
                        let endLokasi = str
                        
                        const arr = rgx[0].split('')
                        for (let i = 0; i < arr.length; i++) {
                            if (i == 2) {
                                startLokasi += '1'
                                endLokasi += '9'
                            } else {
                                startLokasi += arr[i]
                                endLokasi += arr[i]
                            }
                        }

                        const data = await MasterPegawai.query()
                                                        .whereBetween('kode_lokasi', [startLokasi, endLokasi])
                                                        
                        return Response.format(true, null, data)
                    } else {
                        return Response.format(true, null, [])
                    }
                }
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }             
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
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

                const atasan = await MasterPegawai.query()
                                                .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                                .orderBy('kode_eselon', 'desc')
                                                .orderBy('kode_jabatan', 'desc')
                                                .first()
                if (atasan) {
                    arrPegawai.push(atasan)
                }
            } else {
                arrLokasi[2] = "0"

                const atasan = await MasterPegawai.query()
                                                .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                                .orderBy('kode_eselon', 'desc')
                                                .orderBy('kode_jabatan', 'desc')
                                                .first()
                if (atasan) {
                    arrPegawai.push(atasan)
                }
            }

            /* Get Atasan 2 */
            if (arrLokasi[2] != "0") {
                arrLokasi[2] = "0"

                const atasan = await MasterPegawai.query()
                                                .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                                .orderBy('kode_eselon', 'desc')
                                                .orderBy('kode_jabatan', 'desc')
                                                .first()
                if (atasan) {
                    arrPegawai.push(atasan)
                }
            }

            /* Get Sekretaris */
            const sekretaris = await Login.query()
                                        .where('level', 5)
                                        .whereBetween('kode_lokasi', [user.kode_lokasi.toString().replace(/\d{5}$/g, '00000'), user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')])
                                        .first()
            if (sekretaris) {
                arrPegawai.push(sekretaris)
            }

            /* Get Pimpinan */
            const pimpinan = await Login.query()
                                        .where('level', 2)
                                        .whereBetween('kode_lokasi', [user.kode_lokasi.toString().replace(/\d{5}$/g, '00000'), user.kode_lokasi.toString().replace(/\d{5}$/g, '99999')])
                                        .first()
            if (pimpinan) {
                arrPegawai.push(pimpinan)
            }

            let arrPegawaiFix = []
            arrPegawai.forEach(pegawai => {
                if (arrPegawaiFix.map(function(e) { return e.nip; }).indexOf(pegawai.nip) == -1) {
                    arrPegawaiFix.push(pegawai)
                }
            });

            return Response.format(true, null, arrPegawaiFix)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detail({params}){
        try {
            const data = await MasterPegawai.query()
                                            .where('nip', params.nip)
                                            .first()
            if (data) {
                return Response.format(true, null, data)            
            } else {
                return Response.format(false, 'Pegawai tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }   
    }
}

module.exports = MasterPegawaiController
