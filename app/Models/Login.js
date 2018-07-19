'use strict'

const Model = use('Model')

class Login extends Model {
    static get table () {
        return 'login'
    }

    static get primaryKey () {
        return 'nip'
    }

    static get hidden () {
        return ['password']
    }

    static get createdAtColumn () {
        return ''
    }

    static get updatedAtColumn () {
        return ''
    }

    lokasi_ () {
        return this.hasOne('App/Models/MasterKantor', 'kode_lokasi', 'kdlokasi')
    }
}

module.exports = Login
