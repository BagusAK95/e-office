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

Route.get('/home', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/home', { sesi })
})
//Home
//Route.on('/home').render('frontend/home')

//Profile
Route.get('/profile', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/profile', { sesi })
})

//User
Route.get('/user', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/user', { sesi })
})

Route.get('/user/add', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/adduser', { sesi })
})

//Change Password
Route.get('/change-password', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/change_password', { sesi })
})
  
//Tree
Route.get('/kantor', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/tree', { sesi })
})

//Surat Masuk
Route.get('/surat-masuk', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/surat_masuk', { sesi })
})

Route.get('/surat-masuk/add', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/addsuratmasuk', { sesi })
})

Route.get('/surat-masuk/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/detail_surat_masuk', { params,sesi })
})

Route.get('/surat-masuk/cetak/:id', async function({ params,view }) {
    return view.render('frontend/cetak_surat_masuk', { params })
})

Route.get('/dispo-masuk/add/:id', async function({ params,view }) {
    return view.render('frontend/dispo_surat_masuk', { params })
})

//End Surat Masuk

//Dispo Keluar
Route.get('/disposisi-keluar', ({ session,view }) => {
    const sesi = session.get('token');
    return view.render('frontend/disposisi_keluar', { sesi })
})
Route.get('/disposisi-keluar/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/detail_dispo_keluar', { params,sesi })
})



//End Dispo Keluar

//Dispo Masuk
Route.get('/disposisi-masuk', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/disposisi_masuk', { params,sesi })
})

Route.get('/disposisi-masuk/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/detail_dispo_masuk', { params,sesi })
})

Route.get('/dispo-keluar/:id', async function({ params,view }) {
    return view.render('frontend/add_dispo', { params })
})
//End Dispo Masuk

//Tembusan

/*Route.on('/tembusan').render('frontend/tembusan')

Route.get('/tembusan/:id', async function({ params,view }) {
    return view.render('frontend/detail_tembusan', { params })
})*/

//End Tembusan

//Notif

//Route.on('/notif').render('frontend/notif')

Route.get('/notifikasi/:id', async function({ params,view }) {
    return view.render('frontend/notifikasi', { params })
})

Route.get('/notifikasi-all', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/notifikasi_all', { params,sesi })
})


Route.on('/error-404').render('404')


//End Notif

//Surat Keluar//
Route.get('/konsep-surat/add', async function({ session,view }) {
    const sesi = session.get('token');
    return view.render('frontend/add_surat_keluar', { sesi })
})

Route.get('/konsep-surat/maked', async function({ session,view }) {
    const sesi = session.get('token');
    return view.render('frontend/konsep_surat_maked', { sesi })
})

Route.get('/konsep-surat/checked', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/konsep_surat_checked', { params,sesi })
})

Route.get('/konsep-surat/maked/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/detail_konsep_surat', { params,sesi })
})

Route.get('/konsep-surat/checked/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/detail_konsep_surat_checked', { params,sesi })
})
Route.get('/konsep-surat/edit/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/edit_konsep_surat', { params,sesi })
})

Route.get('/tujuan-surat', async function({ session,view }) {
    const sesi = session.get('token');
    return view.render('frontend/tujuan_surat', { sesi })
})

Route.get('/tujuan-surat/add', async function({ session,view }) {
    const sesi = session.get('token');
    return view.render('frontend/tujuan_surat_add', { sesi })
})

Route.get('/surat-keluar', async function({ session,view }) {
    const sesi = session.get('token');
    return view.render('frontend/surat_keluar', { sesi })
})
Route.get('/surat-keluar/:id', async function({ session,params,view }) {
    const sesi = session.get('token');
    return view.render('frontend/detail_surat_keluar', { params,sesi })
})
//End Surat Keluar//

//Tembusan//
Route.on('/surat-tembusan').render('frontend/surat_tembusan')
Route.get('/surat-tembusan/:id', async function({ params,view }) {
    return view.render('frontend/detail_surat_tembusan', { params })
})
//End Tembusan//

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