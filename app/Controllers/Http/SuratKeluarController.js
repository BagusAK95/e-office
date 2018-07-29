'use strict'

const SuratKeluar = use('App/Models/SuratKeluar')
const SuratMasuk = use('App/Models/SuratMasuk')
const SuratPemeriksa = use('App/Models/SuratPemeriksa')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')

class SuratKeluarController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser()
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            let data = request.all()
            let arrPemeriksa = JSON.parse(data.arr_pemeriksa)

            data.instansi_pengirim = instansi
            data.nip_pembuat = user.nip
            data.nama_pembuat = user.nama_lengkap
            data.jabatan_pembuat = user.nama_jabatan
            data.keyword = ''.concat(data.nama_pembuat, ' | ', data.nama_penandatangan, ' | ', data.perihal)
            delete data.arr_pemeriksa
                    
            const insertKonsep = await SuratKeluar.create(data)

            for (let i = 0; i < arrPemeriksa.length; i++) {
                arrPemeriksa[i].id_surat_keluar = insertKonsep.id
                arrPemeriksa[i].urutan = i + 1

                if (i == 0) {
                    arrPemeriksa[i].status = 0
                }
            }

            await SuratPemeriksa.createMany(arrPemeriksa)

            Notification.send([user.nip, user.nama_lengkap], [arrPemeriksa[0].nip_pemeriksa], 'Mengajukan Persetujuan Konsep Surat', '/konsep-surat/' + insertKonsep.id)

            return Response.format(true, null, insertKonsep)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async listConceptChecked({ request, auth }) {
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
            sql.push('status_surat BETWEEN 1 AND 2')

            const data = await SuratKeluar.query()
                                          .whereRaw(sql.join(' AND '))
                                          .whereHas('pemeriksa_', (pemeriksa) => {
                                             pemeriksa.where('nip_pemeriksa', user.nip)
                                                      .whereNot('status', 0)
                                                      .orderBy('urutan', 'asc')
                                          })
                                          .orderBy('tgl', 'desc')
                                          .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async listConceptMaked({ request, auth }) {
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
            sql.push(`nip_pembuat = '` + user.nip + `'`)
            sql.push('status_surat BETWEEN 1 AND 2')

            const data = await SuratKeluar.query()
                                          .whereRaw(sql.join(' AND '))
                                          .orderBy('tgl', 'desc')
                                          .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async updateConcept({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()
            data.status_surat = 1
            data.keyword = ''.concat(data.nama_pembuat, ' | ', data.nama_penandatangan, ' | ', data.perihal)

            const updateSurat = await SuratKeluar.query()
                                                 .where({ nip_pembuat: user.nip, id: params.id })
                                                 .update(data)
            if (updateSurat > 0) {
                await SuratPemeriksa.query()
                                    .where('id_surat_keluar', params.id)
                                    .update({status : 0})
                
                const dataPemeriksa = await SuratPemeriksa.query()
                                                        .where({id_surat_keluar: params.id, urutan: 1})
                                                        .first()
                if (dataPemeriksa) {
                    dataPemeriksa.status = 1
                    dataPemeriksa.save()

                    Notification.send([user.nip, user.nama_lengkap], [dataPemeriksa.nip_pemeriksa], 'Mengajukan Persetujuan Konsep Surat', '/konsep-surat/' + params.id)
                }

                return Response.format(true, 'Update konsep surat berhasil', null)
            } else {
                return Response.format(false, 'Konsep Surat tidak ditemukan', null)
            }    
        } catch (error) {            
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detailConcept({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            const data = await SuratKeluar.query()
                                          .where({ id: params.id, instansi_pengirim: instansi })
                                          .whereBetween('status_surat', [1, 2])
                                          .with('pemeriksa_', (pemeriksa) => {
                                              pemeriksa.orderBy('urutan', 'asc')
                                          })
                                          .with('klasifikasi_')
                                          .with('surat_masuk_')
                                          .first()
            if (data) {                
                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Konsep tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async ListMail({ request, auth }) {
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
            sql.push('status_surat BETWEEN 3 AND 4')

            switch (user.level) {
                case 3: //Tata Usaha
                    sql.push('instansi_pengirim = ' + instansi)
                    break;
                case 2: //Pimpinan
                    sql.push('instansi_pengirim = ' + instansi)
                    break;
                default: //Staff
                    sql.push(`nip_pembuat = '` + user.nip + `'`)
                    break;
            }

            const data = await SuratKeluar.query()
                                          .whereRaw(sql.join(' AND '))
                                          .orderBy('tgl', 'desc')
                                          .paginate(Number(request.get().page), Number(request.get().limit))
            
            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detailMail({ params, auth }) {
        try {
            const user = await auth.getUser()
            
            const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            const data = await SuratKeluar.query()
                                          .where({ id: params.id, instansi_pengirim: instansi })
                                          .whereBetween('status_surat', [3, 4])
                                          .with('pemeriksa_', (pemeriksa) => {
                                              pemeriksa.orderBy('urutan', 'asc')
                                          })
                                          .with('klasifikasi_')
                                          .with('surat_masuk_')
                                          .first()
            if (data) {
                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    // async sendMail({ params, request, auth }) {
    //     const user = await auth.getUser()
    //     const instansi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')
    //     const data = request.only(['nomor_surat'])

    //     const dataSurat = await SuratKeluar.query()
    //                                        .where({ instansi_pengirim: instansi, id: params.id })
    //                                        .first()
    //     if (dataSurat) {
    //         const insertSurat = await SuratMasuk.create({
    //             instansi_penerima: dataSurat.instansi_penerima,
    //             tgl_surat: dataSurat.tgl_surat,
    //             nomor_surat: request.nomor_surat,
    //             nomor_agenda: dataSurat.nomor_agenda,
    //             perihal: dataSurat.perihal,
    //             jenis_instansi: 1
    //         })
    //     } else {
    //         return Response.format(false, 'Surat tidak ditemukan', null)
    //     }                        
    // }
}

module.exports = SuratKeluarController
