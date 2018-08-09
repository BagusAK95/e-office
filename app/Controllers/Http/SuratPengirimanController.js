'use strict'

const SuratPengiriman = use('App/Models/SuratPengiriman')
const Response = use('App/Helpers/ResponseHelper')
const Request = require('request')
const Log = use('App/Helpers/LogHelper')
const Env = use('Env')

class SuratPengirimanController {
    async updateResi({ params, request, auth }) {
        try {
            const user = await auth.getUser()
            const data = request.all()

            const pengiriman = await SuratPengiriman.query().where({ id: params.id, pengirim: user.instansi }).first()
            if (pengiriman) {
                pengiriman.kurir = data.kurir
                pengiriman.resi = data.resi
                pengiriman.save()

                Log.add(user, 'Update Resi Pengiriman Surat Ke ' + pengiriman.nama_instansi, pengiriman)

                return Response.format(true, null, 1)
            } else {
                return Response.format(false, 'Surat pengiriman tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)
        }
    }

    async trackResi({ params, auth, response }) {
        try {
            const user = await auth.getUser()
            const pengiriman = await SuratPengiriman.query().where({ id: params.id, pengirim: user.instansi }).first()
            if (pengiriman) {
                return new Promise((resolve, reject) => {
                    Request.post({
                        url: 'https://pro.rajaongkir.com/api/waybill',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        form : {
                            key: Env.get('RAJAONGKIR_KEY'),
                            waybill: pengiriman.resi,
                            courier: pengiriman.kurir
                        }
                    }, async (err, resp, body) => {
                        if (!err) {
                            const jBody = JSON.parse(body)
                            if (jBody.rajaongkir.status.code == 200) {
                                if (jBody.rajaongkir.result.delivered == true) {
                                    pengiriman.tgl_terima = new Date(jBody.rajaongkir.result.delivery_status.pod_date)    
                                    pengiriman.penerima =jBody.rajaongkir.result.delivery_status.pod_receiver
                                    await pengiriman.save()
                                }
    
                                resolve(Response.format(true, null, jBody.rajaongkir.result.manifest))

                                Log.add(user, 'Track Resi Pengiriman Surat Ke ' + pengiriman.nama_instansi, jBody.rajaongkir.result.manifest)
                            } else {
                                resolve(Response.format(false, jBody.rajaongkir.status.description, null))
                            }
                        } else {
                            resolve(Response.format(false, err, null))
                        }
                    })
                })
            } else {
                return Response.format(false, 'Surat pengiriman tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error, null)            
        }
    }
}

module.exports = SuratPengirimanController
