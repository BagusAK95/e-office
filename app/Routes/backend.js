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
                    title: 'e-office', // Title (required)
                    version: '1.0.0', // Version (required)
                    description: 'This is about documentation of e-office.'
                },
                basePath: "/api",
                schemes : ['http'],
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            },
            apis: ['./app/Routes/backend.js'] // Path to the API docs
        }
        
        return swaggerJSDoc(options)
    }).as('swaggerSpec')
    
    Route.get('/docs', ({ view }) => {
        return view.render('swaggerUI')
    }).as('swaggerUI')

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
    *       - name: nip
    *         in: formData
    *         description: Nomor Induk Pegawai
    *         required: true
    *         type: string
    *       - name: password
    *         in: formData
    *         description: Password
    *         required: true
    *         type: string
    *         format: password
    */
    Route.post('/getToken', 'LoginController.getToken').validator('Login')

    /**
    * @swagger
    * /profile:
    *   get:
    *     tags:
    *       - Profile
    *     summary: Detail
    *     produces:
    *       - application/json
    */
    Route.get('/profile', 'ProfileController.detail').middleware('checkToken')

    /**
    * @swagger
    * /profile:
    *   put:
    *     tags:
    *       - Profile
    *     summary: Edit
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
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
    *         description: 1=Admin, 2=Pimpinan, 3=Tata Usaha, 4=Staf
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
    Route.put('/profile', 'ProfileController.edit').middleware('checkToken')

    /**
    * @swagger
    * /user:
    *   post:
    *     tags:
    *       - User
    *     summary: Add
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nip
    *         in: formData
    *         description: Nomor Induk Pegawai
    *         required: true
    *         type: string
    *       - name: nama_lengkap
    *         in: formData
    *         description: Nama Lengkap
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
    *       - name: kode_lokasi
    *         in: formData
    *         description: Kode Lokasi
    *         required: false
    *         type: string
    *       - name: kode_jabatan
    *         in: formData
    *         description: Kode Jabatan
    *         required: false
    *         type: string
    *       - name: nama_jabatan
    *         in: formData
    *         description: Nama Jabatan
    *         required: false
    *         type: string
    *       - name: kode_eselon
    *         in: formData
    *         description: Kode Eselon
    *         required: false
    *         type: string
    *       - name: golongan
    *         in: formData
    *         description: Golongan
    *         required: false
    *         type: string
    *       - name: password
    *         in: formData
    *         description: Password
    *         required: true
    *         type: string
    *         format: password
    *       - name: level
    *         in: formData
    *         description: 1=Admin, 2=Pimpinan, 3=Tata Usaha, 4=Staf
    *         required: true
    *         type: string
    *       - name: akses
    *         in: formData
    *         description: Daftar Akses Menu
    *         required: false
    *         type: string
    *       - name: status
    *         in: formData
    *         description: 0=Non Aktif, 1=Aktif
    *         required: true
    *         type: string
    */
    Route.post('/user', 'UserController.add').middleware('checkToken')

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
    *         description: 1=Admin, 2=Pimpinan, 3=Tata Usaha, 4=Staf
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
    Route.put('/user/:nip', 'UserController.edit').middleware('checkToken')

    /**
    * @swagger
    * /user/{nip}:
    *   delete:
    *     tags:
    *       - User
    *     summary: Delete
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
    */
    Route.delete('/user/:nip', 'UserController.destroy').middleware('checkToken')

    /**
    * @swagger
    * /user/{nama}/{page}/{limit}:
    *   get:
    *     tags:
    *       - User
    *     summary: List
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nama
    *         in: path
    *         description: Nama Pegawai
    *         required: false
    *         type: string
    *       - name: page
    *         in: path
    *         description: Page
    *         required: true
    *         type: string
    *       - name: limit
    *         in: path
    *         description: Limit
    *         required: true
    *         type: string
    */
    Route.get('/user/:nama/:page/:limit', 'UserController.list').middleware('checkToken')

    /**
    * @swagger
    * /user/{nip}:
    *   get:
    *     tags:
    *       - User
    *     summary: Detail
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
    */
    Route.get('/user/:nip', 'UserController.detail').middleware('checkToken')

    /**
    * @swagger
    * /master-pegawai/{nama}/{page}/{limit}:
    *   get:
    *     tags:
    *       - Master Pegawai
    *     summary: List
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nama
    *         in: path
    *         description: Nama Pegawai
    *         required: false
    *         type: string
    *       - name: page
    *         in: path
    *         description: Page
    *         required: true
    *         type: string
    *       - name: limit
    *         in: path
    *         description: Limit
    *         required: true
    *         type: string
    */
    Route.get('/master-pegawai/:nama/:page/:limit', 'MasterPegawaiController.list').middleware('checkToken')

    /**
    * @swagger
    * /master-pegawai/{nip}:
    *   get:
    *     tags:
    *       - Master Pegawai
    *     summary: Detail
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nip
    *         in: path
    *         description: Nomor Induk Pegawai
    *         required: true
    *         type: string
    */
   Route.get('/master-pegawai/:nip', 'MasterPegawaiController.detail').middleware('checkToken')
}).prefix('api')
