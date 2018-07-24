'use strict'

const Model = use('Model')

class SuratKeluar extends Model {
    static get table () {
        return 'surat_keluar'
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

    pemeriksa_ () {
        return this.hasMany('App/Models/SuratPemeriksa', 'id', 'id_surat_keluar')
    }
}

module.exports = SuratKeluar
