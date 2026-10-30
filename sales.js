function renderSalesTables() {
    const tabs = document.querySelectorAll('#tab-sales table');
    const bps = [...new Set(DATA.dsr_target.map(r => r.BP))].sort();
    let html = '';
    bps.forEach(bp => {
        DATA.dsr_target.filter(r => r.BP === bp)
            .sort((a, b) => b['Volume Target (L)'] - a['Volume Target (L)']).slice(0, 6).forEach(r => {
                const p = r['% Ach. Volume'] * 100, pp = r['% Ach. Premium'] * 100;
                const seg = r.Segmen === 'Smelter'
                    ? '<span class="bg-slate-800 text-white text-[10px] px-2 py-1 rounded-md uppercase shadow-sm">Smelter</span>'
                    : '<span class="bg-slate-100 text-slate-500 text-[10px] px-2 py-1 rounded-md uppercase border border-slate-200">Non Smelter</span>';
                const premTxt = r['Premium Actual (L)'] ? fmt(r['Premium Actual (L)']) : '-';
                html += '<tr class="hover:bg-slate-50/50 sales-row" data-bp="' + esc(bp) + '">' +
                    '<td class="px-4 py-4 text-slate-800">' + esc(r['Salesman (DSR)']) + '</td>' +
                    '<td class="px-4 py-4"><span class="text-[10px] font-bold text-brand-blue mr-1 bg-blue-50 px-2 py-1 rounded border border-blue-100">' + esc(bp) + '</span>' + seg + '</td>' +
                    '<td class="px-4 py-4 align-middle"><div class="flex justify-between text-xs mb-1.5"><span class="text-brand-blue font-bold">' + p.toFixed(1) + '%</span><span class="text-slate-400 font-medium text-[10px]">' + fmt(r['Volume Actual (L)']) + ' / ' + fmt(r['Volume Target (L)']) + '</span></div><div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-brand-blue h-1.5 rounded-full" style="width:' + Math.min(p, 100) + '%"></div></div></td>' +
                    '<td class="px-4 py-4 align-middle"><div class="flex justify-between text-xs mb-1.5"><span class="' + (pp >= 100 ? 'text-emerald-500' : 'text-slate-800') + ' font-bold">' + pp.toFixed(1) + '%</span><span class="text-slate-400 font-medium text-[10px]">' + premTxt + ' / ' + fmt(r['Premium Target (L)']) + '</span></div><div class="w-full bg-slate-100 rounded-full h-1.5"><div class="bg-emerald-500 h-1.5 rounded-full" style="width:' + Math.min(pp, 100) + '%"></div></div></td></tr>';
            });
    });
    if (tabs[0]) tabs[0].querySelector('tbody').innerHTML = html;

    html = '';
    bps.forEach(bp => {
        DATA.orders.filter(r => r.BP === bp && ['OS Delivery', 'OS Invoice'].includes(r['Status Order']))
            .sort((a, b) => b['Umur (hari)'] - a['Umur (hari)']).slice(0, 4).forEach(r => {
                const badge = r['Status Order'] === 'OS Invoice' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-blue-100 text-blue-700 border-blue-200';
                html += '<tr class="hover:bg-slate-50 sales-row" data-bp="' + esc(bp) + '">' +
                    '<td class="px-4 py-4 text-xs font-bold text-brand-blue">' + esc(bp) + '</td>' +
                    '<td class="px-6 py-4 font-bold text-brand-navy">' + esc(r.Customer) + '</td>' +
                    '<td class="px-6 py-4 text-xs">' + esc(r.DSR) + '</td>' +
                    '<td class="px-6 py-4 text-xs text-slate-500">PO: ' + esc(r['No PO / SO']) + '</td>' +
                    '<td class="px-6 py-4 text-right font-bold text-brand-navy">' + fmt(r['Volume (L)']) + '</td>' +
                    '<td class="px-6 py-4 text-center"><span class="' + badge + ' border px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider">' + esc(r['Status Order']) + '</span></td></tr>';
            });
    });
    if (tabs[1]) tabs[1].querySelector('tbody').innerHTML = html;
}

function salesKpi(bp) {
    const o = DATA.orders.filter(r => bp === 'ALL' || r.BP === bp);
    const by = s => sumBy(o.filter(r => r['Status Order'] === s), r => r['Volume (L)']);
    document.getElementById('kpi-po').innerText = fmt(sumBy(o, r => r['Volume (L)'])) + ' L';
    document.getElementById('kpi-deliv').innerText = fmt(by('OS Delivery')) + ' L';
    document.getElementById('kpi-inv').innerText = fmt(by('OS Invoice')) + ' L';
    document.getElementById('kpi-done').innerText = fmt(by('Delivered')) + ' L';
    [['Smelter', 'kpi-smelter-pct', 'kpi-smelter-val', 'Actual bulan lalu - Smelter (L)'],
     ['Non Smelter', 'kpi-ns-pct', 'kpi-ns-val', 'Actual bulan lalu - Non Smelter (L)']].forEach(function (c) {
        const act = sumBy(o.filter(r => r.Segmen === c[0] && ['Delivered', 'OS Invoice'].includes(r['Status Order'])), r => r['Volume (L)']);
        const tgt = sumBy(DATA.dsr_target.filter(r => r.Segmen === c[0] && (bp === 'ALL' || r.BP === bp)), r => r['Volume Target (L)']);
        document.getElementById(c[1]).innerText = (tgt ? act / tgt * 100 : 0).toFixed(1) + '%';
        document.getElementById(c[2]).innerText = fmt(act) + ' / ' + fmt(tgt) + ' L';
        const g = document.getElementById(c[1]).nextElementSibling, last = DATA.params[c[3]];
        if (g) {
            if (bp === 'ALL' && last) {
                const v = act / last - 1;
                g.innerText = 'Growth: ' + (v >= 0 ? '▲ +' : '▼ ') + (v * 100).toFixed(1) + '%';
                g.className = 'text-xs font-bold ' + (v >= 0 ? 'text-brand-green' : 'text-brand-red');
            } else { g.innerText = 'Growth: -'; g.className = 'text-xs font-bold text-slate-400'; }
        }
    });
}

function filterSalesDashboard() {
    const role = document.getElementById('roleSwitcher').value;
    let selectedBP = document.getElementById('bpFilterSales').value;
    if (role === 'DSR') {
        selectedBP = PERSONA.bp;
        document.getElementById('bpFilterSales').value = PERSONA.bp;
        document.getElementById('bpFilterSales').disabled = true;
    } else {
        document.getElementById('bpFilterSales').disabled = false;
    }
    salesKpi(selectedBP);
    document.querySelectorAll('.sales-row').forEach(row => {
        if (selectedBP === "ALL" || row.getAttribute('data-bp') === selectedBP) row.classList.remove('hidden-row');
        else row.classList.add('hidden-row');
    });
    trackOrder();
}

/* ---------- Order tracking (data-driven) ---------- */
const FLOW = ['Order Received', 'Stock Allocated', 'OS Delivery', 'OS Invoice', 'Delivered'];
const NODE_ICON = ['fa-solid fa-check', 'fa-solid fa-check', 'fa-solid fa-truck-ramp-box', 'fa-solid fa-file-invoice-dollar', 'fa-regular fa-circle-check'];
const CLS_DONE = "w-10 h-10 rounded-full bg-emerald-100 text-emerald-500 border border-emerald-200 flex items-center justify-center shadow-sm transition-all duration-300";
const CLS_FUT = "w-10 h-10 rounded-full bg-slate-50 text-slate-400 border border-slate-200 flex items-center justify-center shadow-sm transition-all duration-300";
const CLS_CUR = {
    red: "w-12 h-12 -mt-1 rounded-full bg-white text-red-600 border-2 border-red-400 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)] relative z-20 transition-all duration-300 animate-pulse",
    orange: "w-12 h-12 -mt-1 rounded-full bg-white text-orange-500 border-2 border-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.5)] relative z-20 transition-all duration-300 animate-pulse",
    blue: "w-12 h-12 -mt-1 rounded-full bg-white text-blue-600 border-2 border-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(2,132,199,0.5)] relative z-20 transition-all duration-300 animate-pulse"
};
const BADGE = {
    red: ["bg-red-50 text-red-600 border-red-100", "bg-red-400", "bg-red-500"],
    orange: ["bg-orange-50 text-orange-600 border-orange-200", "bg-orange-400", "bg-orange-500"],
    blue: ["bg-blue-50 text-brand-blue border-blue-200", "bg-blue-400", "bg-brand-blue"],
    green: ["bg-emerald-50 text-emerald-600 border-emerald-200", "bg-emerald-400", "bg-emerald-500"],
    gray: ["bg-slate-100 text-slate-500 border-slate-200", "bg-slate-300", "bg-slate-400"]
};

function setBadge(color, text) {
    const b = BADGE[color], el = document.getElementById('alertBadge');
    el.className = b[0] + " text-xs font-bold px-3 py-1.5 rounded flex items-center gap-2 border transition-colors";
    el.innerHTML = '<span class="relative flex h-2 w-2"><span class="animate-ping absolute inline-flex h-full w-full rounded-full ' + b[1] + ' opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 ' + b[2] + '"></span></span><span id="alertText">' + esc(text) + '</span>';
}

function drawPipeline(idx, color) {
    for (let i = 0; i < 5; i++) {
        const n = document.getElementById('node-' + (i + 1));
        if (idx === null || i > idx) { n.className = CLS_FUT; n.innerHTML = '<i class="' + NODE_ICON[i] + '"></i>'; }
        else if (i < idx || idx === 4) { n.className = CLS_DONE; n.innerHTML = '<i class="fa-solid fa-check"></i>'; }
        else { n.className = CLS_CUR[color]; n.innerHTML = '<i class="' + NODE_ICON[i] + ' text-lg"></i>'; }
    }
    for (let k = 1; k <= 4; k++) {
        document.getElementById('line-' + k).className = "w-1/4 transition-colors duration-300 " + ((idx !== null && idx >= k) ? "bg-emerald-300" : "bg-slate-200");
    }
}

function trackOrder() {
    if (!DATA) return;
    const q = document.getElementById('orderSearch').value.trim().toLowerCase();
    const sub3 = document.getElementById('subtext-node-3'), sub4 = document.getElementById('subtext-node-4');
    sub3.classList.add('hidden'); sub4.classList.add('hidden');
    const thr = DATA.params['Batas bottleneck OS Delivery (hari)'] || 3;

    if (!q) {   // default: alert bottleneck seluruh BP yang sedang dipilih
        const bp = document.getElementById('bpFilterSales').value;
        const n = DATA.orders.filter(r => (bp === 'ALL' || r.BP === bp) && r['Status Order'] === 'OS Delivery' && r['Umur (hari)'] > thr).length;
        drawPipeline(2, 'red');
        sub3.innerText = n + ' Order > ' + thr + ' Hari'; sub3.classList.remove('hidden');
        setBadge('red', 'Live Bottleneck Alert');
        return;
    }
    const o = DATA.orders.find(r => String(r['No PO / SO']).toLowerCase().includes(q) || String(r.Customer).toLowerCase().includes(q));
    if (!o) { drawPipeline(null); setBadge('gray', 'PO tidak ditemukan'); return; }
    const idx = FLOW.indexOf(o['Status Order']);
    const color = idx === 2 ? (o['Umur (hari)'] > thr ? 'red' : 'blue') : (idx === 3 ? 'orange' : 'blue');
    drawPipeline(idx, color);
    if (idx === 2) { sub3.innerText = o['Umur (hari)'] + ' hari di gudang'; sub3.classList.remove('hidden'); }
    if (idx === 3) { sub4.classList.remove('hidden'); }
    setBadge(idx === 4 ? 'green' : color, 'Tracking ' + o['No PO / SO'] + ': ' + o['Status Order']);
}
