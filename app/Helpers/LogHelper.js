const Log = use('App/Models/Log')

const LogHelper = {
    add: async function(user, keterangan) {
        await Log.create({
            instansi: user.instansi,
            nip: user.nip,
            nama: user.nama_lengkap,
            jabatan: user.nama_jabatan,
            keterangan: keterangan
        })
    }
}

module.exports = LogHelper