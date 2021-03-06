'use strict'

const SuratKeluar = use('App/Models/SuratKeluar')
const SuratMasuk = use('App/Models/SuratMasuk')
const SuratTembusan = use('App/Models/SuratTembusan')
const SuratPemeriksa = use('App/Models/SuratPemeriksa')
const SuratPengiriman = use('App/Models/SuratPengiriman')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')
const MasterKantor = use('App/Models/MasterKantor')
const Login = use('App/Models/Login')
const Log = use('App/Helpers/LogHelper')
const Pdf = require('html-pdf')
const Template = use('App/Helpers/TemplateHelper')

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
                    arrPemeriksa[i].status = 1
                }
            }

            await SuratPemeriksa.createMany(arrPemeriksa)

            Notification.send(user, [arrPemeriksa[0].nip_pemeriksa], 'Mengajukan Persetujuan Konsep Surat', '/konsep-surat/checked/' + insertKonsep.id)
            
            Log.add(user, 'Menambah Konsep Surat Atas Nama ' + data.nama_penandatangan, insertKonsep)

            return Response.format(true, null, insertKonsep)
        } catch (error) {
            return Response.format(false, error, null)            
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
                sql.push(`keyword LIKE '%` + request.get().keyword + `%'`)
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
            return Response.format(false, error, null)
        }
    }

    async unreadAmountConcept({ auth }) {
        try {
            const user = await auth.getUser()

            const count = await SuratKeluar.query()
                                           .where('instansi_pengirim', user.instansi)
                                           .whereBetween('status_surat', [1, 2])
                                           .whereHas('pemeriksa_', (pemeriksa) => {
                                              pemeriksa.where({ nip_pemeriksa: user.nip, tgl_baca: null})
                                                       .whereNot('status', 0)
                                           })
                                           .getCount()
            
            return Response.format(true, null, count)
        } catch (error) {
            return Response.format(false, error, null)
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
                sql.push(`keyword LIKE '%` + request.get().keyword + `%'`)
            }
            sql.push(`instansi_pengirim = '` + user.instansi + `'`)
            sql.push(`nip_pembuat = '` + user.nip + `'`)
            //sql.push('status_surat BETWEEN 1 AND 2')

            const data = await SuratKeluar.query()
                                          .whereRaw(sql.join(' AND '))
                                          .orderBy('tgl', 'desc')
                                          .paginate(Number(request.get().page), Number(request.get().limit))
            
            Log.add(user, 'Melihat Daftar Konsep Surat Yang Dibuat Pada Halaman ' + request.get().page)

            return Response.format(true, null, data)
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async updateConcept({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const dataSurat = await SuratKeluar.query()
                                                .where({ instansi_pengirim: user.instansi, nip_pembuat: user.nip, id: params.id })
                                                .first()
            if (dataSurat) {
                if (dataSurat.status_surat == 2) {
                    data.status_surat = 1
                    data.keyword = ''.concat(data.nama_pembuat, ' | ', data.nama_penandatangan, ' | ', data.perihal)

                    const updateSurat = await SuratKeluar.query()
                                                         .where({ instansi_pengirim: user.instansi, nip_pembuat: user.nip, id: params.id })
                                                         .update(data)

                    const updatePemeriksa = await SuratPemeriksa.query()
                                                                .where('id_surat_keluar', params.id)
                                                                .update({status : 0, tgl_baca: null})
                    
                    const dataPemeriksa = await SuratPemeriksa.query()
                                                              .where({ id_surat_keluar: params.id, urutan: 1 })
                                                              .first()
                    if (dataPemeriksa) {
                        dataPemeriksa.status = 1
                        dataPemeriksa.save()

                        Notification.send(user, [dataPemeriksa.nip_pemeriksa], 'Mengajukan Persetujuan Konsep Surat', '/konsep-surat/checked/' + params.id)
                    }

                    Log.add(user, 'Merevisi Konsep Surat Atas Nama ' + data.nama_penandatangan, data)

                    return Response.format(true, null, updateSurat)    
                } else {
                    return Response.format(false, 'Konsep surat harus dalam status revisi', null)
                }
            } else {
                return Response.format(false, 'Konsep Surat tidak ditemukan', null)
            }    
        } catch (error) {            
            return Response.format(false, error, null)
        }
    }

    async updateConceptChecked({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const dataPemeriksa = await SuratPemeriksa.query()
                                                      .where({ id_surat_keluar: params.id, nip_pemeriksa: user.nip })
                                                      .first()
            if (dataPemeriksa) {
                data.status_surat = 1
                data.keyword = ''.concat(data.nama_pembuat, ' | ', data.nama_penandatangan, ' | ', data.perihal)
                
                const updateSurat = await SuratKeluar.query()
                                                        .where({ instansi_pengirim: user.instansi, id: params.id })
                                                        .update(data)

                Log.add(user, 'Merevisi Konsep Surat Atas Nama ' + data.nama_penandatangan, data)

                return Response.format(true, null, updateSurat)
            } else {
                return Response.format(false, 'Pemeriksa tidak ditemukan', null)
            }
        } catch (error) {            
            return Response.format(false, error, null)
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
                data.preview = await Template.format(params.id, false, false)
                data.status_pemeriksa = JSON.parse(JSON.stringify(data)).pemeriksa_.filter(e => e.nip_pemeriksa == user.nip)[0].status
                
                const update = await SuratPemeriksa.query()
                                                   .where({ id_surat_keluar: params.id, nip_pemeriksa: user.nip })
                                                   .update({ tgl_baca: new Date() })

                Log.add(user, 'Melihat Detail Konsep Surat Atas Nama ' + data.nama_penandatangan)

                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Konsep tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async listMail({ request, auth }) {
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
                sql.push(`keyword LIKE '%` + request.get().keyword + `%'`)
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
            return Response.format(false, error, null)
        }
    }

    async unreadAmountMail({ auth }) {
        try {
            const user = await auth.getUser()

            const count = await SuratKeluar.query()
                                           .where({ instansi_pengirim: user.instansi, nip_tata_usaha: user.nip, tgl_baca_tata_usaha: null })
                                           .whereBetween('status_surat', [3, 4])
                                           .getCount()
            
            return Response.format(true, null, count)
        } catch (error) {
            return Response.format(false, error, null)
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
                                          .with('pengiriman_')
                                          .first()
            if (data) {
                if (data.nip_tata_usaha == user.nip) {
                    if (data.tgl_baca_tata_usaha == null) {
                        data.tgl_baca_tata_usaha = new Date()
                        await data.save()
                    }
                }

                data.preview = await Template.format(params.id, false, true)
                
                Log.add(user, 'Melihat Detail Surat Keluar Atas Nama ' + data.nama_penandatangan)

                return Response.format(true, null, data)                
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async sendMail({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const lampiran = '/uploads/' + new Date().getTime() + '.pdf'
            const data = request.only(['nomor_surat', 'nomor_agenda', 'lampiran'])

            const dataSurat = await SuratKeluar.query()
                                            .where({ instansi_pengirim: user.instansi, id: params.id })
                                            .first()
            if (dataSurat) {
                const dataPimpinan = await Login.query()
                                                .where({ level: 2, instansi: user.instansi })
                                                .first()
                                                                        
                dataSurat.nomor_surat = data.nomor_surat
                dataSurat.nomor_agenda = data.nomor_agenda
                dataSurat.lampiran = data.lampiran
                dataSurat.nip_tata_usaha = user.nip
                dataSurat.nama_tata_usaha = user.nama_lengkap
                dataSurat.jabatan_tata_usaha = user.nama_jabatan
                dataSurat.status_surat = 4
                dataSurat.lampiran = lampiran
                dataSurat.save()

                const dataPengirim = await MasterKantor.find(dataSurat.instansi_pengirim)
                const arrPenerima = JSON.parse(dataSurat.arr_penerima)
                const arrTembusan = JSON.parse(dataSurat.arr_tembusan)
                const listTembusan = arrTembusan.map((elem) => {
                    return elem.nama_instansi;
                }).join('|');

                Pdf.create(await Template.format(params.id, true, true), { width: '35.0cm', height: '43.7cm' }).toFile('./public' + lampiran)

                arrPenerima.forEach(async (penerima) => {
                    if (penerima.id_instansi) {
                        const insertSurat = await SuratMasuk.create({
                            instansi_penerima: penerima.id_instansi,
                            tgl_surat: dataSurat.tgl_surat,
                            nomor_surat: data.nomor_surat,
                            nomor_agenda: data.nomor_agenda,
                            perihal: dataSurat.perihal,
                            jenis_instansi: 1,
                            nama_instansi: dataPengirim.nmlokasi,
                            nama_pengirim: dataSurat.nama_penandatangan,
                            jabatan_pengirim: dataSurat.jabatan_penandatangan,
                            arr_tembusan: listTembusan,
                            klasifikasi: dataSurat.klasifikasi,
                            keamanan: dataSurat.keamanan,
                            kecepatan: dataSurat.kecepatan,
                            ringkasan: dataSurat.ringkasan,
                            lampiran: lampiran,
                            status_surat: 0
                        })

                        await SuratPengiriman.create({
                            pengirim: user.instansi,
                            id_surat_keluar: params.id,
                            id_instansi: penerima.id_instansi,
                            nama_instansi: penerima.nama_instansi,
                            id_surat_masuk: insertSurat.id
                        })

                        const dataTataUsaha = await Login.query()
                                                        .where({ level: 3, instansi: penerima.id_instansi })
                                                        .first()
                        if (dataTataUsaha) {
                            insertSurat.nip_tata_usaha = dataTataUsaha.nip
                            insertSurat.nama_tata_usaha = dataTataUsaha.nama_lengkap
                            insertSurat.jabatan_tata_usaha = dataTataUsaha.nama_jabatan
                            insertSurat.save()

                            if (insertSurat) {
                                Notification.send(user, [dataTataUsaha.nip], 'Mengirimkan Surat Nomor ' + data.nomor_surat, '/surat-masuk/' + insertSurat.id)
                            }    
                        }
                    } else {
                        await SuratPengiriman.create({
                            pengirim: user.instansi,
                            id_surat_keluar: params.id,
                            id_instansi: penerima.id_instansi,
                            nama_instansi: penerima.nama_instansi
                        })
                    }
                })

                arrTembusan.forEach(async (tembusan) => {
                    if (tembusan.id_instansi) {
                        const insertTembusan = await SuratTembusan.create({
                            instansi_penerima: tembusan.id_instansi,
                            tgl_surat: dataSurat.tgl_surat,
                            nomor_surat: data.nomor_surat,
                            nomor_agenda: data.nomor_agenda,
                            perihal: dataSurat.perihal,
                            jenis_instansi: 1,
                            nama_instansi: dataPengirim.nmlokasi,
                            nama_pengirim: dataSurat.nama_penandatangan,
                            jabatan_pengirim: dataSurat.jabatan_penandatangan,
                            arr_tembusan: listTembusan,
                            klasifikasi: dataSurat.klasifikasi,
                            keamanan: dataSurat.keamanan,
                            kecepatan: dataSurat.kecepatan,
                            ringkasan: dataSurat.ringkasan,
                            lampiran: lampiran,
                            status_surat: 0
                        })

                        await SuratPengiriman.create({
                            pengirim: user.instansi,
                            id_surat_keluar: params.id,
                            id_instansi: tembusan.id_instansi,
                            nama_instansi: tembusan.nama_instansi,
                            id_surat_tembusan: insertTembusan.id
                        })

                        const dataTataUsaha = await Login.query()
                                                        .where({ level: 3, instansi: tembusan.id_instansi })
                                                        .first()
                        if (dataTataUsaha) {
                            insertTembusan.nip_tata_usaha = dataTataUsaha.nip
                            insertTembusan.nama_tata_usaha = dataTataUsaha.nama_lengkap
                            insertTembusan.jabatan_tata_usaha = dataTataUsaha.nama_jabatan
                            insertTembusan.save()
    
                            if (insertTembusan) {
                                Notification.send(user, [dataTataUsaha.nip], 'Mengirimkan Surat Nomor ' + data.nomor_surat + ' Sebagai Tembusan', '/surat-tembusan/' + insertTembusan.id)
                            }    
                        }
                    } else {
                        await SuratPengiriman.create({
                            pengirim: user.instansi,
                            id_surat_keluar: params.id,
                            id_instansi: tembusan.id_instansi,
                            nama_instansi: tembusan.nama_instansi
                        })
                    }
                })

                Log.add(user, 'Mengirimkan Surat Atas Nama ' + dataSurat.nama_penandatangan + ' Ke Instansi Terkait')   

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Surat tidak ditemukan', null)
            }   
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async delete({ params, auth }) {
        try {
            const user = await auth.getUser()

            const data = await SuratKeluar.query()
                                          .where({ id: params.id, instansi_pengirim: user.instansi, nip_pembuat: user.nip })
                                          .whereBetween('status_surat', [1, 2])
                                          .first()
            if (data) {
                await data.delete()

                await SuratPemeriksa.query()
                                    .where('id_surat_keluar', params.id)
                                    .delete()

                Log.add(user, 'Menghapus Konsep Surat Atas Nama ' + data.nama_penandatangan, data)   
                
                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Konsep surat tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratKeluarController
