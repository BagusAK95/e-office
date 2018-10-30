'use strict'

const Model = use('Model')

class LoginAsync extends Model {
    static get table () {
        return 'login_async'
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
}

module.exports = LoginAsync
