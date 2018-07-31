'use strict'

const MasterKantor = use('App/Models/MasterKantor')
const Response = use('App/Helpers/ResponseHelper')
const Log = use('App/Helpers/LogHelper')

class MasterKantorController {
    async tree({ auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            //Siapkan object
            let data = {
                id: null,
                text: null,
                nodes: []
            }

            const lokasi1 = await MasterKantor.query().where('kdlokasi', user.instansi).first()
            if (lokasi1) {
                data.id = lokasi1.kdlokasi
                data.text = lokasi1.nmlokasi

                const lokasi2 = await MasterKantor.query().where('kdparent', lokasi1.kdlokasi)
                for (let i = 0; i < lokasi2.length; i++) {
                    data.nodes.push({
                        id: lokasi2[i].kdlokasi,
                        text: lokasi2[i].nmlokasi,
                        nodes: []
                    })

                    const lokasi3 = await MasterKantor.query().where('kdparent', lokasi2[i].kdlokasi)
                    for (let j = 0; j < lokasi3.length; j++) {
                        data.nodes[i].nodes.push({
                            id: lokasi3[j].kdlokasi,
                            text: lokasi3[j].nmlokasi,
                            nodes: []
                        })

                        const lokasi4 = await MasterKantor.query().where('kdparent', lokasi3[j].kdlokasi)
                        for (let k = 0; k < lokasi4.length; k++) {
                            data.nodes[i].nodes[j].nodes.push({
                                id: lokasi4[k].kdlokasi,
                                text: lokasi4[k].nmlokasi,
                                nodes: []
                            })
                        }
                    }
                }

                Log.add(user, 'Melihat Daftar Struktur Organisasi')

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Instansi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async treeHtml({ auth }) {
        try {
            const user = await auth.getUser() //Get data user yang login

            //Siapkan object
            let data = {
                id: null,
                text: null,
                nodes: []
            }

            const lokasi1 = await MasterKantor.query().where('kdlokasi', user.instansi).first()
            if (lokasi1) {
                data.id = lokasi1.kdlokasi
                data.text = "<a onclick='detail_pegawai(" + lokasi1.kdlokasi + ")'>" + lokasi1.nmlokasi + "</a>"

                const lokasi2 = await MasterKantor.query().where('kdparent', lokasi1.kdlokasi)
                if (lokasi2.length > 0) {
                    for (let i = 0; i < lokasi2.length; i++) {
                        data.nodes.push({
                            id: lokasi2[i].kdlokasi,
                            text: "<a onclick='detail_pegawai(" + lokasi2[i].kdlokasi + ")'>" + lokasi2[i].nmlokasi + "</a>",
                            nodes: []
                        })
    
                        const lokasi3 = await MasterKantor.query().where('kdparent', lokasi2[i].kdlokasi)
                        if (lokasi3.length > 0) {
                            for (let j = 0; j < lokasi3.length; j++) {
                                data.nodes[i].nodes.push({
                                    id: lokasi3[j].kdlokasi,
                                    text: "<a onclick='detail_pegawai(" + lokasi3[j].kdlokasi + ")'>" + lokasi3[j].nmlokasi + "</a>",
                                    nodes: []
                                })
        
                                const lokasi4 = await MasterKantor.query().where('kdparent', lokasi3[j].kdlokasi)
                                if (lokasi4.length > 0) {
                                    for (let k = 0; k < lokasi4.length; k++) {
                                        data.nodes[i].nodes[j].nodes.push({
                                            id: lokasi4[k].kdlokasi,
                                            text: "<a onclick='detail_pegawai(" + lokasi4[k].kdlokasi + ")'>" + lokasi4[k].nmlokasi + "</a>",
                                            nodes: 0
                                        })
                                    }
                                } else {
                                    data.nodes[i].nodes[j].nodes = 0
                                }                                
                            }
                        } else {
                            data.nodes[i].nodes = 0
                        }
                    }    
                } else {
                    data.nodes = 0
                }
                
                Log.add(user, 'Melihat Daftar Struktur Organisasi')

                return Response.format(true, null, data)
            } else {
                return Response.format(false, 'Instansi tidak ditemukan', null)
            }
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)            
        }
    }

    async listAllParent() {
        try {
            //Get data dari database
            const data = await MasterKantor.query()
                                           .where('kdparent', null)
                                           
            return Response.format(data, null, data)
        } catch (error) {
            return Response.format(false, error.sqlMessage, null)
        }
    }
}

module.exports = MasterKantorController
