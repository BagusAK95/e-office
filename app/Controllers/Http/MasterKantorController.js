'use strict'

const MasterKantor = use('App/Models/MasterKantor')

class MasterKantorController {
    async tree({ auth }) {
        const user = await auth.getUser()
        const parentLokasi = user.kode_lokasi.toString().replace(/\d{5}$/g, '00000')

        let data = {}
        const lokasi1 = await MasterKantor.query().where('kdlokasi', Number(parentLokasi)).first()
        if (lokasi1) {
            data[lokasi1.nmlokasi] = {}

            const lokasi2 = await MasterKantor.query().where('kdparent', lokasi1.kdlokasi)
            for (let i = 0; i < lokasi2.length; i++) {
                data[lokasi1.nmlokasi][lokasi2[i].nmlokasi] = {}

                const lokasi3 = await MasterKantor.query().where('kdparent', lokasi2[i].kdlokasi)
                for (let j = 0; j < lokasi3.length; j++) {
                    data[lokasi1.nmlokasi][lokasi2[i].nmlokasi][lokasi3[j].nmlokasi] = {}

                    const lokasi4 = await MasterKantor.query().where('kdparent', lokasi3[j].kdlokasi)
                    for (let k = 0; k < lokasi4.length; k++) {
                        data[lokasi1.nmlokasi][lokasi2[i].nmlokasi][lokasi3[j].nmlokasi][lokasi4[k].nmlokasi] = {}
                    }
                }
            }

            return this.response(true, null, data)
        } else {
            return this.response(false, 'Not found', null)
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
