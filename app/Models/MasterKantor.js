'use strict'

const Model = use('Model')

class MasterKantor extends Model {
    static get table () {
        return 'master_kantor'
    }

    static get primaryKey () {
        return 'kdlokasi'
    }

    pimpinan_ () {
        return this.hasMany('App/Models/Login', 'kdlokasi', 'kode_lokasi')
    }
}

module.exports = MasterKantor
