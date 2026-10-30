// data.js : memuat data JSON + helper bersama. WAJIB dipanggil PERTAMA di index.html
const DATA_URL = 'data_anon.json';   // ganti ke 'data.json' kalau repo private / pakai nama asli
let DATA = null;
let PERSONA = { bp: 'CPA 01', dsr: '' };   // dipakai saat role = DSR

const fmt = n => Math.round(+n || 0).toLocaleString('id-ID');
const sumBy = (a, f) => a.reduce((t, x) => t + (+f(x) || 0), 0);
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function dsrOfCustomer() {
    const m = {};
    DATA.orders.forEach(r => { if (!m[r.Customer]) m[r.Customer] = r.DSR; });
    return m;
}

function setOpts(id, values, allLabel) {
    const sel = document.getElementById(id);
    if (!sel) return;
    sel.innerHTML = '<option value="ALL">' + allLabel + '</option>' +
        values.map(v => '<option value="' + esc(v) + '">' + esc(v) + '</option>').join('');
}

function loadData() {
    return fetch(DATA_URL).then(r => {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    }).then(d => {
        DATA = d;
        const map = dsrOfCustomer();
        // pilih DSR "persona" = pasangan BP+DSR dengan baris forecast & PHS terbanyak
        const cnt = {};
        DATA.forecast.forEach(r => { const k = r.BP + '|' + (map[r.Customer] || ''); cnt[k] = (cnt[k] || 0) + 1; });
        DATA.phs.forEach(r => { const k = r.BP + '|' + r.DSR; if (cnt[k]) cnt[k] += 1; });
        const best = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a])[0];
        if (best) { const p = best.split('|'); PERSONA = { bp: p[0], dsr: p[1] }; }
        // dropdown
        const bps = [...new Set(DATA.orders.map(r => r.BP))].sort();
        const dsrs = [...new Set(DATA.orders.map(r => r.DSR).concat(DATA.dsr_target.map(r => r['Salesman (DSR)'])))].sort();
        setOpts('bpFilterSales', bps, 'ALL BP (Nasional)');
        setOpts('bpFilterForecast', bps, 'ALL BP');
        setOpts('bpFilterPhs', bps, 'ALL BP');
        setOpts('dsrFilterForecast', dsrs, 'Semua DSR');
        setOpts('dsrFilterPhs', dsrs, 'Semua DSR');
        // label periode
        const per = (DATA.params['Periode Sales'] || '').split(' ');
        const sel = document.querySelectorAll('#tab-sales header select');
        if (sel[1] && per[0]) sel[1].innerHTML = '<option>' + per[0] + '</option>';
        if (sel[2] && per[1]) sel[2].innerHTML = '<option>' + per[1] + '</option>';
        const fsel = document.querySelector('#tab-forecast header select');
        if (fsel && DATA.params['Periode Forecast']) fsel.innerHTML = '<option>' + DATA.params['Periode Forecast'] + '</option>';
        return DATA;
    });
}
