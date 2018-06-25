'use strict'

const Model = use('Model')

class MasterKantor extends Model {
    static get table () {
        return 'master_kantor'
    }

    static get primaryKey () {
        return 'kdlokasi'
    }
}

module.exports = MasterKantor
