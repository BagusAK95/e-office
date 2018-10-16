'use strict'

const { Command } = require('@adonisjs/ace')
const MasterKantor = use('App/Models/MasterKantor')
const AsyncLoop = require('node-async-loop')
const Login = use('App/Models/Login')
const Request = require('request')
const Hash = use('Hash')

class CompleteUserData extends Command {
  static get signature () {
    return 'migration-user {--start=@value}'
  }

  static get description () {
    return 'Migrasi data user dari API yang disediakan'
  }

  async handle (args, options) {
    this.process()
  }

  async process() {
    try {
      Request('http://36.66.170.191:8285/info/pegawai/', async (err, resp, body) => {
        if (!err) {
          const docs = JSON.parse(body)
          AsyncLoop(docs, async (doc, next) => {
            let arrNamaLengkap = [doc.gelar.depan, doc.nama, doc.gelar.belakang]
            arrNamaLengkap = arrNamaLengkap.filter(function(n){ return n != null })
            
            let instansi = doc.kode_lokasi
            if (instansi) instansi = instansi.toString().replace(/\d{5}$/g, '00000')

            let keyword = arrNamaLengkap.join(' ').trim()
            if (doc.jabatan.nama) keyword = keyword.concat(' | ', doc.jabatan.nama)

            const exist = await Login.find(doc.nip)
            if (exist) {
              exist.instansi = instansi
              exist.nama_lengkap = arrNamaLengkap.join(' ').trim()
              exist.kode_lokasi = doc.kode_lokasi
              exist.kode_jabatan = doc.kode_jabatan
              exist.nama_jabatan = doc.jabatan.nama
              exist.kode_eselon = doc.eselon
              exist.golongan = doc.nama_golongan
              exist.keyword = keyword
              await exist.save()

              console.log(exist.nama_lengkap + ' -> Updated.')
            } else {
              await Login.create({
                nip: doc.nip,
                instansi: instansi,
                nama_lengkap: arrNamaLengkap.join(' ').trim(),
                kode_lokasi: doc.kode_lokasi,
                kode_jabatan: doc.kode_jabatan,
                nama_jabatan: doc.jabatan.nama,
                kode_eselon: doc.eselon,
                golongan: doc.nama_golongan,
                password: await Hash.make(doc.nip),
                level: 4,
                akses: 'disposisi,konsepsurat',
                status: 1,
                keyword: keyword
              })

              console.log(arrNamaLengkap.join(' ').trim() + ' -> Created.')
            }

            next()
          }, () => {
            this.setAdminTataUsahaPimpinanSekretaris()
          })
        } else {
          console.error('Error : ' + err)
        }
      })
    } catch (error) {
      console.error('Error : ' + error)
    }
  }

  async setAdminTataUsahaPimpinanSekretaris() {
    try {
      const masterKantor = await MasterKantor.query().where('kdparent', null)
      AsyncLoop(masterKantor, async(kantor, next) => {
        //Set Admin
        const admin = await Login.find(kantor.kdlokasi)
        if (!admin) {
          await Login.create({
            nip: kantor.kdlokasi,
            instansi: kantor.kdlokasi,
            nama_lengkap: kantor.nmlokasi,
            kode_lokasi: null,
            kode_jabatan: null,
            nama_jabatan: 'Administrator',
            kode_eselon: null,
            golongan: null,
            password: await Hash.make(kantor.kdlokasi.toString()),
            level: 1,
            akses: 'administrator',
            status: 1,
            keyword: ''
          })

          console.log('Admin ' + kantor.nmlokasi + ' -> Created.')
        } else {
          admin.nama_lengkap = kantor.nmlokasi
          admin.nama_jabatan = 'Administrator'
          await admin.save()

          console.log('Admin ' + admin.nama_lengkap + ' -> Updated.')
        }

        //Set Tata Usaha
        const tataUsaha = await Login.find(kantor.kdlokasi + 1)
        if (!tataUsaha) {
          await Login.create({
            nip: kantor.kdlokasi + 1,
            instansi: kantor.kdlokasi,
            nama_lengkap: kantor.nmlokasi,
            kode_lokasi: null,
            kode_jabatan: null,
            nama_jabatan: 'Tata Usaha',
            kode_eselon: null,
            golongan: null,
            password: await Hash.make((kantor.kdlokasi + 1).toString()),
            level: 3,
            akses: 'suratmasuk,suratkeluar,disposisi,konsepsurat',
            status: 1,
            keyword: ''
          })

          console.log('Tata Usaha ' + kantor.nmlokasi + ' -> Created.')
        } else {
          tataUsaha.nama_lengkap = kantor.nmlokasi
          tataUsaha.nama_jabatan = 'Tata Usaha'
          await tataUsaha.save()

          console.log('Tata Usaha ' + tataUsaha.nama_lengkap + ' -> Updated.')
        }

        //Set Pimpinan
        const pimpinan = await Login.query().where({ kode_lokasi: kantor.kdlokasi, kode_jabatan: 20000 }).update({ level: 2, akses: 'suratmasuk,suratkeluar,disposisi,konsepsurat' })
        if (pimpinan > 0) {
          console.log('Pimpinan ' + kantor.nmlokasi + ' -> Found.')
        } else {
          console.log('Pimpinan ' + kantor.nmlokasi + ' -> Not Found.')
        }

        //Set Sekretaris
        const sekretaris = await Login.query().whereRaw("instansi = " + kantor.kdlokasi + " AND kode_lokasi != " + kantor.kdlokasi + " AND nama_jabatan LIKE 'SEKRETARIS%'").update({ level: 5 })
        if (sekretaris > 0) {
          console.log('Sekretaris ' + kantor.nmlokasi + ' -> Found.')
        } else {
          console.log('Sekretaris ' + kantor.nmlokasi + ' -> Not Found.')
        }

        next()
      }, () => {
        console.log('Done !')
      })
    } catch (error) {
      console.error('Error : ' + error)
    }
  }
}

module.exports = CompleteUserData
