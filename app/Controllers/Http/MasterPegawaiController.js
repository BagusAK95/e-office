'use strict'

const MasterPegawai = use('App/Models/MasterPegawai')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const SuratMasuk = use('App/Models/SuratMasuk')

class MasterPegawaiController {
    async list({request, auth}){
        try {
            const user = await auth.getUser() //Get data user yang login
            
            //Varibale filter instansi
            const startLokasi = user.instansi
            const endLokasi = user.instansi.toString().replace(/\d{5}$/g, '99999')

            let sql = [] //Siapkan sql filter
            if (request.get().nama) {
                sql.push(`nama LIKE '%` + request.get().nama + `%'`)
            }
            sql.push('kode_lokasi BETWEEN ' + startLokasi + ' AND ' +  endLokasi)

            //Ambil data dari database
            const data = await MasterPegawai.query()
                                            .whereRaw(sql.join(' AND '))
                                            .paginate(Number(request.get().page), Number(request.get().limit))

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async listByLocation({ params }) {
        try {
            //Get data dari database
            const data = await MasterPegawai.query()
                                            .where('kode_lokasi', params.kode_lokasi)
                                            .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async listAll({auth}){
        try {
            const user = await auth.getUser() //Ambil data user yang login
            
            //Variable filter instansi
            const startLokasi = user.instansi
            const endLokasi = user.instansi.toString().replace(/\d{5}$/g, '99999')

            //Ambil data dari database
            const data = await MasterPegawai.query()
                                            .whereBetween('kode_lokasi', [startLokasi, endLokasi])
                                            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)                
        }
    }

    async listAllDispositionReciver({ params, auth }) {
        try {
            const user = await auth.getUser()
            const surat = await SuratMasuk.find(params.id_surat_masuk)
            if (surat) {
                if (user.nip == surat.nip_plt) {
                    const startLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '')
                    let filterLokasi = []
                    for (let i = 1; i <= 9; i++) {
                        filterLokasi.push(Number(startLokasi + i + '0000'))
                    }

                    const data = await Login.query()
                                            .whereIn('kode_lokasi', filterLokasi)

                    return Response.format(true, null, data)
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

                        const data = await Login.query()
                                                .whereIn('kode_lokasi', filterLokasi)
                                                        
                        return Response.format(true, null, data)
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
                    arrPegawai.push(atasan)
                }
            } else {
                arrLokasi[2] = "0"

                const atasan = await Login.query()
                                          .where('kode_lokasi', user.kode_lokasi.toString().replace(/\d{5}$/g, arrLokasi.join('')))
                                          .orderByRaw('kode_eselon IS NULL ASC, kode_eselon ASC')            
                                          .first()
                if (atasan) {
                    arrPegawai.push(atasan)
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
                    arrPegawai.push(atasan)
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
                arrPegawai.push(pimpinan.nip)
            }

            const arrFixPegawai = arrPegawai.filter((elem, index, self) => { return index == self.map((e) => e.nip).indexOf(elem.nip) })
            return Response.format(true, null, arrFixPegawai)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async detail({params}){
        try {
            //Ambil data dari database
            const data = await MasterPegawai.query()
                                            .where('nip', params.nip)
                                            .first()
            if (data) {
                return Response.format(true, null, data)            
            } else {
                return Response.format(false, 'Pegawai tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }   
    }
}

module.exports = MasterPegawaiController
