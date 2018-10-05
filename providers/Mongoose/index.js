'use strict'

const { ServiceProvider } = require('@adonisjs/fold')
const AdonisMongoose = require('mongoose')

class MongooseProvider extends ServiceProvider {
  register() {
    this.app.singleton('Adonis/Addons/AdonisMongoose', function (app) {
      const Config = app.use('Adonis/Src/Config')
      const mongoUri = Config.get('mongo.uri', false)

      //AdonisMongoose.Promise = require('bluebird').Promise

      if (mongoUri) {
        AdonisMongoose.connect(mongoUri, { useNewUrlParser: true })
      }

      return AdonisMongoose
    })
  }

}

module.exports = MongooseProvider
