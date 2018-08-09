'use strict'

const Model = use('Model')

class SuratPengiriman extends Model {
    static get table () {
        return 'surat_pengiriman'
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

module.exports = SuratPengiriman
