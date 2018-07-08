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
    Route.put('/profile/editPassword', 'ProfileController.editPassword').middleware('checkToken')

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
    Route.post('/user', 'UserController.add').middleware('checkTokenAdmin')

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
    Route.put('/user/:nip', 'UserController.edit').middleware('checkTokenAdmin')

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
    Route.delete('/user/:nip', 'UserController.destroy').middleware('checkTokenAdmin')

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
    Route.get('/user/:nama/:page/:limit', 'UserController.list').middleware('checkTokenAdmin')

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
    Route.get('/user/:nip', 'UserController.detail').middleware('checkTokenAdmin')

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
    Route.get('/master-pegawai/:nama/:page/:limit', 'MasterPegawaiController.list').middleware('checkTokenAdmin')

    /**
    * @swagger
    * /master-pegawai:
    *   get:
    *     tags:
    *       - Master Pegawai
    *     summary: List All
    *     produces:
    *       - application/json
    */
    Route.get('/master-pegawai', 'MasterPegawaiController.listAll').middleware('checkTokenAdmin')

    /**
    * @swagger
    * /master-pegawai/byLocation/{kode_lokasi}:
    *   get:
    *     tags:
    *       - Master Pegawai
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
    Route.get('/master-pegawai/byLocation/:kode_lokasi', 'MasterPegawaiController.listByLocation').middleware('checkTokenAdmin')

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
    Route.get('/master-pegawai/:nip', 'MasterPegawaiController.detail').middleware('checkTokenAdmin')

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
    Route.get('/master-kantor/tree', 'MasterKantorController.tree').middleware('checkTokenAdmin')

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
    Route.get('/master-kantor/tree-html', 'MasterKantorController.treeHtml').middleware('checkTokenAdmin')

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
    Route.get('/master-instruksi', 'MasterInstruksiController.listAll').middleware('checkToken')

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
    Route.get('/master-klasifikasi', 'MasterklasifikasiController.listAll').middleware('checkToken')

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
    *       - name: nip_tembusan
    *         in: formData
    *         description: NIP Tembusan
    *         required: false
    *         type: string
    *       - name: nama_tembusan
    *         in: formData
    *         description: Nama Tembusan
    *         required: false
    *         type: string
    *       - name: jabatan_tembusan
    *         in: formData
    *         description: Jabatan Tembusan
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
    Route.post('/surat-masuk', 'SuratMasukController.add').middleware('checkTokenTu')

    /**
    * @swagger
    * /surat-masuk/{keyword}/{tgl_awal}/{tgl_akhir}/{page}/{limit}:
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
    *         in: path
    *         description: Kata Kunci
    *         required: false
    *         type: string
    *       - name: tgl_awal
    *         in: path
    *         description: Tanggal Awal
    *         required: false
    *         type: string
    *       - name: tgl_akhir
    *         in: path
    *         description: Tanggal Akhir
    *         required: false
    *         type: string
    *       - name: page
    *         in: path
    *         description: Halaman
    *         required: true
    *         type: string
    *       - name: limit
    *         in: path
    *         description: Data per Halaman
    *         required: true
    *         type: string
    */
    Route.get('/surat-masuk/:keyword/:tgl_awal/:tgl_akhir/:page/:limit', 'SuratMasukController.list').middleware('checkTokenTu')

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
    Route.delete('/surat-masuk/:id', 'SuratMasukController.delete').middleware('checkTokenTu')

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
    *       - name: isi_disposisi
    *         in: formData
    *         description: Isi Disposisi
    *         required: true
    *         type: string
    */
    Route.post('/disposisi', 'DisposisiController.add').middleware('checkToken')

    /**
    * @swagger
    * /disposisi/masuk/{keyword}/{tgl_awal}/{tgl_akhir}/{page}/{limit}:
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
    *         in: path
    *         description: Kata Kunci
    *         required: false
    *         type: string
    *       - name: tgl_awal
    *         in: path
    *         description: Tanggal Awal
    *         required: false
    *         type: string
    *       - name: tgl_akhir
    *         in: path
    *         description: Tanggal Akhir
    *         required: false
    *         type: string
    *       - name: page
    *         in: path
    *         description: Halaman
    *         required: true
    *         type: string
    *       - name: limit
    *         in: path
    *         description: Data per Halaman
    *         required: true
    *         type: string
    */
    Route.get('/disposisi/masuk/:keyword/:tgl_awal/:tgl_akhir/:page/:limit', 'DisposisiController.listIn').middleware('checkToken')

    /**
    * @swagger
    * /disposisi/keluar/{keyword}/{tgl_awal}/{tgl_akhir}/{page}/{limit}:
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
    *         in: path
    *         description: Kata Kunci
    *         required: false
    *         type: string
    *       - name: tgl_awal
    *         in: path
    *         description: Tanggal Awal
    *         required: false
    *         type: string
    *       - name: tgl_akhir
    *         in: path
    *         description: Tanggal Akhir
    *         required: false
    *         type: string
    *       - name: page
    *         in: path
    *         description: Halaman
    *         required: true
    *         type: string
    *       - name: limit
    *         in: path
    *         description: Data per Halaman
    *         required: true
    *         type: string
    */
    Route.get('/disposisi/keluar/:keyword/:tgl_awal/:tgl_akhir/:page/:limit', 'DisposisiController.listOut').middleware('checkToken')

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
    Route.delete('/disposisi/:id', 'DisposisiController.delete').middleware('checkToken')

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
    *       - name: id_disposisi
    *         in: formData
    *         description: ID Disposisi
    *         required: true
    *         type: string
    *       - name: isi_komentar
    *         in: formData
    *         description: Isi Komentar
    *         required: true
    *         type: string
    */
    Route.post('/komentar', 'KomentarController.add').middleware('checkToken')
}).prefix('api')
