'use strict'

const { Command } = require('@adonisjs/ace')
const Hash = use('Hash')
const AsyncLoop = require('node-async-loop')
const MasterPegawai = use('App/Models/MasterPegawai')
const MasterKantor = use('App/Models/MasterKantor')
const Login = use('App/Models/Login')

class CompleteUserData extends Command {
  static get signature () {
    return 'complete-user-data'
  }

  static get description () {
    return 'Melengkapi data user dari table pegawai'
  }

  async handle (args, options) {
    this.process()
  }

  async process(page = 1) {
    try {
      var dataPegawai = await MasterPegawai.query().paginate(page, 1000)
      dataPegawai = JSON.parse(JSON.stringify(dataPegawai))
      if (dataPegawai.data.length > 0) {
        AsyncLoop(dataPegawai.data, async (pegawai, next) => {
          let arrNamaLengkap = [pegawai.gelar_depan, pegawai.nama, pegawai.gelar_belakang]
          arrNamaLengkap = arrNamaLengkap.filter(function(n){ return n != null })

          let instansi = pegawai.kode_lokasi
          if (instansi) instansi = instansi.toString().replace(/\d{5}$/g, '00000')

          let jabatan = pegawai.nama_jabatan
          if (!jabatan) jabatan = ''

          const exist = await Login.find(pegawai.nip)
          if (!exist) {
              const data = {
                nip: pegawai.nip,
                instansi: instansi,
                nama_lengkap: arrNamaLengkap.join(' '),
                kode_lokasi: pegawai.kode_lokasi,
                kode_jabatan: pegawai.kode_jabatan,
                nama_jabatan: pegawai.nama_jabatan,
                kode_eselon: pegawai.kode_eselon,
                golongan: pegawai.golongan,
                password: await Hash.make(pegawai.nip),
                level: 4,
                akses: 'disposisi',
                status: 1,
                keyword: jabatan.concat(' | ', arrNamaLengkap.join(' '))
              }

              const insert = await Login.create(data)

              console.log(insert.nama_lengkap + ' -> Created.')
            } else {
              exist.instansi = instansi
              exist.nama_lengkap = arrNamaLengkap.join(' ')
              exist.kode_lokasi = pegawai.kode_lokasi
              exist.kode_jabatan = pegawai.kode_jabatan
              exist.nama_jabatan = pegawai.nama_jabatan
              exist.kode_eselon = pegawai.kode_eselon
              exist.golongan = pegawai.golongan
              exist.keyword = jabatan.concat(' | ', arrNamaLengkap.join(' '))
              await exist.save()

              console.log(exist.nama_lengkap + ' -> Updated.')
            }

            next()
          }, () => {
          this.process(page += 1)
        })
      } else {
        this.setAdmin()
      }
    } catch (error) {
      console.error('Error : ' + error)
    }
  }

  async setAdmin() {
    try {
      const masterKantor = await MasterKantor.query().where('kdparent', null)
      AsyncLoop(masterKantor, async(kantor, next) => {
        const exist = await Login.find(kantor.kdlokasi)
        if (!exist) {
          const data = {
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
          }
  
          const insert = await Login.create(data)

          console.log('Admin ' + insert.nama_lengkap + ' -> Created.')
        } else {
          exist.nama_lengkap = kantor.nmlokasi
          exist.nama_jabatan = 'Administrator'
          await exist.save()

          console.log('Admin ' + exist.nama_lengkap + ' -> Updated.')
        }

        next()
      }, () => {
        console.log('Done.')
      })
    } catch (error) {
      console.error('Error : ' + error)      
    }
  }
}

module.exports = CompleteUserData
