'use strict'

const Model = use('Model')

class Disposisi extends Model {
    static get table () {
        return 'disposisi'
    }

    static get primaryKey () {
        return 'id'
    }
}

module.exports = Disposisi
