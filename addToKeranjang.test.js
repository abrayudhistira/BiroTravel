const { addToKeranjang } = require('./controllers/keranjangController');
const Keranjang = require('./models/Keranjang');

jest.mock('./models/Keranjang'); // Mocking the Keranjang model

describe('addToKeranjang', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: { ID_Paket: 2, Jumlah: 3 },
            session: {
                user: { id: 8 }, // Mocking req.session.user
            },
            user: { id: 8 }, // Optional jika masih ada referensi langsung ke req.user
        };

        res = {
            redirect: jest.fn(),
            status: jest.fn(() => res),
            send: jest.fn(),
        };

        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console.error logs
    });

    afterEach(() => {
        jest.clearAllMocks();
        console.error.mockRestore(); // Restore console.error
    });


    it('should redirect to dashboard if user is logged in and item added to cart', async () => {
        // Mocking Keranjang.findOne to return null (item not in cart)
        Keranjang.findOne.mockResolvedValue(null);

        // Mocking Keranjang.create for adding item to cart
        Keranjang.create.mockResolvedValue(true);

        await addToKeranjang(req, res);

        expect(Keranjang.findOne).toHaveBeenCalledWith({
            where: { id: 8, ID_Paket: 2 },
        });
        expect(Keranjang.create).toHaveBeenCalledWith({
            id: 8,
            ID_Paket: 2,
            Jumlah: 3,
        });
        expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should update the quantity if the item already exists in the cart', async () => {
        // Mocking existing item in cart
        const existingItem = { Jumlah: 5, save: jest.fn().mockResolvedValue(true) };
        Keranjang.findOne.mockResolvedValue(existingItem);

        await addToKeranjang(req, res);

        expect(Keranjang.findOne).toHaveBeenCalledWith({
            where: { id: 8, ID_Paket: 2 },
        });
        expect(existingItem.save).toHaveBeenCalled();
        expect(existingItem.Jumlah).toBe(8); // Updated quantity
        expect(res.redirect).toHaveBeenCalledWith('/dashboard');
    });

    it('should redirect to login page if no user is logged in', async () => {
        req.user = null; // Simulate no user logged in

        await addToKeranjang(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/user/login');
    });

    it('should handle errors and return a server error', async () => {
        // Simulate database error
        Keranjang.findOne.mockRejectedValue(new Error('Database error'));

        await addToKeranjang(req, res);

        expect(console.error).toHaveBeenCalledWith(expect.any(Error)); // Ensure error is logged
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Server error');
    });
});
