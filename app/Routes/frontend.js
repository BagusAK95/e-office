'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.0/routing
|
*/

const Route = use('Route')

Route.on('/login').render('frontend/login')

Route.get('/puttoken/:id', async ({ params , session }) => {
    const post = params.id
    session.put('token', post)
    //return post
})

Route.on('/admin/home').render('frontend/home')
Route.on('/admin/profile').render('frontend/profile')
Route.on('/admin/pegawai').render('frontend/pegawai')
Route.get('/admin/gettoken', ({ session }) => {
    return session.all()
  })