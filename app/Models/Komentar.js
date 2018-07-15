'use strict'

const Model = use('Model')

class Komentar extends Model {
    static get table () {
        return 'komentar'
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
        return ['nip_pengirim', 'nip_penerima']
    }

    penerima_ () {
        return this.hasOne('App/Models/MasterPegawai', 'nip_penerima', 'nip')
    }

    pengirim_ () {
        return this.hasOne('App/Models/MasterPegawai', 'nip_pengirim', 'nip')
    }
}

module.exports = Komentar
