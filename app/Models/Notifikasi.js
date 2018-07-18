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
}

module.exports = Notifikasi
