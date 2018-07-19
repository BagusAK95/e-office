'use strict'

const Model = use('Model')

class SuratMasuk extends Model {
    static get table () {
        return 'surat_masuk'
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

    static get hidden () {
        return ['klasifikasi', 'keyword']
    }

    klasifikasi_ () {
        return this.hasOne('App/Models/MasterKlasifikasi', 'klasifikasi', 'id')
    }

    tembusan_ () {
        return this.hasMany('App/Models/SuratTembusan', 'id', 'id_surat_masuk')
    }
}

module.exports = SuratMasuk
