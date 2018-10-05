'use strict'

const { Command } = require('@adonisjs/ace')
const AsyncLoop = require('node-async-loop')
const SimayaSuratMasuk = use('App/Models/SimayaSuratMasuk')
const SuratMasuk = use('App/Models/SuratMasuk')
const User = use('App/Models/Login')

class MigrationData extends Command {
  static get signature () {
    return 'migration-data {--username=@value} {--nip=@value} {--instansi=@value}'
  }

  static get description () {
    return 'Tell something helpful about this command'
  }

  async handle (args, options) {
    this.process(1, options)
  }

  async process(page, args) {
    try {
      const skip = (page * 1000) - 1000
      SimayaSuratMasuk.find({ recipients: args.username }, null, { skip: skip, limit: 1000 }, async (err, docs) => {
        if (err) {
          console.log(err)
        } else {
          if (docs.length > 0) {
            const tatausaha = await User.find(Number(args.instansi) + 1)
            const pimpinan = await User.find(args.nip)
    
            AsyncLoop(docs, async (surat, next) => {
              if (surat.fileAttachments[0]) {
                
              }
              const insert = await SuratMasuk.create({
                instansi_penerima: args.instansi,
                nip_tata_usaha: tatausaha.nip,
                nama_tata_usaha: tatausaha.nama_lengkap,
                jabatan_tata_usaha: tatausaha.nama_jabatan,
                nip_pimpinan: pimpinan.nip,
                nama_pimpinan: pimpinan.nama_lengkap,
                jabatan_pimpinan: pimpinan.nama_jabatan,
                tgl_terima: new Date(surat.creationDate),
                tgl_surat: new Date(surat.date),
                nomor_surat: surat.mailId,
                perihal: surat.comments,
                jenis_instansi: 1,
                nama_instansi: surat.senderManual.organization,
                nama_pengirim: surat.senderManual.name,
                alamat_pengirim: surat.senderManual.address,
                klasifikasi: 32,
                keamanan: 1,
                kecepatan: 1,
                ringkasan: surat.comments,
                isi_surat: surat.comments,
                lampiran: (surat.fileAttachments[0]) ? surat.fileAttachments[0].name : null,
                tgl_baca_pimpinan: new Date(),
                tgl_baca_tata_usaha: new Date(),
                status_surat: 1
              })
    
              console.log('=> ' + insert.nomor_surat)
    
              next()
            }, () => {
              this.process(page + 1, args)
            })
          } else {
            console.log('Done !')
          }
        }
      })      
    } catch (error) {
      
    }
  }
}

module.exports = MigrationData
