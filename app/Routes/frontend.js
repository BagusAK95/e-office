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

Route.get('/puttoken/:id', async ({
  params,
  session
}) => {
  const post = params.id;
  session.put('token', post);
  //retconst post = params.idurn post
})

Route.get('/putsession/:id/:akses', ({
  params,
  session,
  response
}) => {
  const post = params.id;
  const akses = params.akses;
  session.put('level', post);
  session.put('akses', akses);
})

Route.get('/cek_session', ({
  session
}) => {
  return session.get('token')
})

Route.get('/getlevel', ({
  session
}) => {
  return session.get('level')
})

Route.get('/logout', ({
  session,
  response
}) => {
  session.put('token', '')
  session.clear()
  response.redirect('/login')
})
//End Aut Login//

//------------------------------------ Main System ---------------------------------//

Route.get('/home', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/home', {
    sesi
  })
}).middleware('checkAccess:all')
//Home
//Route.on('/home').render('frontend/home')

//Profile
Route.get('/profile', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/profile', {
    sesi
  })
}).middleware('checkAccess:all')

//User
Route.get('/user', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/user', {
    sesi
  })
}).middleware('checkAccess:admin')

//User
Route.get('/user/:id', ({
  session,
  params,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/user_edit', {
    sesi,
    params
  })
}).middleware('checkAccess:admin')

Route.get('/user/add', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/adduser', {
    sesi
  })
}).middleware('checkAccess:admin')

//Change Password
Route.get('/change-password', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/change_password', {
    sesi
  })
}).middleware('checkAccess:all')

//Tree
Route.get('/kantor', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/tree', {
    sesi
  })
}).middleware('checkAccess:admin')

//Surat Masuk
Route.get('/surat-masuk', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/surat_masuk', {
    sesi
  })
}).middleware('checkAccess:employe,suratmasuk')

Route.get('/surat-masuk/add', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/addsuratmasuk', {
    sesi
  })
}).middleware('checkAccess:employe,suratmasuk')

Route.get('/surat-masuk/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_surat_masuk', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,suratmasuk')

/*Route.get('/surat-masuk/cetak/:id', async function({ params,view }) {
    return view.render('frontend/cetak_surat_masuk', { params })
}).middleware('checkAccess:employe,suratmasuk')*/

/*Route.get('/dispo-masuk/add/:id', async function({ params,view }) {
    return view.render('frontend/dispo_surat_masuk', { params })
}).middleware('checkAccess:employe,suratmasuk')*/

//End Surat Masuk

//Dispo Keluar
Route.get('/disposisi-keluar', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/disposisi_keluar', {
    sesi
  })
}).middleware('checkAccess:employe,disposisi')

Route.get('/disposisi-keluar/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_dispo_keluar', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,disposisi')
//End Dispo Keluar

//Dispo Masuk
Route.get('/disposisi-masuk', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/disposisi_masuk', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,disposisi')

Route.get('/disposisi-masuk/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_dispo_masuk', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,disposisi')

/*Route.get('/dispo-keluar/:id', async function({ params,view }) {
    return view.render('frontend/add_dispo', { params })
}).middleware('checkAccess:employe,disposisi')*/

//End Dispo Masuk

//Notif
//Route.on('/notif').render('frontend/notif')
Route.get('/notifikasi/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/notifikasi', {
    params,sesi
  })
}).middleware('checkAccess:all')

Route.get('/notifikasi-all', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/notifikasi_all', {
    params,
    sesi
  })
}).middleware('checkAccess:all')

Route.on('/error-404').render('404')
//End Notif

//Surat Keluar//
Route.get('/konsep-surat/add', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/add_surat_keluar', {
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/konsep-surat/maked', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/konsep_surat_maked', {
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/konsep-surat/maked/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_konsep_surat', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/konsep-surat/edit/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/edit_konsep_surat', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/konsep-surat-checked/edit/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/edit_konsep_surat_checked', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/konsep-surat/checked', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/konsep_surat_checked', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/konsep-surat/checked/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_konsep_surat_checked', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/tujuan-surat', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/tujuan_surat', {
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/tujuan-surat/add', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/tujuan_surat_add', {
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/surat-keluar', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/surat_keluar', {
    sesi
  })
}).middleware('checkAccess:employe,suratkeluar')

Route.get('/surat-keluar/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_surat_keluar', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,suratkeluar')

Route.get('/isi-surat-keluar/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/isi_surat_keluar', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

Route.get('/isi-surat-keluar/keluar/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/isi_surat_keluar2', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,konsepsurat')

//End Surat Keluar//

//Tembusan//
Route.get('/surat-tembusan', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/surat_tembusan', {
    sesi
  })
}).middleware('checkAccess:employe,suratmasuk')

Route.get('/surat-tembusan/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/detail_surat_tembusan', {
    params,
    sesi
  })
}).middleware('checkAccess:employe,suratmasuk')
//End Tembusan//


Route.get('/template-surat', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/template_surat', {
    sesi
  })
}).middleware('checkAccess:admin')

Route.get('/template-surat/add', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/template_surat_add', {
    sesi
  })
}).middleware('checkAccess:admin')

Route.get('/template-surat/detail/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/template_surat_detail', {
    params,
    sesi
  })
}).middleware('checkAccess:admin')

Route.get('/template-surat/edit/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/template_surat_edit', {
    params,
    sesi
  })
}).middleware('checkAccess:admin')



Route.get('/log-activity', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/log', {
    sesi
  })
}).middleware('checkAccess:admin')

/*Route.on('/coba').render('frontend/coba')*/

Route.get('/broadcast', async function ({
  session,
  view
}) {
  const sesi = session.get('token');
  return view.render('frontend/broadcast', {
    sesi
  })
}).middleware('checkAccess:admin')

Route.post('/upload_file', async ({
  params,
  request
}) => {
  const profilePic = request.file('file')
 
  const a = profilePic.clientName
  const rgx = /.*\.(.*)$/g
  const vari = rgx.exec(a)
  const res = vari[1];

  const namabaru = `${new Date().getTime()}.${res}`
  await profilePic.move(Helpers.publicPath('uploads'), {
    name: namabaru
  })
  return namabaru
}).middleware('checkAccess:all')

Route.post('/profile-picture', async ({
  request
}) => {

  const profilePic = request.file('file', {
    types: ['image'],
    size: '2mb'
  })

  const a = profilePic.subtype
  const namabaru = `${new Date().getTime()}.${a}`
  await profilePic.move(Helpers.publicPath('uploads'), {
    name: namabaru
  })
  return "/uploads/"+namabaru
}).middleware('checkToken:all') 


Route.get('/list_device', ({
  session,
  view
}) => {
  const sesi = session.get('token');
  return view.render('frontend/device', {
    sesi
  })
}).middleware('checkAccess:admin')


Route.get('/privacy-policy', ({
  view
}) => {
  return view.render('frontend/police')
})

//Admin//
Route.on('/nimda').render('frontend/admin_login')

Route.get('/cek_session_admin', ({
  session
}) => {
  return session.get('token_admin')
})

Route.get('/puttokenadmin/:id', async ({
  params,
  session
}) => {
  const post = params.id;
  session.put('token_admin', post);
})

Route.get('/admin/home', ({
  session,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_home', {
    sesi
  })
})

Route.get('/admin/profile', ({
  session,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_profile', {
    sesi
  })
})

Route.get('/admin/logout', ({
  session,
  response
}) => {
  session.put('token_admin', '')
  session.clear()
  response.redirect('/nimda')
})

Route.get('/admin/change-password', ({
  session,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_change_password', {
    sesi
  })
})

//User
Route.get('/admin/user', ({
  session,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_user', {
    sesi
  })
})

//Kantor
Route.get('/admin/kantor', ({
  session,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_kantor', {
    sesi
  })
})
Route.get('/admin/detail-kantor/:id', ({
  session,
  params,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_detail_kantor', {
    sesi,
    params
  })
})
Route.get('/admin/edit-kantor/:id', ({
  session,
  params,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_edit_kantor', {
    sesi,
    params
  })
})


Route.get('/admin/detail-user/:id/:instansi', ({
  session,
  params,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_detail_user', {
    sesi,
    params
  })
})


// TEMPLATE SURAT ADMIN //
Route.get('/admin/template-surat', async function ({
  session,
  view
}) {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_template_surat', {
    sesi
  })
})

Route.get('/admin/template-surat/add', async function ({
  session,
  view
}) {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_template_surat_add', {
    sesi
  })
})

Route.get('/admin/template-surat/detail/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_template_surat_detail', {
    params,
    sesi
  })
})

Route.get('/admin/template-surat/edit/:id', async function ({
  session,
  params,
  view
}) {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_template_surat_edit', {
    params,
    sesi
  })
})
// END TEMPLATE SURAT ADMIN //

Route.post('/profile-picture-admin', async ({
  request
}) => {

  const profilePic = request.file('file', {
    types: ['image'],
    size: '2mb'
  })

  const a = profilePic.subtype
  const namabaru = `${new Date().getTime()}.${a}`
  await profilePic.move(Helpers.publicPath('uploads'), {
    name: namabaru
  })
  return "/uploads/"+namabaru
}) 

//Log
Route.get('/admin/log', ({
  session,
  view
}) => {
  const sesi = session.get('token_admin');
  return view.render('frontend/admin_log', {
    sesi
  })
})

//End Admin//
Route.get('/coba', ({
  view
}) => {
  return view.render('frontend/coba', {})
})

//------------------------------------ End Main System ---------------------------------//

