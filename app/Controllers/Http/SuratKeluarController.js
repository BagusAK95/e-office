'use strict'

const SuratKeluar = use('App/Models/SuratKeluar')
const SuratMasuk = use('App/Models/SuratMasuk')
const SuratPemeriksa = use('App/Models/SuratPemeriksa')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')
const MasterKantor = use('App/Models/MasterKantor')
const Login = use('App/Models/Login')
const Log = use('App/Helpers/LogHelper')

class SuratKeluarController {
    async add({ request, auth }) {
        try {
            const user = await auth.getUser()

            let data = request.all()
            let arrPemeriksa = JSON.parse(data.arr_pemeriksa)

            data.instansi_pengirim = user.instansi
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
            
            Log.add(user, 'Menambah Konsep Surat Atas Nama ' + data.nama_penandatangan, insertKonsep)

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
            sql.push(`instansi_pengirim = '` + user.instansi + `'`)
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
            
            Log.add(user, 'Melihat Daftar Konsep Surat Untuk Diperiksa Pada Halaman ' + request.get().page)
            
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
            sql.push(`instansi_pengirim = '` + user.instansi + `'`)
            sql.push(`nip_pembuat = '` + user.nip + `'`)
            sql.push('status_surat BETWEEN 1 AND 2')

            const data = await SuratKeluar.query()
                                          .whereRaw(sql.join(' AND '))
                                          .orderBy('tgl', 'desc')
                                          .paginate(Number(request.get().page), Number(request.get().limit))
            
            Log.add(user, 'Melihat Daftar Konsep Surat Yang Dibuat Pada Halaman ' + request.get().page)

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
                                                 .where({ instansi_pengirim: user.instansi, nip_pembuat: user.nip, id: params.id })
                                                 .update(data)
            if (updateSurat > 0) {
                const updatePemeriksa = await SuratPemeriksa.query()
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

                Log.add(user, 'Merevisi Konsep Surat Atas Nama ' + data.nama_penandatangan, data)

                return Response.format(true, null, updateSurat)
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

            const data = await SuratKeluar.query()
                                          .where({ id: params.id, instansi_pengirim: user.instansi })
                                          .whereBetween('status_surat', [1, 2])
                                          .with('pemeriksa_', (pemeriksa) => {
                                              pemeriksa.orderBy('urutan', 'asc')
                                          })
                                          .with('klasifikasi_')
                                          .with('surat_masuk_')
                                          .first()
            if (data) {        
                Log.add(user, 'Melihat Detail Konsep Surat Atas Nama ' + data.nama_penandatangan)

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
                    sql.push('instansi_pengirim = ' + user.instansi)
                    break;
                case 2: //Pimpinan
                    sql.push('instansi_pengirim = ' + user.instansi)
                    break;
                default: //Staff
                    sql.push(`nip_pembuat = '` + user.nip + `'`)
                    break;
            }

            const data = await SuratKeluar.query()
                                          .whereRaw(sql.join(' AND '))
                                          .orderBy('tgl', 'desc')
                                          .paginate(Number(request.get().page), Number(request.get().limit))
            
            Log.add(user, 'Melihat Daftar Surat Keluar Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async detailMail({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await SuratKeluar.query()
                                          .where({ id: params.id, instansi_pengirim: user.instansi })
                                          .whereBetween('status_surat', [3, 4])
                                          .with('pemeriksa_', (pemeriksa) => {
                                              pemeriksa.orderBy('urutan', 'asc')
                                          })
                                          .with('klasifikasi_')
                                          .with('surat_masuk_')
                                          .first()
            if (data) {
                Log.add(user, 'Melihat Detail Surat Keluar Atas Nama ' + data.nama_penandatangan)

                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }

    async sendMail({ params, request, auth }) {
        const user = await auth.getUser()
        const data = request.only(['nomor_surat'])

        const dataSurat = await SuratKeluar.query()
                                           .where({ instansi_pengirim: user.instansi, id: params.id })
                                           .first()
        if (dataSurat) {
            if (dataSurat.instansi_penerima) {
                const dataInstansi = await MasterKantor.find(dataSurat.instansi_pengirim)

                const dataTataUsaha = await Login.query()
                                                 .where({ level: 3, instansi: dataSurat.instansi_penerima })
                                                 .first()

                const insertSurat = await SuratMasuk.create({
                    instansi_penerima: dataSurat.instansi_penerima,
                    tgl_surat: dataSurat.tgl_surat,
                    nomor_surat: data.nomor_surat,
                    nomor_agenda: dataSurat.nomor_agenda,
                    perihal: dataSurat.perihal,
                    jenis_instansi: 1,
                    nama_instansi: dataInstansi.nmlokasi,
                    nama_pengirim: dataSurat.nama_penandatangan,
                    jabatan_pengirim :dataSurat.jabatan_penandatangan,
                    klasifikasi: dataSurat.klasifikasi,
                    keamanan: dataSurat.keamanan,
                    kecepatan: dataSurat.kecepatan,
                    ringkasan: dataSurat.ringkasan,
                    isi_surat: dataSurat.isi_surat,
                    status_surat: 0
                })

                if (insertSurat) {
                    dataSurat.nip_tata_usaha = user.nip
                    dataSurat.nama_tata_usaha = user.nama_lengkap
                    dataSurat.jabatan_tata_usaha = user.nama_jabatan
                    dataSurat.status_surat = 4
                    dataSurat.save()

                    Notification.send([user.nip, dataInstansi.nmlokasi], [dataTataUsaha.nip], 'Mengirimkan Surat Nomor ' + data.nomor_surat, '/surat-masuk/' + insertSurat.id)                

                    Log.add(user, 'Mengirimkan Surat Nomor ' + data.nomor_surat + ' Ke ' + data.nama_instansi, insertSurat)
                
                    return Response.format(true, null, insertSurat)
                } else {
                    return Response.format(false, 'Surat gagal dikirim', null)
                }
            } else {
                return Response.format(true, 'Surat Manual', null)
            }
        } else {
            return Response.format(false, 'Surat tidak ditemukan', null)
        }                        
    }
}

module.exports = SuratKeluarController
