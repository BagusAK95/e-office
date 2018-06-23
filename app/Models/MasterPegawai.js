'use strict'

const Model = use('Model')

class MasterPegawai extends Model {
    static get table () {
        return 'master_pegawai'
    }

    static get primaryKey () {
        return 'nip'
    }

    static get hidden () {
        return ['kode_lokasi']
    }

    lokasi () {
        return this.hasOne('App/Models/MasterKantor', 'kode_lokasi', 'kdlokasi')
    }
}

module.exports = MasterPegawai