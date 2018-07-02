'use strict'

const Model = use('Model')

class MasterKlasifikasi extends Model {
    static get table () {
        return 'master_klasifikasi'
    }

    static get primaryKey () {
        return 'id'
    }
}

module.exports = MasterKlasifikasi
