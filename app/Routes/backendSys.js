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

Route.group(() => {
  Route.get('/docs.json', () => {
    const swaggerJSDoc = require('swagger-jsdoc')

    const options = {
      swaggerDefinition: {
        info: {
          title: 'e-Office System', // Title (required)
          version: '1.0.0', // Version (required)
          description: 'This is about documentation of e-Office System.'
        },
        basePath: "/api-sys",
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      apis: ['./app/Routes/backendSys.js'] // Path to the API docs
    }

    return swaggerJSDoc(options)
  }).as('swaggerSysSpec')

  Route.get('/docs', ({
    view
  }) => {
    return view.render('swaggerSysUI')
  }).as('swaggerSysUI')

  /**
   * @swagger
   * /getToken:
   *   post:
   *     tags:
   *       - Login
   *     summary: Get Token
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: email
   *         in: formData
   *         description: Email
   *         required: true
   *         type: string
   *       - name: password
   *         in: formData
   *         description: Password
   *         required: true
   *         type: string
   *         format: password
   */
  Route.post('/getToken', 'AdminController.getToken')

  /**
   * @swagger
   * /profile:
   *   get:
   *     tags:
   *       - Profile
   *     summary: Detail
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   */
  Route.get('/profile', 'AdminController.getProfile').middleware('checkTokenSys')

  /**
   * @swagger
   * /profile/edit:
   *   put:
   *     tags:
   *       - Profile
   *     summary: Edit
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: nama_lengkap
   *         in: formData
   *         description: Nama Lengkap
   *         required: true
   *         type: string
   *       - name: email
   *         in: formData
   *         description: Email
   *         required: true
   *         type: string
   *       - name: nohp
   *         in: formData
   *         description: No Hp
   *         required: true
   *         type: string
   *       - name: foto
   *         in: formData
   *         description: Foto
   *         required: false
   *         type: string
   */
  Route.put('/profile/edit', 'AdminController.editProfile').middleware('checkTokenSys')

  /**
   * @swagger
   * /profile/editPassword:
   *   put:
   *     tags:
   *       - Profile
   *     summary: Edit Password
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: password_old
   *         in: formData
   *         description: Old Password
   *         required: true
   *         type: string
   *         format: password
   *       - name: password_new
   *         in: formData
   *         description: New Password
   *         required: true
   *         type: string
   *         format: password
   */
  Route.put('/profile/editPassword', 'AdminController.editPassword').middleware('checkTokenSys')

  /**
   * @swagger
   * /user:
   *   get:
   *     tags:
   *       - User
   *     summary: List
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: instansi
   *         in: query
   *         description: Instansi
   *         required: true
   *         type: string
   *       - name: keyword
   *         in: query
   *         description: Keyword
   *         required: false
   *         type: string
   *       - name: page
   *         in: query
   *         description: Page
   *         required: true
   *         type: string
   *       - name: limit
   *         in: query
   *         description: Limit
   *         required: true
   *         type: string
   */
  Route.get('/user', 'UserController.list_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /user/{instansi}/{nip}:
   *   get:
   *     tags:
   *       - User
   *     summary: Detail
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: instansi
   *         in: path
   *         description: Instansi
   *         required: true
   *         type: string
   *       - name: nip
   *         in: path
   *         description: NIP
   *         required: true
   *         type: string
   */
  Route.get('/user/:instansi/:nip', 'UserController.detail_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /user/{nip}:
   *   put:
   *     tags:
   *       - User
   *     summary: Edit
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: nip
   *         in: path
   *         description: Nomor Induk Pegawai
   *         required: true
   *         type: string
   *       - name: instansi
   *         in: formData
   *         description: Instansi
   *         required: true
   *         type: string
   *       - name: kode_lokasi
   *         in: formData
   *         description: Kode Lokasi
   *         required: true
   *         type: string
   *       - name: kode_jabatan
   *         in: formData
   *         description: Kode Jabatan
   *         required: true
   *         type: string
   *       - name: nama_jabatan
   *         in: formData
   *         description: Nama Jabatan
   *         required: true
   *         type: string
   *       - name: kode_eselon
   *         in: formData
   *         description: Kode Eselon
   *         required: true
   *         type: string
   *       - name: golongan
   *         in: formData
   *         description: Golongan
   *         required: true
   *         type: string
   *       - name: nohp
   *         in: formData
   *         description: Nomor Handphone
   *         required: false
   *         type: string
   *       - name: email
   *         in: formData
   *         description: Email
   *         required: false
   *         type: string
   *       - name: foto
   *         in: formData
   *         description: Url Foto
   *         required: false
   *         type: string
   *       - name: password
   *         in: formData
   *         description: Password
   *         required: false
   *         type: string
   *         format: password
   *       - name: level
   *         in: formData
   *         description: 1=Admin, 2=Pimpinan, 3=Tata Usaha, 4=Staf, 5=Sekretaris
   *         required: false
   *         type: string
   *       - name: akses
   *         in: formData
   *         description: Daftar Akses Menu
   *         required: false
   *         type: string
   *       - name: status
   *         in: formData
   *         description: 0=Non Aktif, 1=Aktif
   *         required: false
   *         type: string
   */
  Route.put('/user/:nip', 'UserController.edit_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /user/byLocation/{kode_lokasi}:
   *   get:
   *     tags:
   *       - User
   *     summary: List By Location
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: kode_lokasi
   *         in: path
   *         description: Kode Lokasi
   *         required: true
   *         type: string
   */
  Route.get('/user/byLocation/:kode_lokasi', 'UserController.listByLocation').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-kantor/listAllParent:
   *   get:
   *     tags:
   *       - Master Kantor
   *     summary: List All Parent
   *     produces:
   *       - application/json
   */
  Route.get('/master-kantor/listAllParent', 'MasterKantorController.listAllParent').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-kantor/listAll/{instansi}:
   *   get:
   *     tags:
   *       - Master Kantor
   *     summary: List All
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: instansi
   *         in: path
   *         description: Instansi
   *         required: true
   *         type: string
   */
  Route.get('/master-kantor/listAll/:instansi', 'MasterKantorController.listAll_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-kantor:
   *   get:
   *     tags:
   *       - Master Kantor
   *     summary: List
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Page
   *         required: true
   *         type: string
   *       - name: limit
   *         in: query
   *         description: Limit
   *         required: true
   *         type: string
   */
  Route.get('/master-kantor', 'MasterKantorController.listParent_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-kantor/tree-html/{instansi}:
   *   get:
   *     tags:
   *       - Master Kantor
   *     summary: Tree Html
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: instansi
   *         in: path
   *         description: Instansi
   *         required: true
   *         type: string
   */
  Route.get('/master-kantor/tree-html/:instansi', 'MasterKantorController.treeHtml_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-kantor/{id}:
   *   put:
   *     tags:
   *       - Master Kantor
   *     summary: Update
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Id
   *         required: true
   *         type: string
   *       - name: pimpinan
   *         in: formData
   *         description: Sebutan untuk Pimpinan (Kepala, Directur, dll)
   *         required: true
   *         type: string
   *       - name: singkatan
   *         in: formData
   *         description: Singkatan OPD
   *         required: true
   *         type: string
   */
  Route.put('/master-kantor/:id', 'MasterKantorController.update_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-kantor/{id}:
   *   get:
   *     tags:
   *       - Master Kantor
   *     summary: Detail
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Id
   *         required: true
   *         type: string
   */
  Route.get('/master-kantor/:id', 'MasterKantorController.detail_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /master-jabatan/listAll:
   *   get:
   *     tags:
   *       - Master Jabatan
   *     summary: List All
   *     produces:
   *       - application/json
   */
  Route.get('/master-jabatan/listAll', 'MasterJabatanController.listAll_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /log:
   *   get:
   *     tags:
   *       - Log Aktifitas
   *     summary: List
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: instansi
   *         in: query
   *         description: Instansi
   *         required: true
   *         type: string
   *       - name: tgl_awal
   *         in: query
   *         description: Tanggal Awal
   *         required: false
   *         type: string
   *       - name: tgl_akhir
   *         in: query
   *         description: Tanggal Akhir
   *         required: false
   *         type: string
   *       - name: page
   *         in: query
   *         description: Halaman
   *         required: true
   *         type: string
   *       - name: limit
   *         in: query
   *         description: Data per Halaman
   *         required: true
   *         type: string
   */
  Route.get('/log', 'LogController.list_Sys').middleware('checkTokenSys')


  /**
   * @swagger
   * /template-surat:
   *   post:
   *     tags:
   *       - Template Surat
   *     summary: Add
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: judul
   *         in: formData
   *         description: Judul Surat
   *         required: true
   *         type: string
   *       - name: isi
   *         in: formData
   *         description: Isi surat
   *         required: true
   *         type: string
   */
  Route.post('/template-surat', 'SuratTemplateController.add_Sys').validator('addTemplateSurat').middleware('checkTokenSys')

  /**
   * @swagger
   * /template-surat/{id}:
   *   put:
   *     tags:
   *       - Template Surat
   *     summary: Edit
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Id
   *         required: true
   *         type: string
   *       - name: judul
   *         in: formData
   *         description: Judul Surat
   *         required: true
   *         type: string
   *       - name: isi
   *         in: formData
   *         description: Isi surat
   *         required: true
   *         type: string
   */
  Route.put('/template-surat/:id', 'SuratTemplateController.edit_Sys').validator('editTemplateSurat').middleware('checkTokenSys')

  /**
   * @swagger
   * /template-surat/{id}:
   *   delete:
   *     tags:
   *       - Template Surat
   *     summary: Delete
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Id
   *         required: true
   *         type: string
   */
  Route.delete('/template-surat/:id', 'SuratTemplateController.delete_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /template-surat:
   *   get:
   *     tags:
   *       - Template Surat
   *     summary: List
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: page
   *         in: query
   *         description: Halaman
   *         required: true
   *         type: string
   *       - name: limit
   *         in: query
   *         description: Data per Halaman
   *         required: true
   *         type: string
   */
  Route.get('/template-surat', 'SuratTemplateController.list_Sys').middleware('checkTokenSys')

  /**
   * @swagger
   * /template-surat/{id}:
   *   get:
   *     tags:
   *       - Template Surat
   *     summary: Detail
   *     consumes:
   *       - application/x-www-form-urlencoded
   *     produces:
   *       - application/json
   *     parameters:
   *       - name: id
   *         in: path
   *         description: Id
   *         required: true
   *         type: string
   */
  Route.get('/template-surat/:id', 'SuratTemplateController.detail_Sys').middleware('checkTokenSys')
}).prefix('api-sys')
