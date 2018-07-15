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

//Aut Login//
Route.on('/login').render('frontend/login')

Route.get('/puttoken/:id', async ({ params , session }) => {
    const post = params.id;
    session.put('token', post);
    //retconst post = params.idurn post
})

Route.get('/putsession/:id', ({ params, session, response }) => {
    const post = params.id;
    session.put('level', post);
})

Route.get('/admin/cek_session', ({ session }) => {
    return session.get('token')
})

Route.get('/getlevel', ({ session }) => {
return session.get('level')
})

Route.get('/admin/logout', ({ session,response }) => {
    session.put('token', '')
    session.clear()
    response.redirect('/login')
})

Route.get('/admin/gettoken', ({ session }) => {
    return session.all()
})
//End Aut Login//

//------------------------------------ Main System ---------------------------------//

//Home
Route.on('/admin/home').render('frontend/home')

//Profile
Route.on('/admin/profile').render('frontend/profile')

//User
Route.on('/admin/user').render('frontend/user')

Route.on('/admin/adduser').render('frontend/adduser')

//Change Password
Route.on('/admin/change_password').render('frontend/change_password')
  
//Tree
Route.on('/admin/tree').render('frontend/tree')

//Surat Masuk
Route.on('/admin/surat_masuk').render('frontend/surat_masuk')

Route.on('/admin/addsuratmasuk').render('frontend/addsuratmasuk')

Route.get('/admin/detail_surat_masuk/:id', async function({ params,view }) {
    return view.render('frontend/detail_surat_masuk', { params })
})

Route.get('/admin/cetak-surat-masuk/:id', async function({ params,view }) {
    return view.render('frontend/cetak_surat_masuk', { params })
})

Route.get('/admin/dispo-surat-masuk/:id', async function({ params,view }) {
    return view.render('frontend/dispo_surat_masuk', { params })
})

//End Surat Masuk

//Dispo Keluar

Route.on('/admin/disposisi_keluar').render('frontend/disposisi_keluar')

Route.get('/admin/detail_dispo_keluar/:id', async function({ params,view }) {
    return view.render('frontend/detail_dispo_keluar', { params })
})

//End Dispo Keluar

//Dispo Keluar

Route.on('/admin/disposisi_masuk').render('frontend/disposisi_masuk')

Route.get('/admin/detail_dispo_masuk/:id', async function({ params,view }) {
    return view.render('frontend/detail_dispo_masuk', { params })
})

//End Dispo Keluar

//------------------------------------ End Main System ---------------------------------//