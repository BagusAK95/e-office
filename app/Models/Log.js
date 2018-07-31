'use strict'

const Model = use('Model')

class Log extends Model {
    static get table () {
        return 'log'
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

module.exports = Log
