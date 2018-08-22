'use strict'

class CheckAccess {
  async handle ({ session, response, view }, next, rule) {
    if (session.all().token) {
      if (rule[0] == 'admin') {
        if (session.all().level != 1) {
          response.status(403).send(view.render('403'))
        }
      } else if (rule[0] == 'employe') {
        if (session.all().level == 1) {
          response.status(403).send(view.render('403'))
        }
      }
  
      if (rule[1]) {
        if (session.all().akses) {
          if (session.all().akses.split(',').indexOf(rule[1]) == -1) {
            response.status(403).send(view.render('403'))
          }
        } else {
          response.status(403).send(view.render('403'))
        }
      }
  
      await next()
    } else {
      response.status(403).send(view.render('403'))
    }
  }
}

module.exports = CheckAccess
