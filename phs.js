let phsData = [];

function generatePHSData() {
    // data PHS diambil dari JSON (bukan random lagi)
    phsData = DATA.phs.map(r => ({
        id: '#' + r['ID PHS'], bp: r.BP, dsr: r.DSR, cust: r.Customer, product: r.Product,
        cogs: r['COGS (Rp/L)'], std: r['Harga Std (Rp/L)'],
        support: r['Harga Support (Rp/L)'], margin: r['Margin (%)'] * 100, discount: r['Diskon (%)'] * 100,
        status: r.Status, volume: r['Volume (L)']
    }));
}

function renderPhsTable() {
    const tbody = document.getElementById('phsTableBody');
    tbody.innerHTML = '';

    const filterBp = document.getElementById('bpFilterPhs').value;
    const filterDsr = document.getElementById('dsrFilterPhs').value;
    const searchCust = document.getElementById('custFilterPhs').value.toLowerCase();
    const role = document.getElementById('roleSwitcher').value;

    let pendingCount = 0; let rejectedCount = 0; let totalCount = 0;

    phsData.forEach((item, index) => {
        if (filterBp !== 'ALL' && item.bp !== filterBp) return;
        if (filterDsr !== 'ALL' && item.dsr !== filterDsr) return;
        if (searchCust && !item.cust.toLowerCase().includes(searchCust)) return;

        totalCount++;
        if (item.status === 'PENDING') pendingCount++;
        if (item.status === 'REJECTED') rejectedCount++;

        let badgeClass = item.status === 'APPROVED' ? 'bg-green-100 text-green-700 border-green-200' :
            (item.status === 'REJECTED' ? 'bg-red-100 text-red-700 border-red-200' : 'bg-amber-100 text-amber-700 border-amber-200');

        let marginBadgeClass = item.margin >= 10 ? 'bg-green-100 text-green-700 border-green-300' :
            (item.margin >= 5 ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-red-100 text-red-700 border-red-300');

        let btnHtml = '';
        if (role === 'MGT') {
            btnHtml = `<button onclick="openSimulator(${index})" class="bg-blue-50 text-brand-blue px-3 py-1 rounded shadow-sm border border-blue-200 hover:bg-brand-blue hover:text-white transition-colors text-xs font-bold"><i class="fa-solid fa-calculator"></i> Simulasikan</button>`;
        } else {
            if (item.status === 'REJECTED') {
                btnHtml = `<button onclick="openSimulator(${index})" class="bg-amber-50 text-amber-600 px-3 py-1 rounded shadow-sm border border-amber-200 hover:bg-amber-500 hover:text-white transition-colors text-xs font-bold"><i class="fa-solid fa-pen"></i> Revisi</button>`;
            } else {
                btnHtml = `<button onclick="openSimulator(${index}, true)" class="bg-slate-100 text-slate-500 px-3 py-1 rounded shadow-sm border border-slate-200 hover:bg-slate-200 transition-colors text-xs font-bold"><i class="fa-solid fa-eye"></i> View</button>`;
            }
        }

        const tr = document.createElement('tr');
        tr.className = `hover:bg-slate-50 transition-colors ${item.status === 'REJECTED' ? 'bg-red-50/30' : ''}`;
        tr.innerHTML = `
            <td class="px-4 py-3 font-bold text-brand-blue font-mono text-xs">${esc(item.id)}</td>
            <td class="px-4 py-3"><span class="text-[9px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-bold mr-1 block w-max mb-1">${esc(item.bp)}</span><span class="text-xs font-medium text-slate-600">${esc(item.dsr)}</span></td>
            <td class="px-4 py-3 font-bold text-slate-800 text-xs whitespace-normal w-48">${esc(item.cust)}<span class="block text-[10px] font-medium text-slate-400">${esc(item.product)}</span></td>
            <td class="px-4 py-3 text-right font-bold text-slate-700">Rp ${item.support.toLocaleString('id-ID', { maximumFractionDigits: 0 })}</td>
            <td class="px-4 py-3 text-center"><span class="${marginBadgeClass} px-2 py-0.5 rounded-full text-[10px] font-black w-12 inline-block border">${item.margin.toFixed(1)}%</span></td>
            <td class="px-4 py-3 text-center"><span class="${badgeClass} px-2 py-1 rounded-full text-[9px] font-bold tracking-wider border shadow-sm">${item.status}</span></td>
            <td class="px-4 py-3 text-center">${btnHtml}</td>
        `;
        tbody.appendChild(tr);
    });

    document.getElementById('kpi-phs-total').innerText = totalCount;
    document.getElementById('kpi-phs-pending').innerText = pendingCount;
    document.getElementById('kpi-phs-rejected').innerText = rejectedCount;
}

function filterPhs() { renderPhsTable(); }

let currentPhsIndex = null;

function openSimulator(index, isViewOnly = false) {
    currentPhsIndex = index;
    const item = phsData[index];
    const role = document.getElementById('roleSwitcher').value;

    document.getElementById('simOverlay').classList.add('hidden');
    const idEl = document.getElementById('sim-phs-id');
    idEl.innerText = item.id; idEl.title = item.product;

    // COGS & harga standar per produk (bukan angka tetap)
    const baseEls = document.querySelectorAll('#simulatorContent .bg-slate-800 .font-mono');
    if (baseEls[0]) baseEls[0].innerText = 'Rp ' + item.cogs.toLocaleString('id-ID');
    if (baseEls[1]) baseEls[1].innerText = 'Rp ' + item.std.toLocaleString('id-ID');

    const sDisc = document.getElementById('discountSlider');
    const sVol = document.getElementById('volumeSlider');
    const btnAction = document.getElementById('simActionBtn');

    sVol.max = Math.max(5000, Math.ceil(item.volume * 1.5 / 100) * 100);
    sVol.step = 10;
    sDisc.value = item.discount;
    sVol.value = item.volume;

    if (isViewOnly) {
        sDisc.disabled = true; sVol.disabled = true;
        btnAction.disabled = true;
        btnAction.className = "w-full bg-slate-800 text-slate-500 font-bold py-3 rounded-lg text-sm cursor-not-allowed border border-slate-700";
        btnAction.innerHTML = "View Only";
    } else {
        sDisc.disabled = false; sVol.disabled = false;
        btnAction.disabled = false;
        if (role === 'MGT') {
            btnAction.className = "w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all text-sm shadow-md";
            btnAction.innerHTML = '<i class="fa-solid fa-check-double mr-2"></i> Update & Approve';
            btnAction.onclick = () => { changePhsStatus('APPROVED'); };
        } else if (role === 'DSR') {
            btnAction.className = "w-full bg-brand-blue hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-all text-sm shadow-md";
            btnAction.innerHTML = '<i class="fa-solid fa-paper-plane mr-2"></i> Ajukan Ulang (Revisi)';
            btnAction.onclick = () => { changePhsStatus('PENDING'); };
        }
    }
    updateSimulator();
}

function updateSimulator() {
    if (currentPhsIndex === null) return;
    const item = phsData[currentPhsIndex];

    let disc = parseFloat(document.getElementById('discountSlider').value);
    document.getElementById('discountVal').innerText = disc.toFixed(1) + '%';
    document.getElementById('volumeVal').innerText = parseInt(document.getElementById('volumeSlider').value).toLocaleString('id-ID');

    let suppPrice = item.std * (1 - (disc / 100));
    document.getElementById('simPrice').innerText = 'Rp ' + suppPrice.toLocaleString('id-ID', { maximumFractionDigits: 0 });

    let margin = ((suppPrice - item.cogs) / suppPrice) * 100;
    let elMargin = document.getElementById('simMargin');
    let elContainer = document.getElementById('simMarginContainer');

    elMargin.innerText = margin.toFixed(2) + '%';
    elContainer.className = "inline-block px-6 py-2 rounded-lg border transition-colors";
    elMargin.className = "text-4xl font-black font-mono transition-colors";

    if (margin >= 10) {
        elContainer.classList.add('bg-emerald-900/30', 'border-emerald-700/50'); elMargin.classList.add('text-emerald-400');
    } else if (margin >= 5) {
        elContainer.classList.add('bg-yellow-900/30', 'border-yellow-700/50'); elMargin.classList.add('text-yellow-400');
    } else {
        elContainer.classList.add('bg-red-900/30', 'border-red-700/50'); elMargin.classList.add('text-red-500');
    }

    item.discount = disc;
    item.support = suppPrice;
    item.margin = margin;
    item.volume = parseInt(document.getElementById('volumeSlider').value);
}

function changePhsStatus(newStatus) {
    phsData[currentPhsIndex].status = newStatus;
    document.getElementById('simOverlay').classList.remove('hidden');
    currentPhsIndex = null;
    renderPhsTable();
}
