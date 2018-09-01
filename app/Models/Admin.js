'use strict'

const Model = use('Model')

class Admin extends Model {
    static get table () {
        return 'admin'
    }

    static get primaryKey () {
        return 'id'
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

module.exports = Admin
