// Admin pages: approve or reject listings, hide or delete reviews and reports.
(function () {
    function listings() {
        var box = document.getElementById('pending');
        var d = VU.load();
        var pending = d.sellers.filter(function (s) { return s.status === 'pending'; });
        if (!pending.length) { box.innerHTML = '<p>No listings are waiting for approval.</p>'; return; }
        box.innerHTML = '<div class="table-wrap"><table><thead><tr><th>Business</th><th>Owner</th><th>Category</th><th>Contact</th><th>Location</th><th>Details</th><th>Actions</th></tr></thead><tbody>' +
            pending.map(function (s) {
                return '<tr><td><strong>' + VU.esc(s.business_name) + '</strong><br><span class="small muted">' + VU.esc(VU.fmtDate(s.created_at)) + '</span></td>' +
                    '<td>' + VU.esc(s.owner_name) + '</td><td>' + VU.esc(VU.catName(s.category_id)) + '</td>' +
                    '<td>' + VU.esc(s.phone) + (s.whatsapp ? '<br><span class="small">WhatsApp: ' + VU.esc(s.whatsapp) + '</span>' : '') + '</td>' +
                    '<td>' + VU.esc(s.campus_location) + '</td>' +
                    '<td><details><summary>View</summary><p>' + VU.br(s.description) + '</p>' +
                    (s.logo ? '<img src="' + VU.esc(s.logo) + '" alt="Logo of ' + VU.esc(s.business_name) + '" width="80" height="80" style="object-fit:cover;border-radius:8px">' : '') +
                    '<ul>' + s.products.map(function (p) { return '<li>' + VU.esc(p.name) + ', ' + VU.esc(VU.ugx(p.price)) + '</li>'; }).join('') + '</ul>' +
                    '<div class="thumbs">' + s.products.filter(function (p) { return p.photo; }).map(function (p) { return '<img src="' + VU.esc(p.photo) + '" alt="' + VU.esc(p.name) + '">'; }).join('') + '</div></details></td>' +
                    '<td><button class="btn btn-primary btn-sm" data-act="approve" data-id="' + s.id + '">Approve</button> ' +
                    '<button class="btn btn-danger btn-sm" data-act="reject" data-id="' + s.id + '">Reject</button></td></tr>';
            }).join('') + '</tbody></table></div>';
    }

    function reviews() {
        var d = VU.load();
        var name = function (id) { var s = d.sellers.filter(function (x) { return x.id === id; })[0]; return s ? s.business_name : 'Removed seller'; };
        var rb = document.getElementById('reports'), vb = document.getElementById('reviews');
        rb.innerHTML = d.reports.length ? '<div class="table-wrap"><table><thead><tr><th>Seller</th><th>Reason</th><th>Date</th><th>Actions</th></tr></thead><tbody>' +
            d.reports.slice().reverse().map(function (r) {
                return '<tr><td><a href="seller.html?id=' + r.seller_id + '">' + VU.esc(name(r.seller_id)) + '</a></td><td>' + VU.br(r.reason) + '</td><td>' + VU.esc(VU.fmtDate(r.created_at)) + '</td>' +
                    '<td><button class="btn btn-danger btn-sm" data-act="delete_report" data-id="' + r.id + '">Delete</button></td></tr>';
            }).join('') + '</tbody></table></div>' : '<p>No reports.</p>';
        vb.innerHTML = d.reviews.length ? '<div class="table-wrap"><table><thead><tr><th>Seller</th><th>Reviewer</th><th>Rating</th><th>Comment</th><th>Status</th><th>Actions</th></tr></thead><tbody>' +
            d.reviews.slice().reverse().map(function (r) {
                return '<tr><td><a href="seller.html?id=' + r.seller_id + '">' + VU.esc(name(r.seller_id)) + '</a></td>' +
                    '<td>' + VU.esc(r.reviewer_name) + '<br><span class="small muted">' + VU.esc(VU.fmtDate(r.created_at)) + '</span></td>' +
                    '<td>' + r.rating + ' out of 5</td><td>' + VU.br(r.comment) + '</td><td>' + (r.status === 'visible' ? 'Visible' : 'Hidden') + '</td>' +
                    '<td><button class="btn btn-outline btn-sm" data-act="' + (r.status === 'visible' ? 'hide' : 'show') + '" data-id="' + r.id + '">' + (r.status === 'visible' ? 'Hide' : 'Show') + '</button> ' +
                    '<button class="btn btn-danger btn-sm" data-act="delete_review" data-id="' + r.id + '">Delete</button></td></tr>';
            }).join('') + '</tbody></table></div>' : '<p>No reviews yet.</p>';
    }

    document.addEventListener('click', function (e) {
        var b = e.target.closest ? e.target.closest('[data-act]') : null;
        if (!b) { return; }
        var act = b.getAttribute('data-act'), id = parseInt(b.getAttribute('data-id'), 10);
        var d = VU.load();
        if (act === 'approve' || act === 'reject') {
            if (act === 'reject' && !window.confirm('Reject this listing?')) { return; }
            d.sellers.forEach(function (s) { if (s.id === id && s.status === 'pending') { s.status = act === 'approve' ? 'approved' : 'rejected'; } });
            VU.save(d); listings();
        } else if (act === 'hide' || act === 'show') {
            d.reviews.forEach(function (r) { if (r.id === id) { r.status = act === 'hide' ? 'hidden' : 'visible'; } });
            VU.save(d); reviews();
        } else if (act === 'delete_review') {
            if (!window.confirm('Delete this review for good?')) { return; }
            d.reviews = d.reviews.filter(function (r) { return r.id !== id; });
            VU.save(d); reviews();
        } else if (act === 'delete_report') {
            if (!window.confirm('Remove this report?')) { return; }
            d.reports = d.reports.filter(function (r) { return r.id !== id; });
            VU.save(d); reviews();
        } else if (act === 'reset') {
            if (!window.confirm('Delete all listings, reviews and messages saved in this browser and bring back the sample data?')) { return; }
            VU.resetData(); location.reload();
        }
    });

    if (document.getElementById('pending')) { listings(); }
    if (document.getElementById('reports')) { reviews(); }
})();
