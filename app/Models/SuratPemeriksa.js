'use strict'

const Model = use('Model')

class SuratPemeriksa extends Model {
    static get table () {
        return 'surat_pemeriksa'
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

module.exports = SuratPemeriksa
