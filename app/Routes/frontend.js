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
const Helpers = use('Helpers')

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

//Tembusan

Route.on('/tembusan').render('frontend/tembusan')

Route.get('/tembusan/:id', async function({ params,view }) {
    return view.render('frontend/detail_tembusan', { params })
})

//End Tembusan

//Notif

//Route.on('/notif').render('frontend/notif')

Route.get('/notifikasi/:id', async function({ params,view }) {
    return view.render('frontend/notifikasi', { params })
})

Route.get('/notifikasi-all', async function({ params,view }) {
    return view.render('frontend/notifikasi_all', { params })
})

Route.on('/error-404').render('404')


//End Notif

//Surat Keluar//
Route.on('/konsep-surat/add').render('frontend/add_surat_keluar')
Route.on('/konsep-surat/maked').render('frontend/konsep_surat_maked')
Route.on('/konsep-surat/checked').render('frontend/konsep_surat_checked')
Route.get('/konsep-surat/maked/:id', async function({ params,view }) {
    return view.render('frontend/detail_konsep_surat', { params })
})
Route.get('/konsep-surat/checked/:id', async function({ params,view }) {
    return view.render('frontend/detail_konsep_surat_checked', { params })
})
Route.get('/konsep-surat/edit/:id', async function({ params,view }) {
    return view.render('frontend/edit_konsep_surat', { params })
})
Route.on('/tujuan-surat').render('frontend/tujuan_surat')
Route.on('/tujuan-surat/add').render('frontend/tujuan_surat_add')
//End Surat Keluar//



Route.on('/coba').render('frontend/coba')
Route.post('/upload_file', async ({ params,request }) => {
  const profilePic = request.file('file')
  const a = profilePic.subtype
  const namabaru = `${new Date().getTime()}.${a}`
  await profilePic.move(Helpers.publicPath('uploads'), {
    name: namabaru
  })
  return namabaru
})
//------------------------------------ End Main System ---------------------------------//