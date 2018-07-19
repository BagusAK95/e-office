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

Route.get('/cek_session', ({ session }) => {
    return session.get('token')
})

Route.get('/getlevel', ({ session }) => {
return session.get('level')
})

Route.get('/logout', ({ session,response }) => {
    session.put('token', '')
    session.clear()
    response.redirect('/login')
})

Route.get('/gettoken', ({ session }) => {
    return session.all()
})
//End Aut Login//

//------------------------------------ Main System ---------------------------------//

//Home
Route.on('/home').render('frontend/home')

//Profile
Route.on('/profile').render('frontend/profile')

//User
Route.on('/user').render('frontend/user')

Route.on('/user/add').render('frontend/adduser')

//Change Password
Route.on('/change-password').render('frontend/change_password')
  
//Tree
Route.on('/kantor').render('frontend/tree')

//Surat Masuk
Route.on('/surat-masuk').render('frontend/surat_masuk')

Route.on('/surat-masuk/add').render('frontend/addsuratmasuk')

Route.get('/surat-masuk/:id', async function({ params,view }) {
    return view.render('frontend/detail_surat_masuk', { params })
})

Route.get('/surat-masuk/cetak/:id', async function({ params,view }) {
    return view.render('frontend/cetak_surat_masuk', { params })
})

Route.get('/dispo-masuk/add/:id', async function({ params,view }) {
    return view.render('frontend/dispo_surat_masuk', { params })
})

//End Surat Masuk

//Dispo Keluar

Route.on('/disposisi-keluar').render('frontend/disposisi_keluar')

Route.get('/disposisi-keluar/:id', async function({ params,view }) {
    return view.render('frontend/detail_dispo_keluar', { params })
})



//End Dispo Keluar

//Dispo Masuk

Route.on('/disposisi-masuk').render('frontend/disposisi_masuk')

Route.get('/disposisi-masuk/:id', async function({ params,view }) {
    return view.render('frontend/detail_dispo_masuk', { params })
})

Route.get('/dispo-keluar/:id', async function({ params,view }) {
    return view.render('frontend/add_dispo', { params })
})
//End Dispo Masuk

//------------------------------------ End Main System ---------------------------------//