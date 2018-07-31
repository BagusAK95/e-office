const Log = use('App/Models/Log')

const LogHelper = {
    add: async function(user, keterangan, reff = {}) {
        await Log.create({
            instansi: user.instansi,
            nip: user.nip,
            nama: user.nama_lengkap,
            jabatan: user.nama_jabatan,
            keterangan: keterangan,
            reff: JSON.stringify(reff)
        })
    }
}

module.exports = LogHelper