// List Your Business form: checks the fields, shrinks the photos and saves the listing as pending.
(function () {
    var catSel = document.getElementById('category_id');
    VU.CATEGORIES.forEach(function (c) {
        var o = document.createElement('option');
        o.value = c.id; o.textContent = c.name; catSel.appendChild(o);
    });

    function readImage(file, maxW) {
        return new Promise(function (resolve, reject) {
            if (!file) { resolve(null); return; }
            if (['image/jpeg', 'image/png', 'image/webp'].indexOf(file.type) < 0 || file.size > 3 * 1024 * 1024) { reject(new Error('bad')); return; }
            var fr = new FileReader();
            fr.onerror = function () { reject(new Error('bad')); };
            fr.onload = function () {
                var img = new Image();
                img.onerror = function () { reject(new Error('bad')); };
                img.onload = function () {
                    var w = Math.min(img.width, maxW), h = Math.round(img.height * w / img.width);
                    var canvas = document.createElement('canvas');
                    canvas.width = w; canvas.height = h;
                    var ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL('image/jpeg', 0.72));
                };
                img.src = fr.result;
            };
            fr.readAsDataURL(file);
        });
    }

    function val(id) { return document.getElementById(id).value.trim(); }

    document.getElementById('listForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var errors = [];
        var owner = val('owner_name'), business = val('business_name'), catId = parseInt(val('category_id'), 10) || 0;
        var desc = val('description'), phone = VU.cleanPhone(val('phone')), whatsapp = val('whatsapp') ? VU.cleanPhone(val('whatsapp')) : '';
        var location_ = val('campus_location');

        if (owner.length < 2 || owner.length > 80) { errors.push('Enter the owner name (2 to 80 characters).'); }
        if (business.length < 2 || business.length > 80) { errors.push('Enter the business name (2 to 80 characters).'); }
        if (!VU.catName(catId)) { errors.push('Choose a category.'); }
        if (desc.length < 20 || desc.length > 500) { errors.push('Describe your business in 20 to 500 characters.'); }
        if (!VU.validPhone(phone)) { errors.push('Enter a valid phone number, for example 0700000000.'); }
        if (whatsapp && !VU.validPhone(whatsapp)) { errors.push('The WhatsApp number is not valid. Leave it empty to use your phone number.'); }
        if (location_.length < 2 || location_.length > 100) { errors.push('Say where on campus buyers can find you.'); }
        if (!document.getElementById('agree').checked) { errors.push('Tick the box to confirm you follow the listing rules.'); }

        var d = VU.load();
        if (!errors.length && d.sellers.some(function (s) { return s.business_name.toLowerCase() === business.toLowerCase() && s.status !== 'rejected'; })) {
            errors.push('A business with this name is already listed. Each business can have one listing.');
        }

        var products = [];
        for (var i = 0; i < 6; i++) {
            var pn = val('pname' + i), pp = val('pprice' + i);
            if (!pn && !pp) { continue; }
            if (!pn || pn.length > 80) { errors.push('Product ' + (i + 1) + ': enter a product name (up to 80 characters).'); continue; }
            if (!/^\d+$/.test(pp) || parseInt(pp, 10) < 1 || parseInt(pp, 10) > 100000000) { errors.push('Product ' + (i + 1) + ': enter a fixed price in UGX using numbers only.'); continue; }
            products.push({ index: i, name: pn, price: parseInt(pp, 10) });
        }
        if (!products.length) { errors.push('Add at least one product with a name and a fixed price in UGX.'); }

        var box = document.getElementById('listErrors');
        VU.showErrors(box, errors);
        if (errors.length) { box.scrollIntoView(); return; }

        var btn = document.getElementById('submitBtn');
        btn.disabled = true; btn.textContent = 'Saving...';

        var logoFile = document.getElementById('logo').files[0] || null;
        Promise.all([readImage(logoFile, 500)].concat(products.map(function (p) {
            return readImage(document.getElementById('pphoto' + p.index).files[0] || null, 600);
        }))).then(function (imgs) {
            var fresh = VU.load();
            var seller = {
                id: VU.nextId(fresh.sellers), owner_name: owner, business_name: business, category_id: catId, description: desc,
                logo: imgs[0], phone: phone, whatsapp: whatsapp, campus_location: location_, status: 'pending',
                created_at: new Date().toISOString(),
                products: products.map(function (p, k) { return { name: p.name, price: p.price, photo: imgs[k + 1] }; })
            };
            fresh.sellers.push(seller);
            if (!VU.save(fresh)) { throw new Error('storage'); }
            sessionStorage.setItem('vu_listed', '1');
            location.href = 'thank-you.html';
        }).catch(function (err) {
            btn.disabled = false; btn.textContent = 'Submit my listing';
            VU.showErrors(box, [err && err.message === 'storage'
                ? 'The browser storage is full. Use smaller photos or remove some old test listings.'
                : 'Each photo must be a JPG, PNG or WebP image under 3 MB.']);
            box.scrollIntoView();
        });
    });
})();
