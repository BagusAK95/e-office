'use strict'

const { Command } = require('@adonisjs/ace')
const Hash = use('Hash')
const AsyncLoop = require('node-async-loop')
const MasterPegawai = use('App/Models/MasterPegawai')
const Login = use('App/Models/Login')

class CompleteUserData extends Command {
  static get signature () {
    return 'complete_user_data'
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
          const exist = await Login.find(pegawai.nip)
          if (!exist) {
              let arrNamaLengkap = [pegawai.gelar_depan, pegawai.nama, pegawai.gelar_belakang]
              arrNamaLengkap = arrNamaLengkap.filter(function(n){ return n != null })

              let instansi = pegawai.kode_lokasi
              if (instansi) instansi = instansi.toString().replace(/\d{5}$/g, '00000')

              let jabatan = pegawai.nama_jabatan
              if (!jabatan) jabatan = ''

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
                akses: 'suratmasuk,disposisi,suratkeluar',
                status: 1,
                keyword: jabatan.concat(' | ', arrNamaLengkap.join(' '))
              }

              const insert = await Login.create(data)
              console.log(insert.nama_lengkap + ' -> Success.')
            } else {
              console.log(exist.nama_lengkap + ' -> Exist.')
            }

            next()
          }, () => {
          this.process(page += 1)
        })
      } else {
        console.log('Done.')
      }
    } catch (error) {
      console.error('Error : ' + error)
    }
  }
}

module.exports = CompleteUserData
