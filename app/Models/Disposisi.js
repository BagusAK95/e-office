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
}

module.exports = Disposisi
