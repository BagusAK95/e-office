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
                                               .where('id_surat_keluar', params.id_surat_keluar)
                                               .whereBetween('status_surat', [1, 2])
                                               .first()
            if (dataSurat == null) {
                return Response.format(false, 'Konsep Surat tidak ditemukan', null)                
            } else {
                const updatePemeriksa = await SuratPemeriksa.query()
                                                            .where({ id_surat_keluar: params.id_surat_keluar, nip_pemeriksa: user.nip })
                                                            .update({ status : data.status})
                if (updatePemeriksa > 0) {
                    switch (Number(data.status)) {
                        case 2: //Revisi
                            dataSurat.status_surat = 2
                            dataSurat.save()

                            Notification.send([user.nip, user.nama_lengkap], [dataSurat.nip_pembuat], 'Merekomendasikan Untuk Merevisi Konsep Surat', '/konsep-surat/' + params.id_surat_keluar)

                            Log.add(user, 'Mengajukan Untuk Merevisi Konsep Surat Atas Nama ' + dataSurat.nama_penandatangan)

                            return Response.format(true, 'Konsep surat diajukan untuk revisi', null)
                            
                            break;
                        case 3: //Disetuju
                            Notification.send([user.nip, user.nama_lengkap], [dataSurat.nip_pembuat], 'Menyetujui Konsep Surat', '/konsep-surat/' + params.id_surat_keluar)

                            const dataPemeriksa = await SuratPemeriksa.query()
                                                                      .where({ id_surat_keluar: params.id_surat_keluar, status: 0 })
                                                                      .orderBy('urutan', 'asc')
                                                                      .first()
                            if (dataPemeriksa) {
                                dataPemeriksa.status = 1
                                dataPemeriksa.save()
            
                                Notification.send([user.nip, user.nama_lengkap], [dataPemeriksa.nip_pemeriksa], 'Mengajukan Persetujuan Konsep Surat', '/konsep-surat/' + params.id_surat_keluar)    

                                Log.add(user, 'Menyetujui Konsep Surat Atas Nama ' + dataSurat.nama_penandatangan)
                                
                                return Response.format(true, 'Konsep surat diajukan ke atasan', null)
                            } else {
                                dataSurat.status_surat = 3
                                dataSurat.save()

                                const dataTataUsaha = await Login.query()
                                                                 .where({ level: 3, instansi: user.instansi })
                                                                 .first()
                                if (dataTataUsaha) {
                                    Notification.send([user.nip, user.nama_lengkap], [dataTataUsaha.nip], 'Menambahkan Surat Keluar', '/surat-keluar/' + params.id_surat_keluar)

                                    Log.add(user, 'Menyetujui Konsep Surat Atas Nama ' + dataSurat.nama_penandatangan)

                                    return Response.format(true, 'Konsep surat disetujui', null)
                                } else {
                                    return Response.format(false, 'Tata Usaha tidak ditemukan', null)
                                }
                            }
                            
                            break;
                    }
                } else {
                    return Response.format(false, 'Data pemeriksa tidak ditemukan', null)
                }
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async UpdateList({ params, request }) {
        try {
            const data = request.all()
            let arr = []

            const arr_pemeriksa = JSON.parse(data.arr_pemeriksa)
            for (let i = 0; i < arr_pemeriksa.length; i++) {
                const dataPemeriksa = await SuratPemeriksa.query()
                                                        .where({ nip_pemeriksa: arr_pemeriksa[i].nip_pemeriksa, id_surat_keluar: params.id_surat_keluar })
                                                        .first()
                if (dataPemeriksa) {
                    dataPemeriksa.urutan = i + 1
                    dataPemeriksa.save()
                } else {
                    arr_pemeriksa[i].id_surat_keluar = params.id_surat_keluar
                    arr_pemeriksa[i].urutan = i + 1

                    await SuratPemeriksa.create(arr_pemeriksa[i])

                    arr.push(arr_pemeriksa[i].nama_pemeriksa)
                }
            }

            Log.add(user, 'Menambahkan ' + arr.join(', ') + ' Sebagai Pemeriksan Konsep Surat', arr_pemeriksa)

            return Response.format(true, 'Update daftar pemeriksa berhasil', null)
        } catch (error) {            
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = SuratPemeriksaController
