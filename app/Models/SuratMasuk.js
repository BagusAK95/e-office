'use strict'

const Model = use('Model')

class SuratMasuk extends Model {
    static get table () {
        return 'surat_masuk'
    }

    static get primaryKey () {
        return 'id'
    }
}

module.exports = SuratMasuk
