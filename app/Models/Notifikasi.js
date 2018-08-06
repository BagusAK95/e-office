'use strict'

const Model = use('Model')

class Notifikasi extends Model {
    static get table () {
        return 'notifikasi'
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
        return ['nip_pengirim', 'url']
    }

    pengirim_ () {
        return this.hasOne('App/Models/Login', 'nip_pengirim', 'nip')
    }
}

module.exports = Notifikasi
