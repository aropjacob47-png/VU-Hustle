// Directory page: search, category filter and page numbers.
(function () {
    var d = VU.load();
    var perPage = VU.CONFIG.CARDS_PER_PAGE;
    var q = VU.param('q').trim();
    var cat = parseInt(VU.param('category'), 10) || 0;
    var page = Math.max(1, parseInt(VU.param('page'), 10) || 1);

    var sel = document.getElementById('category');
    VU.CATEGORIES.forEach(function (c) {
        var o = document.createElement('option');
        o.value = c.id; o.textContent = c.name; sel.appendChild(o);
    });
    sel.value = String(cat);
    document.getElementById('q').value = q;

    var catName = cat ? VU.catName(cat) : '';
    if (catName) {
        document.getElementById('dirTitle').textContent = catName;
        document.getElementById('dirIntro').textContent = 'Student businesses in ' + catName + ' at Victoria University Uganda.';
        document.title = catName + ' | VU Hustle';
        VU.setCrumbs([['Home', 'index.html'], ['Directory', 'directory.html'], [catName, null]]);
    }

    var list = d.sellers.filter(function (s) { return s.status === 'approved'; });
    if (cat) { list = list.filter(function (s) { return s.category_id === cat; }); }
    if (q) {
        var ql = q.toLowerCase();
        list = list.filter(function (s) {
            var hay = [s.business_name, s.description, VU.catName(s.category_id)].concat(s.products.map(function (p) { return p.name; })).join(' ').toLowerCase();
            return hay.indexOf(ql) > -1;
        });
    }
    list.sort(function (a, b) { return b.created_at.localeCompare(a.created_at); });

    var total = list.length;
    var pages = Math.max(1, Math.ceil(total / perPage));
    page = Math.min(page, pages);
    var shown = list.slice((page - 1) * perPage, page * perPage);

    var box = document.getElementById('results');
    if (shown.length) {
        box.innerHTML = '<p class="small muted">' + total + (total === 1 ? ' seller' : ' sellers') + ' found</p><div class="grid">' +
            shown.map(function (s) { return VU.card(s, d); }).join('') + '</div>';
    } else {
        box.innerHTML = '<div class="alert alert-ok" role="status"><strong>No results found.</strong> Try a different word or clear the filters.</div>' +
            '<a class="btn btn-primary" href="directory.html">Clear filters</a>';
    }

    var pager = document.getElementById('pager');
    if (pages > 1) {
        var html = '';
        for (var n = 1; n <= pages; n++) {
            if (n === page) { html += '<span class="current" aria-current="page">' + n + '</span>'; }
            else {
                var args = ['page=' + n];
                if (q) { args.push('q=' + encodeURIComponent(q)); }
                if (cat) { args.push('category=' + cat); }
                html += '<a href="directory.html?' + args.join('&') + '">' + n + '</a>';
            }
        }
        pager.innerHTML = html;
    }
})();
