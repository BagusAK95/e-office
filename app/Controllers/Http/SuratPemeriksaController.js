'use strict'

const SuratPemeriksa = use('App/Models/SuratPemeriksa')
const SuratKeluar = use('App/Models/SuratKeluar')
const Login = use('App/Models/Login')
const Response = use('App/Helpers/ResponseHelper')
const Notification = use('App/Helpers/NotificationHelper')
const Log = use('App/Helpers/LogHelper')

class SuratPemeriksaController {
    async updateStatus({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()
            const dataSurat = await SuratKeluar.query()
                                               .where('id', params.id_surat_keluar)
                                               .whereBetween('status_surat', [1, 2])
                                               .first()
            if (dataSurat) {
                if (dataSurat.status_surat == 1) {
                    const dataPemeriksa = await SuratPemeriksa.query()
                                                            .where({ id_surat_keluar: params.id_surat_keluar, nip_pemeriksa: user.nip })
                                                            .first()
                    if (dataPemeriksa) {
                        if (dataPemeriksa.status == 1) {
                            dataPemeriksa.status = data.status
                            dataPemeriksa.keterangan = data.keterangan
                            await dataPemeriksa.save()
                            
                            switch (Number(data.status)) {
                                case 2: //Revisi
                                    dataSurat.status_surat = 2
                                    dataSurat.save()

                                    Notification.send(user, [dataSurat.nip_pembuat], 'Merekomendasikan Untuk Merevisi Konsep Surat', '/konsep-surat/maked/' + params.id_surat_keluar)

                                    Log.add(user, 'Mengajukan Untuk Merevisi Konsep Surat Atas Nama ' + dataSurat.nama_penandatangan)

                                    return Response.format(true, 'Konsep surat diajukan untuk revisi', null)
                                    
                                    break;
                                case 3: //Disetuju
                                    Notification.send(user, [dataSurat.nip_pembuat], 'Menyetujui Konsep Surat', '/konsep-surat/maked/' + params.id_surat_keluar)

                                    const dataPemeriksa = await SuratPemeriksa.query()
                                                                            .where({ id_surat_keluar: params.id_surat_keluar, status: 0 })
                                                                            .orderBy('urutan', 'asc')
                                                                            .first()
                                    if (dataPemeriksa) {
                                        dataPemeriksa.status = 1
                                        dataPemeriksa.save()
                    
                                        Notification.send(user, [dataPemeriksa.nip_pemeriksa], 'Mengajukan Persetujuan Konsep Surat', '/konsep-surat/checked/' + params.id_surat_keluar)    

                                        Log.add(user, 'Menyetujui Konsep Surat Atas Nama ' + dataSurat.nama_penandatangan)
                                        
                                        return Response.format(true, 'Konsep surat diajukan ke atasan', null)
                                    } else {
                                        dataSurat.status_surat = 3
                                        await dataSurat.save()

                                        const dataTataUsaha = await Login.query()
                                                                        .where({ level: 3, instansi: user.instansi })
                                                                        .first()
                                        if (dataTataUsaha) {
                                            dataSurat.nip_tata_usaha = dataTataUsaha.nip
                                            dataSurat.nama_tata_usaha = dataTataUsaha.nama_lengkap
                                            dataSurat.jabatan_tata_usaha = dataTataUsaha.nama_jabatan
                                            await dataSurat.save()

                                            Notification.send(user, [dataTataUsaha.nip], 'Menambahkan Surat Keluar', '/surat-keluar/' + params.id_surat_keluar)

                                            Log.add(user, 'Menyetujui Konsep Surat Atas Nama ' + dataSurat.nama_penandatangan)

                                            return Response.format(true, 'Konsep surat disetujui', null)
                                        } else {
                                            return Response.format(false, 'Tata Usaha tidak ditemukan', null)
                                        }
                                    }
                                    
                                    break;
                            }    
                        } else {
                            return Response.format(false, 'Pemeriksaan harus dalam status belum diperiksa', null)
                        }
                    } else {
                        return Response.format(false, 'Data pemeriksa tidak ditemukan', null)
                    }
                } else {
                    return Response.format(false, 'Konsep surat harus dalam status proses pemeriksaan', null)                                
                }
            } else {
                return Response.format(false, 'Konsep surat tidak ditemukan', null)                                
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }

    async UpdateList({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            
            const dataSurat = await SuratKeluar.query()
                                               .where('id', params.id_surat_keluar)
                                               .whereBetween('status_surat', [1, 2])
                                               .first()
            if (dataSurat) {
                if (dataSurat.status_surat == 1) {
                    const dataPemeriksa = await SuratPemeriksa.query()
                                                            .where({ id_surat_keluar: params.id_surat_keluar, nip_pemeriksa: user.nip })
                                                            .first()
                    if (dataPemeriksa) {
                        if (dataPemeriksa.status == 1) {
                            const data = request.all()
                            const tambahanPemeriksa = JSON.parse(data.arr_pemeriksa)
                            const daftarPemeriksa = await SuratPemeriksa.query()
                                                                        .where('id_surat_keluar', params.id_surat_keluar)
                                                                        .orderBy('urutan', 'asc')

                            const index = daftarPemeriksa.map((e) => { return e.nip_pemeriksa }).indexOf(user.nip)
                            if (index != -1) {
                                //Tambahkan pemeriksa tambahan ke daftar pemeriksa
                                for (let i = 0; i < tambahanPemeriksa.length; i++) {
                                    daftarPemeriksa.splice(index + i + 1, 0, tambahanPemeriksa[i])
                                }

                                //Update urutan
                                for (let i = 0; i < daftarPemeriksa.length; i++) {
                                    const dataPemeriksa = await SuratPemeriksa.query()
                                                                            .where({ nip_pemeriksa: daftarPemeriksa[i].nip_pemeriksa, id_surat_keluar: params.id_surat_keluar })
                                                                            .first()
                                    if (dataPemeriksa) {
                                        dataPemeriksa.urutan = i + 1
                                        dataPemeriksa.save()
                                    } else {
                                        daftarPemeriksa[i].id_surat_keluar = params.id_surat_keluar
                                        daftarPemeriksa[i].urutan = i + 1
                    
                                        await SuratPemeriksa.create(daftarPemeriksa[i])
                                    }
                                }
                    
                                Log.add(user, 'Menambahkan ' + daftarPemeriksa.map((e) => { return e.nama_pemeriksa }).join(', ') + ' Sebagai Pemeriksan Konsep Surat', daftarPemeriksa)
                    
                                return Response.format(true, null, daftarPemeriksa.length)
                            } else {
                                return Response.format(false, 'Akses ditolak', null)
                            }        
                        } else {
                            return Response.format(false, 'Pemeriksaan harus dalam status belum diperiksa', null)
                        }
                    } else {
                        return Response.format(false, 'Pemeriksa tidak ditemukan', null)
                    }
                } else {
                    return Response.format(false, 'Konsep surat harus dalam status proses pemeriksaan', null)                                
                }
            } else {
                return Response.format(false, 'Konsep surat tidak ditemukan', null)                                
            }
        } catch (error) {            
            return Response.format(false, error, null)
        }
    }
}

module.exports = SuratPemeriksaController
