'use strict'

const Model = use('Model')

class SuratTemplate extends Model {
    static get table () {
        return 'surat_template'
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

module.exports = SuratTemplate
