'use strict'

const { Command } = require('@adonisjs/ace')
const Login = use('App/Models/Login')

class SetLevelUser extends Command {
  static get signature () {
    return 'set_level_user'
  }

  static get description () {
    return 'Membuat level berdasarkan jabatan'
  }

  async handle (args, options) {
    
  }
}

module.exports = SetLevelUser
