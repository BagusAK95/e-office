'use strict'

const Model = use('Model')

class MasterInstruksi extends Model {
    static get table () {
        return 'master_instruksi'
    }

    static get primaryKey () {
        return 'id'
    }
}

module.exports = MasterInstruksi
