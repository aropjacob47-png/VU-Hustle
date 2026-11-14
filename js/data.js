// Categories and the starter (sample) data. New listings and reviews are saved in the browser.
VU.CATEGORIES = [
    { id: 1, name: 'Food' },
    { id: 2, name: 'Fashion' },
    { id: 3, name: 'Beauty' },
    { id: 4, name: 'Phones and accessories' },
    { id: 5, name: 'Services' },
    { id: 6, name: 'Other' }
];

VU.SEED = {
    sellers: [
        {
            id: 1, owner_name: 'Sample Owner One', business_name: 'Sample Perfume Corner', category_id: 3,
            description: 'Sample listing for testing the site. Body sprays and perfume oils at fixed prices.',
            logo: null, phone: '0700000001', whatsapp: '', campus_location: 'Block A entrance',
            status: 'approved', created_at: '2026-11-01T09:00:00.000Z',
            products: [{ name: 'Perfume oil 10ml', price: 15000, photo: null }, { name: 'Body spray', price: 12000, photo: null }]
        },
        {
            id: 2, owner_name: 'Sample Owner Two', business_name: 'Sample Cake Stop', category_id: 1,
            description: 'Sample listing for testing the site. Cakes and donuts baked fresh to order.',
            logo: null, phone: '0700000002', whatsapp: '0700000002', campus_location: 'Main canteen',
            status: 'approved', created_at: '2026-11-02T09:00:00.000Z',
            products: [{ name: 'Chocolate cake slice', price: 5000, photo: null }, { name: 'Box of 6 donuts', price: 10000, photo: null }]
        },
        {
            id: 3, owner_name: 'Sample Owner Three', business_name: 'Sample Phone Gear', category_id: 4,
            description: 'Sample listing for testing the site. Chargers, earphones and phone cases.',
            logo: null, phone: '0700000003', whatsapp: '', campus_location: 'Library steps',
            status: 'approved', created_at: '2026-11-03T09:00:00.000Z',
            products: [{ name: 'Phone charger', price: 20000, photo: null }, { name: 'Earphones', price: 10000, photo: null }]
        }
    ],
    reviews: [
        { id: 1, seller_id: 1, reviewer_name: 'Sample Buyer', rating: 5, comment: 'Sample review. Smells great and the price matched the listing.', status: 'visible', created_at: '2026-11-04T09:00:00.000Z' },
        { id: 2, seller_id: 2, reviewer_name: 'Sample Buyer', rating: 4, comment: 'Sample review. Fresh cake and quick pickup on campus.', status: 'visible', created_at: '2026-11-04T10:00:00.000Z' }
    ],
    reports: [],
    messages: []
};
