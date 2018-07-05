'use strict'

const MasterKantor = use('App/Models/MasterKantor')

class MasterKantorController {
    async tree({ auth }) {
        try {
            const user = await auth.getUser()
            const parentLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

            let data = {
                id: null,
                text: null,
                html: null,
                nodes: []
            }

            const lokasi1 = await MasterKantor.query().where('kdlokasi', Number(parentLokasi)).first()
            if (lokasi1) {
                data.id = lokasi1.kdlokasi
                data.text = lokasi1.nmlokasi
                data.html = "<a onclick='detail_pegawai(" + lokasi1.kdlokasi + ")'>" + lokasi1.nmlokasi + "</a>"

                const lokasi2 = await MasterKantor.query().where('kdparent', lokasi1.kdlokasi)
                for (let i = 0; i < lokasi2.length; i++) {
                    data.nodes.push({
                        id: lokasi2[i].kdlokasi,
                        text: lokasi2[i].nmlokasi,
                        html: "<a onclick='detail_pegawai(" + lokasi2[i].kdlokasi + ")'>" + lokasi2[i].nmlokasi + "</a>",
                        nodes: []
                    })

                    const lokasi3 = await MasterKantor.query().where('kdparent', lokasi2[i].kdlokasi)
                    for (let j = 0; j < lokasi3.length; j++) {
                        data.nodes[i].nodes.push({
                            id: lokasi3[j].kdlokasi,
                            text: lokasi3[j].nmlokasi,
                            html: "<a onclick='detail_pegawai(" + lokasi3[j].kdlokasi + ")'>" + lokasi3[j].nmlokasi + "</a>",
                            nodes: []
                        })

                        const lokasi4 = await MasterKantor.query().where('kdparent', lokasi3[j].kdlokasi)
                        for (let k = 0; k < lokasi4.length; k++) {
                            data.nodes[i].nodes[j].nodes.push({
                                id: lokasi4[k].kdlokasi,
                                text: lokasi4[k].nmlokasi,
                                html: "<a onclick='detail_pegawai(" + lokasi4[k].kdlokasi + ")'>" + lokasi4[k].nmlokasi + "</a>",
                                nodes: []
                            })
                        }
                    }
                }

                return this.response(true, null, data)
            } else {
                return this.response(false, 'Data tidak ditemukan', null)
            }
        } catch (error) {
            return this.response(false, error.sqlMessage, null)            
        }
    }

    async response(success, message, data) {
        return {
            success: success, 
            message: message,
            data: data
        }
    }
}

module.exports = MasterKantorController
