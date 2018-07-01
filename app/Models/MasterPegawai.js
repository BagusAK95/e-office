'use strict'

const Model = use('Model')

class MasterPegawai extends Model {
    static get table () {
        return 'master_pegawai'
    }

    static get primaryKey () {
        return 'nip'
    }
}

module.exports = MasterPegawai