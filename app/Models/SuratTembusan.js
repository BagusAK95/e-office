'use strict'

const Model = use('Model')

class SuratTembusan extends Model {
    static get table () {
        return 'surat_tembusan'
    }

    static get primaryKey () {
        return 'id'
    }

    static get createdAtColumn () {
        return ''
    }

    static get updatedAtColumn () {
        return ''
    }

    klasifikasi_ () {
        return this.hasOne('App/Models/MasterKlasifikasi', 'klasifikasi', 'id')
    }
}

module.exports = SuratTembusan
