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
    * /setFirebase:
    *   put:
    *     tags:
    *       - Login
    *     summary: Set Firebase
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: firebase_device
    *         in: formData
    *         description: Device (Web / App)
    *         required: true
    *         type: string
    *       - name: firebase_token
    *         in: formData
    *         description: Token
    *         required: true
    *         type: string
    *       - name: firebase_info
    *         in: formData
    *         description: Info Device (Type, IME, dll)
    *         required: false
    *         type: string
    */
    Route.put('/setFirebase', 'LoginController.setFirebase').middleware('checkToken:all')

    /**
    * @swagger
    * /unsetFirebase:
    *   put:
    *     tags:
    *       - Login
    *     summary: Unset Firebase
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: firebase_device
    *         in: formData
    *         description: Device (Web / App)
    *         required: true
    *         type: string
    */
    Route.put('/unsetFirebase', 'LoginController.unsetFirebase').middleware('checkToken:all')

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
    Route.get('/profile', 'ProfileController.detail').middleware('checkToken:all')

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
    Route.put('/profile', 'ProfileController.edit').middleware('checkToken:all')

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
    Route.put('/profile/editPassword', 'ProfileController.editPassword').middleware('checkToken:all')

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
    *         description: 1=Admin, 2=Pimpinan, 3=Tata Usaha, 4=Staf, 5=Sekretaris
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
    Route.post('/user', 'UserController.add').middleware('checkToken:admin')

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
    Route.put('/user/:nip', 'UserController.edit').middleware('checkToken:admin')

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
    Route.delete('/user/:nip', 'UserController.delete').middleware('checkToken:admin')

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
    Route.get('/user', 'UserController.list').middleware('checkToken:admin')

    /**
    * @swagger
    * /user/all:
    *   get:
    *     tags:
    *       - User
    *     summary: List All
    *     produces:
    *       - application/json
    */
    Route.get('/user/all', 'UserController.listAll').middleware('checkToken:all')

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
    Route.get('/user/byLocation/:kode_lokasi', 'UserController.listByLocation').middleware('checkToken:all')

    /**
    * @swagger
    * /user/dispositionReciver/{id_surat_masuk}:
    *   get:
    *     tags:
    *       - User
    *     summary: List All Disposition Reciver
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_masuk
    *         in: path
    *         description: Id Surat Masuk
    *         required: true
    *         type: string
    */
    Route.get('/user/dispositionReciver/:id_surat_masuk', 'UserController.listAllDispositionReciver').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /user/mailChecker:
    *   get:
    *     tags:
    *       - User
    *     summary: List All Mail Checker
    *     produces:
    *       - application/json
    */
    Route.get('/user/mailChecker', 'UserController.listAllMailChecker').middleware('checkToken:employe,konsepsurat')

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
    Route.get('/user/:nip', 'UserController.detail').middleware('checkToken:all')

    /**
    * @swagger
    * /master-pegawai:
    *   get:
    *     tags:
    *       - Master Pegawai
    *     summary: List
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nama
    *         in: query
    *         description: Nama Pegawai
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
    Route.get('/master-pegawai', 'MasterPegawaiController.list').middleware('checkToken:admin')

    /**
    * @swagger
    * /master-pegawai/all:
    *   get:
    *     tags:
    *       - Master Pegawai
    *     summary: List All
    *     produces:
    *       - application/json
    */
    Route.get('/master-pegawai/all', 'MasterPegawaiController.listAll').middleware('checkToken:admin')

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
    Route.get('/master-pegawai/:nip', 'MasterPegawaiController.detail').middleware('checkToken:admin')

    /**
    * @swagger
    * /master-kantor/tree:
    *   get:
    *     tags:
    *       - Master Kantor
    *     summary: Tree
    *     produces:
    *       - application/json
    */
    Route.get('/master-kantor/tree', 'MasterKantorController.tree').middleware('checkToken:all')

    /**
    * @swagger
    * /master-kantor/tree-html:
    *   get:
    *     tags:
    *       - Master Kantor
    *     summary: Tree Html
    *     produces:
    *       - application/json
    */
    Route.get('/master-kantor/tree-html', 'MasterKantorController.treeHtml').middleware('checkToken:all')

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
    Route.get('/master-kantor/listAllParent', 'MasterKantorController.listAllParent').middleware('checkToken:all')

    /**
    * @swagger
    * /master-instruksi:
    *   get:
    *     tags:
    *       - Master Instruksi
    *     summary: List All
    *     produces:
    *       - application/json
    */
    Route.get('/master-instruksi', 'MasterInstruksiController.listAll').middleware('checkToken:all')

    /**
    * @swagger
    * /master-klasifikasi:
    *   get:
    *     tags:
    *       - Master Klasifikasi
    *     summary: List All
    *     produces:
    *       - application/json
    */
    Route.get('/master-klasifikasi', 'MasterKlasifikasiController.listAll').middleware('checkToken:all')

    /**
    * @swagger
    * /surat-masuk:
    *   post:
    *     tags:
    *       - Surat Masuk
    *     summary: Add
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: tgl_terima
    *         in: formData
    *         description: Tanggal Terima
    *         required: true
    *         type: string
    *       - name: tgl_surat
    *         in: formData
    *         description: Tanggal Surat
    *         required: true
    *         type: string
    *       - name: nomor_surat
    *         in: formData
    *         description: Nomor Surat
    *         required: true
    *         type: string
    *       - name: nomor_agenda
    *         in: formData
    *         description: Nomor Agenda
    *         required: true
    *         type: string
    *       - name: perihal
    *         in: formData
    *         description: Perihal
    *         required: true
    *         type: string
    *       - name: jenis_instansi
    *         in: formData
    *         description: Jenis Instansi (1=PNS, 2=Swasta)
    *         required: true
    *         type: string
    *       - name: nama_instansi
    *         in: formData
    *         description: Nama Instansi
    *         required: true
    *         type: string
    *       - name: nama_pengirim
    *         in: formData
    *         description: Nama Pengirim
    *         required: true
    *         type: string
    *       - name: jabatan_pengirim
    *         in: formData
    *         description: Jabatan Pengirim
    *         required: true
    *         type: string
    *       - name: alamat_pengirim
    *         in: formData
    *         description: Alamat Pengirim
    *         required: true
    *         type: string
    *       - name: klasifikasi
    *         in: formData
    *         description: Klasifikasi
    *         required: true
    *         type: string
    *       - name: keamanan
    *         in: formData
    *         description: Tingkat Keamanan (1=Biasa, 2=Rahasia Terbatas, 3=Rahasia, 4=Sangat Rahasia)
    *         required: true
    *         type: string
    *       - name: kecepatan
    *         in: formData
    *         description: Tingkat Kecepatan (1=Biasa, 2=Segera, 3=Amat Segera)
    *         required: true
    *         type: string
    *       - name: arr_tembusan
    *         in: formData
    *         description: Daftar Tembusan
    *         required: false
    *         type: string
    *       - name: nip_plt
    *         in: formData
    *         description: NIP Pelaksana Tugas
    *         required: false
    *         type: string
    *       - name: nama_plt
    *         in: formData
    *         description: Nama Pelaksana Tugas
    *         required: false
    *         type: string
    *       - name: jabatan_plt
    *         in: formData
    *         description: Jabatan Pelaksana Tugas
    *         required: false
    *         type: string
    *       - name: ringkasan
    *         in: formData
    *         description: Ringkasan Surat
    *         required: false
    *         type: string
    *       - name: isi_surat
    *         in: formData
    *         description: Isi Surat
    *         required: false
    *         type: string
    *       - name: lampiran
    *         in: formData
    *         description: File Lampiran
    *         required: true
    *         type: string
    */
    Route.post('/surat-masuk', 'SuratMasukController.add').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-masuk/{id}:
    *   delete:
    *     tags:
    *       - Surat Masuk
    *     summary: Delete
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.delete('/surat-masuk/:id', 'SuratMasukController.delete').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-masuk/{id}:
    *   put:
    *     tags:
    *       - Surat Masuk
    *     summary: Send
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    *       - name: tgl_terima
    *         in: formData
    *         description: Tanggal Terima
    *         required: true
    *         type: string
    *       - name: nip_plt
    *         in: formData
    *         description: NIP Pelaksana Tugas
    *         required: false
    *         type: string
    *       - name: nama_plt
    *         in: formData
    *         description: Nama Pelaksana Tugas
    *         required: false
    *         type: string
    *       - name: jabatan_plt
    *         in: formData
    *         description: Jabatan Pelaksana Tugas
    *         required: false
    *         type: string
    *       - name: lampiran
    *         in: formData
    *         description: File Lampiran
    *         required: true
    *         type: string
    */
    Route.put('/surat-masuk/:id', 'SuratMasukController.send').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-masuk:
    *   get:
    *     tags:
    *       - Surat Masuk
    *     summary: List
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/surat-masuk', 'SuratMasukController.list').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-masuk/unreadAmount:
    *   get:
    *     tags:
    *       - Surat Masuk
    *     summary: Unread Amount
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/surat-masuk/unreadAmount', 'SuratMasukController.unreadAmount').middleware('checkToken:all')

    /**
    * @swagger
    * /surat-masuk/{id}:
    *   get:
    *     tags:
    *       - Surat Masuk
    *     summary: Detail
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.get('/surat-masuk/:id', 'SuratMasukController.detail').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-tembusan:
    *   get:
    *     tags:
    *       - Surat Tembusan
    *     summary: List
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/surat-tembusan', 'SuratTembusanController.list').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-tembusan/{id}:
    *   put:
    *     tags:
    *       - Surat Tembusan
    *     summary: Send
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    *       - name: tgl_terima
    *         in: formData
    *         description: Tanggal Terima
    *         required: true
    *         type: string
    *       - name: lampiran
    *         in: formData
    *         description: File Lampiran
    *         required: true
    *         type: string
    */
    Route.put('/surat-tembusan/:id', 'SuratTembusanController.send').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /surat-tembusan/unreadAmount:
    *   get:
    *     tags:
    *       - Surat Tembusan
    *     summary: Unread Amount
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/surat-tembusan/unreadAmount', 'SuratTembusanController.unreadAmount').middleware('checkToken:all')

    /**
    * @swagger
    * /surat-tembusan/{id}:
    *   get:
    *     tags:
    *       - Surat Tembusan
    *     summary: Detail
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.get('/surat-tembusan/:id', 'SuratTembusanController.detail').middleware('checkToken:employe,suratmasuk')

    /**
    * @swagger
    * /disposisi:
    *   post:
    *     tags:
    *       - Disposisi
    *     summary: Add
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_masuk
    *         in: formData
    *         description: ID Surat Masuk
    *         required: true
    *         type: string
    *       - name: nip_penerima
    *         in: formData
    *         description: NIP Penerima
    *         required: true
    *         type: string
    *       - name: nama_penerima
    *         in: formData
    *         description: Nama Penerima
    *         required: true
    *         type: string
    *       - name: jabatan_penerima
    *         in: formData
    *         description: Jabatan Penerima
    *         required: true
    *         type: string
    *       - name: instruksi
    *         in: formData
    *         description: Instruksi
    *         required: true
    *         type: string
    *       - name: isi_disposisi
    *         in: formData
    *         description: Isi Disposisi
    *         required: true
    *         type: string
    */
    Route.post('/disposisi', 'DisposisiController.add').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /disposisi/setStatus/{id}:
    *   put:
    *     tags:
    *       - Disposisi
    *     summary: Set Status
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
    *       - name: status
    *         in: formData
    *         description: Status (1=Diselesaikan, 2=Ditolak)
    *         required: true
    *         type: string
    *       - name: keterangan
    *         in: formData
    *         description: Keterangan
    *         required: true
    *         type: string
    */
    Route.put('/disposisi/setStatus/:id', 'DisposisiController.setStatus').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /disposisi/{id}:
    *   delete:
    *     tags:
    *       - Disposisi
    *     summary: Delete
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.delete('/disposisi/:id', 'DisposisiController.delete').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /disposisi/masuk:
    *   get:
    *     tags:
    *       - Disposisi
    *     summary: List In
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/disposisi/masuk', 'DisposisiController.listIn').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /disposisi/keluar:
    *   get:
    *     tags:
    *       - Disposisi
    *     summary: List Out
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/disposisi/keluar', 'DisposisiController.listOut').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /disposisi/surat/{id_surat_masuk}:
    *   get:
    *     tags:
    *       - Disposisi
    *     summary: List By Mail
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_masuk
    *         in: path
    *         description: Id Surat Masuk
    *         required: true
    *         type: string
    */
    Route.get('/disposisi/surat/:id_surat_masuk', 'DisposisiController.listAllByMail').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /disposisi/unreadAmount:
    *   get:
    *     tags:
    *       - Disposisi
    *     summary: Unread Amount
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/disposisi/unreadAmount', 'DisposisiController.unreadAmount').middleware('checkToken:all')

    /**
    * @swagger
    * /disposisi/{id}:
    *   get:
    *     tags:
    *       - Disposisi
    *     summary: Detail
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.get('/disposisi/:id', 'DisposisiController.detail').middleware('checkToken:employe,disposisi')

    /**
    * @swagger
    * /komentar:
    *   post:
    *     tags:
    *       - Komentar
    *     summary: Add
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_masuk
    *         in: formData
    *         description: ID Surat Masuk
    *         required: false
    *         type: string
    *       - name: id_disposisi
    *         in: formData
    *         description: ID Disposisi
    *         required: false
    *         type: string
    *       - name: isi_komentar
    *         in: formData
    *         description: Isi Komentar
    *         required: true
    *         type: string
    */
    Route.post('/komentar', 'KomentarController.add').middleware('checkToken:employe')

    /**
    * @swagger
    * /komentar:
    *   get:
    *     tags:
    *       - Komentar
    *     summary: List
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_masuk
    *         in: query
    *         description: ID Surat Masuk
    *         required: false
    *         type: string
    *       - name: id_disposisi
    *         in: query
    *         description: ID Disposisi
    *         required: false
    *         type: string
    *       - name: page
    *         in: query
    *         description: Halaman
    *         required: true
    *         type: string
    *       - name: limit
    *         in: query
    *         description: Limit
    *         required: true
    *         type: string
    */
    Route.get('/komentar', 'KomentarController.list').middleware('checkToken:employe')

    /**
    * @swagger
    * /komentar/{id}:
    *   delete:
    *     tags:
    *       - Komentar
    *     summary: Delete
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.delete('/komentar/:id', 'KomentarController.delete').middleware('checkToken:employe')

    /**
    * @swagger
    * /konsep-surat:
    *   post:
    *     tags:
    *       - Konsep Surat
    *     summary: Add
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nip_penandatangan
    *         in: formData
    *         description: NIP Penandatangan
    *         required: true
    *         type: string
    *       - name: nama_penandatangan
    *         in: formData
    *         description: Nama Penandatangan
    *         required: true
    *         type: string
    *       - name: jabatan_penandatangan
    *         in: formData
    *         description: Jabatan Penandatangan
    *         required: true
    *         type: string
    *       - name: tgl_surat
    *         in: formData
    *         description: Tanggal Surat
    *         required: true
    *         type: string
    *       - name: lampiran
    *         in: formData
    *         description: Lampiran
    *         required: false
    *         type: string
    *       - name: arr_penerima
    *         in: formData
    *         description: Daftar Penerima
    *         required: true
    *         type: string
    *       - name: arr_tembusan
    *         in: formData
    *         description: Daftar Tembusan
    *         required: false
    *         type: string
    *       - name: arr_pemeriksa
    *         in: formData
    *         description: Daftar Pemeriksa
    *         required: true
    *         type: string
    *       - name: perihal
    *         in: formData
    *         description: Perihal
    *         required: true
    *         type: string
    *       - name: dari_surat_masuk
    *         in: formData
    *         description: ID Surat Masuk
    *         required: false
    *         type: string
    *       - name: keamanan
    *         in: formData
    *         description: Tingkat Keamanan (1=Biasa, 2=Rahasia Terbatas, 3=Rahasia, 4=Sangat Rahasia)
    *         required: true
    *         type: string
    *       - name: kecepatan
    *         in: formData
    *         description: Tingkat Kecepatan (1=Biasa, 2=Segera, 3=Amat Segera)
    *         required: true
    *         type: string
    *       - name: klasifikasi
    *         in: formData
    *         description: Klasifikasi
    *         required: true
    *         type: string
    *       - name: ringkasan
    *         in: formData
    *         description: Ringkasan
    *         required: true
    *         type: string
    *       - name: isi_surat
    *         in: formData
    *         description: Isi Surat
    *         required: true
    *         type: string
    */
    Route.post('/konsep-surat', 'SuratKeluarController.add').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/{id}:
    *   put:
    *     tags:
    *       - Konsep Surat
    *     summary: Update
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
    *       - name: nip_penandatangan
    *         in: formData
    *         description: NIP Penandatangan
    *         required: true
    *         type: string
    *       - name: nama_penandatangan
    *         in: formData
    *         description: Nama Penandatangan
    *         required: true
    *         type: string
    *       - name: jabatan_penandatangan
    *         in: formData
    *         description: Jabatan Penandatangan
    *         required: true
    *         type: string
    *       - name: tgl_surat
    *         in: formData
    *         description: Tanggal Surat
    *         required: true
    *         type: string
    *       - name: lampiran
    *         in: formData
    *         description: Lampiran
    *         required: false
    *         type: string
    *       - name: instansi_penerima
    *         in: formData
    *         description: Instansi Penerima
    *         required: true
    *         type: string
    *       - name: nama_instansi
    *         in: formData
    *         description: Nama Instansi
    *         required: true
    *         type: string
    *       - name: arr_penerima
    *         in: formData
    *         description: Daftar Penerima
    *         required: true
    *         type: string
    *       - name: arr_tembusan
    *         in: formData
    *         description: Daftar Tembusan
    *         required: false
    *         type: string
    *       - name: perihal
    *         in: formData
    *         description: Perihal
    *         required: true
    *         type: string
    *       - name: dari_surat_masuk
    *         in: formData
    *         description: ID Surat Masuk
    *         required: false
    *         type: string
    *       - name: keamanan
    *         in: formData
    *         description: Tingkat Keamanan (1=Biasa, 2=Rahasia Terbatas, 3=Rahasia, 4=Sangat Rahasia)
    *         required: true
    *         type: string
    *       - name: kecepatan
    *         in: formData
    *         description: Tingkat Kecepatan (1=Biasa, 2=Segera, 3=Amat Segera)
    *         required: true
    *         type: string
    *       - name: klasifikasi
    *         in: formData
    *         description: Klasifikasi
    *         required: true
    *         type: string
    *       - name: ringkasan
    *         in: formData
    *         description: Ringkasan
    *         required: true
    *         type: string
    *       - name: isi_surat
    *         in: formData
    *         description: Isi Surat
    *         required: true
    *         type: string
    */
    Route.put('/konsep-surat/:id', 'SuratKeluarController.updateConcept').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/{id}:
    *   delete:
    *     tags:
    *       - Konsep Surat
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
    Route.delete('/konsep-surat/:id', 'SuratKeluarController.delete').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/checkingConcept/{id_surat_keluar}:
    *   put:
    *     tags:
    *       - Konsep Surat
    *     summary: Checking Concept
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_keluar
    *         in: path
    *         description: Id Surat Keluar
    *         required: true
    *         type: string
    *       - name: status
    *         in: formData
    *         description: Status (2=Revisi, 3=Disetujui)
    *         required: true
    *         type: string
    *       - name: keterangan
    *         in: formData
    *         description: Keterangan
    *         required: false
    *         type: string
    */
    Route.put('/konsep-surat/checkingConcept/:id_surat_keluar', 'SuratPemeriksaController.updateStatus').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/updateChecker/{id_surat_keluar}:
    *   put:
    *     tags:
    *        - Konsep Surat
    *     summary: Update Checker
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id_surat_keluar
    *         in: path
    *         description: Id Surat Keluar
    *         required: true
    *         type: string
    *       - name: arr_pemeriksa
    *         in: formData
    *         description: Daftar Pemeriksa Konsep
    *         required: true
    *         type: string
    */
    Route.put('/konsep-surat/updateChecker/:id_surat_keluar', 'SuratPemeriksaController.UpdateList').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/listChecked:
    *   get:
    *     tags:
    *       - Konsep Surat
    *     summary: List Checked
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/konsep-surat/listChecked', 'SuratKeluarController.listConceptChecked').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/listMaked:
    *   get:
    *     tags:
    *       - Konsep Surat
    *     summary: List Maked
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/konsep-surat/listMaked', 'SuratKeluarController.listConceptMaked').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /konsep-surat/unreadAmount:
    *   get:
    *     tags:
    *       - Konsep Surat
    *     summary: Unread Amount
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/konsep-surat/unreadAmount', 'SuratKeluarController.unreadAmountConcept').middleware('checkToken:all')

    /**
    * @swagger
    * /konsep-surat/{id}:
    *   get:
    *     tags:
    *       - Konsep Surat
    *     summary: Detail
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.get('/konsep-surat/:id', 'SuratKeluarController.detailConcept').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /tujuan-surat:
    *   post:
    *     tags:
    *       - Tujuan Surat
    *     summary: Add
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: nama
    *         in: formData
    *         description: Halaman
    *         required: true
    *         type: string
    *       - name: data
    *         in: formData
    *         description: Data per Halaman
    *         required: true
    *         type: string
    */
    Route.post('/tujuan-surat', 'SuratGroupTujuanController.add').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /tujuan-surat/{id}:
    *   put:
    *     tags:
    *       - Tujuan Surat
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
    *       - name: nama
    *         in: formData
    *         description: Halaman
    *         required: true
    *         type: string
    *       - name: data
    *         in: formData
    *         description: Data per Halaman
    *         required: true
    *         type: string
    */
    Route.put('/tujuan-surat/:id', 'SuratGroupTujuanController.edit').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /tujuan-surat/{id}:
    *   delete:
    *     tags:
    *       - Tujuan Surat
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
    Route.delete('/tujuan-surat/:id', 'SuratGroupTujuanController.delete').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /tujuan-surat:
    *   get:
    *     tags:
    *       - Tujuan Surat
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
    Route.get('/tujuan-surat', 'SuratGroupTujuanController.list').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /tujuan-surat/{id}:
    *   get:
    *     tags:
    *       - Tujuan Surat
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
    Route.get('/tujuan-surat/:id', 'SuratGroupTujuanController.detail').middleware('checkToken:employe,konsepsurat')

    /**
    * @swagger
    * /surat-keluar:
    *   get:
    *     tags:
    *       - Surat Keluar
    *     summary: List
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: keyword
    *         in: query
    *         description: Kata Kunci
    *         required: false
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
    Route.get('/surat-keluar', 'SuratKeluarController.listMail').middleware('checkToken:employe,suratkeluar')

    /**
    * @swagger
    * /surat-keluar/{id}:
    *   post:
    *     tags:
    *       - Surat Keluar
    *     summary: Send
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    *       - name: nomor_surat
    *         in: formData
    *         description: Nomor Surat
    *         required: true
    *         type: string
    *       - name: nomor_agenda
    *         in: formData
    *         description: Nomor Agenda
    *         required: true
    *         type: string
    *       - name: lampiran
    *         in: formData
    *         description: Lampiran
    *         required: true
    *         type: string
    */
    Route.post('/surat-keluar/:id', 'SuratKeluarController.sendMail').middleware('checkToken:employe,suratkeluar')

    /**
    * @swagger
    * /surat-keluar/unreadAmount:
    *   get:
    *     tags:
    *       - Surat Keluar
    *     summary: Unread Amount
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/surat-keluar/unreadAmount', 'SuratKeluarController.unreadAmountMail').middleware('checkToken:all')

    /**
    * @swagger
    * /surat-keluar/{id}:
    *   get:
    *     tags:
    *       - Surat Keluar
    *     summary: Detail
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: id
    *         in: path
    *         description: ID
    *         required: true
    *         type: string
    */
    Route.get('/surat-keluar/:id', 'SuratKeluarController.detailMail').middleware('checkToken:employe,suratkeluar')

    /**
    * @swagger
    * /notifikasi:
    *   get:
    *     tags:
    *       - Notifikasi
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
    *         description: Limit
    *         required: true
    *         type: string
    */
    Route.get('/notifikasi', 'NotifikasiController.list').middleware('checkToken:all')

    /**
    * @swagger
    * /notifikasi/{id}:
    *   put:
    *     tags:
    *       - Notifikasi
    *     summary: Mark As Read
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
    Route.put('/notifikasi/:id', 'NotifikasiController.markAsRead').middleware('checkToken:all')

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
    *       - name: nip
    *         in: query
    *         description: Nomor Induk Pegawai
    *         required: false
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
    Route.get('/log', 'LogController.list').middleware('checkToken:all')

    /**
    * @swagger
    * /notifikasi/broadcast:
    *   post:
    *     tags:
    *       - Notifikasi
    *     summary: Broadcast
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    *     parameters:
    *       - name: arr_penerima
    *         in: formData
    *         description: Array NIP Penerima
    *         required: false
    *         type: string
    *       - name: pesan
    *         in: formData
    *         description: Isi Pesan
    *         required: true
    *         type: string
    */
    Route.post('/notifikasi/broadcast', 'NotifikasiController.broadcast').middleware('checkToken:admin')

    /**
    * @swagger
    * /statistik/total:
    *   get:
    *     tags:
    *       - Statistik
    *     summary: Total
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/statistik/total', 'StatistikController.total').middleware('checkToken:all')

    /**
    * @swagger
    * /statistik/unread:
    *   get:
    *     tags:
    *       - Statistik
    *     summary: Unread
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/statistik/unread', 'StatistikController.unread').middleware('checkToken:all')

    /**
    * @swagger
    * /ekspedisi:
    *   get:
    *     tags:
    *       - Ekspedisi
    *     summary: List All
    *     consumes:
    *       - application/x-www-form-urlencoded
    *     produces:
    *       - application/json
    */
    Route.get('/ekspedisi', 'MasterEkspedisiController.listAll').middleware('checkToken:all')

    /**
    * @swagger
    * /surat-pengiriman/{id}:
    *   put:
    *     tags:
    *       - Surat Pengiriman
    *     summary: Update Resi
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
    *       - name: kurir
    *         in: formData
    *         description: Kode Ekspedisi
    *         required: true
    *         type: string
    *       - name: resi
    *         in: formData
    *         description: Nomor Resi
    *         required: true
    *         type: string
    */
    Route.put('/surat-pengiriman/:id', 'SuratPengirimanController.updateResi').middleware('checkToken:employe,suratkeluar')

    /**
    * @swagger
    * /surat-pengiriman/track/{id}:
    *   get:
    *     tags:
    *       - Surat Pengiriman
    *     summary: Track Resi
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
    Route.get('/surat-pengiriman/track/:id', 'SuratPengirimanController.trackResi').middleware('checkToken:employe,suratkeluar')
}).prefix('api')