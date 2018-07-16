'use strict'

const Model = use('Model')

class Disposisi extends Model {
    static get table () {
        return 'disposisi'
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
        return ['instruksi', 'keyword']
    }

    instruksi_ () {
        return this.hasOne('App/Models/MasterInstruksi', 'instruksi', 'id')
    }
    
    surat_ () {
        return this.hasOne('App/Models/SuratMasuk', 'id_surat_masuk', 'id')
    }
}

module.exports = Disposisi
