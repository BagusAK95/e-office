'use strict'

const Model = use('Model')

class MasterKantor extends Model {
    static get table () {
        return 'master_kantor'
    }

    static get primaryKey () {
        return 'kdlokasi'
    }

    static get hidden () {
        return ['kdparent', 'kdeselon']
    }
}

module.exports = MasterKantor
