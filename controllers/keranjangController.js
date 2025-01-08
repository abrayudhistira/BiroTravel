const Keranjang = require('../models/Keranjang');
const PaketBundling = require('../models/PaketBundling');

// Tampilkan halaman keranjang
const showKeranjang = async (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.redirect('/user/login');
    }

    try {
        const keranjangItems = await Keranjang.findAll({
            where: { id: user.id },
            include: [{ model: PaketBundling, as: 'PaketBundling',attributes: ['Nama_paket', 'Harga'] }]
        });

        res.render('user/keranjang', { user, keranjangItems });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching keranjang data');
    }
};

// Tambahkan item ke keranjang
const addToKeranjang = async (req, res) => {
    const { ID_Paket } = req.body;
    const user = req.session.user;

    if (!user) {
        return res.redirect('/user/login');
    }

    try {
        const existingItem = await Keranjang.findOne({
            where: { id: user.id, ID_Paket }
        });

        if (existingItem) {
            existingItem.Jumlah += 1;
            await existingItem.save();
        } else {
            await Keranjang.create({
                id: user.id,
                ID_Paket,
                Jumlah: 1
            });
        }

        res.redirect('/user/keranjang');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding item to keranjang');
    }
};

// Hapus item dari keranjang
// const removeFromKeranjang = async (req, res) => {
//     const { keranjang_id } = req.body;
//     const user = req.session.user;

//     if (!user) {
//         return res.redirect('/user/login');
//     }

//     try {
//         await Keranjang.destroy({
//             where: { keranjang_id, id: user.id }
//         });

//         res.redirect('/user/keranjang');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send('Error removing item from keranjang');
//     }
// };
const removeFromKeranjang = async (req, res) => {
    const { id } = req.params;  // Ambil ID dari URL
    const user = req.session.user;

    if (!user) {
        return res.redirect('/user/login');
    }

    try {
        // Cari item keranjang berdasarkan ID dan user
        const item = await Keranjang.findOne({
            where: { id, userId: user.id }
        });

        if (!item) {
            return res.status(404).send('Item tidak ditemukan');
        }

        // Hapus item keranjang
        await item.destroy();

        res.redirect('/user/keranjang');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing item from keranjang');
    }
};



module.exports = {
    showKeranjang,
    addToKeranjang,
    removeFromKeranjang
};
