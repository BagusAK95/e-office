'use strict'

const Model = use('Model')

class Komentar extends Model {
    static get table () {
        return 'komentar'
    }

    static get primaryKey () {
        return 'id'
    }
}

module.exports = Komentar
