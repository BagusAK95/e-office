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
}

module.exports = SuratTembusan
