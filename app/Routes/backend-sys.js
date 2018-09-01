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
            apis: ['./app/Routes/backend-sys.js'] // Path to the API docs
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
}).prefix('api-sys')