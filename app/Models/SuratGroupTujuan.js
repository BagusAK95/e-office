'use strict'

const Model = use('Model')

class SuratGroupTujuan extends Model {
    static get table () {
        return 'surat_group_tujuan'
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

module.exports = SuratGroupTujuan
