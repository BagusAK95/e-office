'use strict'

const Model = use('Model')

class MasterEkspedisi extends Model {
    static get table () {
        return 'master_ekspedisi'
    }

    static get primaryKey () {
        return 'kode'
    }
}

module.exports = MasterEkspedisi
