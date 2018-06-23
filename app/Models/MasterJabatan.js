'use strict'

const Model = use('Model')

class MasterJabatan extends Model {
    static get table () {
        return 'master_jabatan'
    }

    static get primaryKey () {
        return 'kdjabatan'
    }
}

module.exports = MasterJabatan
