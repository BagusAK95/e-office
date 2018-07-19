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

    surat_ () {
        return this.hasOne('App/Models/SuratMasuk', 'id_surat_masuk', 'id')
    }
}

module.exports = SuratTembusan
