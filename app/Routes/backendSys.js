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

    Route.get('/docs', ({ view }) => {
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
    * /user/listDeviceInfo/{instansi}:
    *   get:
    *     tags:
    *       - User
    *     summary: List Device Info
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: instansi
    *         in: path
    *         description: Instansi
    *         required: true
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
    Route.get('/user/listDeviceInfo/:instansi', 'UserController.listDeviceInfo_Sys').middleware('checkTokenSys')

    /**
    * @swagger
    * /user/{instansi}/{nip}:
    *   put:
    *     tags:
    *       - User
    *     summary: Edit
    *     consumes:
    *       - application/x-www-form-urlencoded
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
    Route.put('/user/:instansi/:nip', 'UserController.edit_Sys').middleware('checkTokenSys')
}).prefix('api-sys')