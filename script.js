window.onload = function() {
    if (!localStorage.getItem('cookiesAccepted')) {
        document.getElementById('cookie-banner').style.display = 'flex';
    }
};

function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    closeCookieBanner();
}

function closeCookieBanner() {
    document.getElementById('cookie-banner').style.display = 'none';
}

function calculate() {
    const raw = parseFloat(document.getElementById('grossInput').value);
    const type = document.getElementById('superType').value;
    const hasHelp = document.getElementById('hasHelp').checked;

    if (isNaN(raw) || raw <= 0) return;

    // 12% Super Calculation
    let taxableBase = (type === 'inclusive') ? raw / 1.12 : raw;
    let superAmount = (type === 'inclusive') ? raw - taxableBase : raw * 0.12;

    // 2025-26 Stage 3 Tax Rates
    let tax = 0;
    if (taxableBase > 190000) tax = 51638 + (taxableBase - 190000) * 0.45;
    else if (taxableBase > 135000) tax = 31288 + (taxableBase - 135000) * 0.37;
    else if (taxableBase > 45000) tax = 4288 + (taxableBase - 45000) * 0.30;
    else if (taxableBase > 18200) tax = (taxableBase - 18200) * 0.16;

    // Medicare Levy with Phase-in ($27,222-$34,027)
    let medicare = 0;
    if (taxableBase >= 34027) medicare = taxableBase * 0.02;
    else if (taxableBase > 27222) medicare = (taxableBase - 27222) * 0.10;

    // New 2025-26 Marginal HELP Repayment
    let help = 0;
    if (hasHelp) {
        if (taxableBase >= 179286) {
            help = taxableBase * 0.10;
        } else if (taxableBase > 125000) {
            help = 8700 + (taxableBase - 125000) * 0.17;
        } else if (taxableBase > 67000) {
            help = (taxableBase - 67000) * 0.15;
        }
    }

    const net = taxableBase - tax - medicare - help;

    // Update UI
    document.getElementById('resTaxable').innerText = "$" + Math.round(taxableBase).toLocaleString();
    document.getElementById('resSuper').innerText = "$" + Math.round(superAmount).toLocaleString();
    document.getElementById('resTax').innerText = "-$" + Math.round(tax).toLocaleString();
    document.getElementById('resMedicare').innerText = "-$" + Math.round(medicare).toLocaleString();
    document.getElementById('resNet').innerText = "$" + Math.round(net).toLocaleString();
    
    if (help > 0) {
        document.getElementById('helpRow').style.display = 'table-row';
        document.getElementById('resHelp').innerText = "-$" + Math.round(help).toLocaleString();
    } else {
        document.getElementById('helpRow').style.display = 'none';
    }

    document.getElementById('results').style.display = 'block';
    document.getElementById('pdfBtn').style.display = 'block';
}

function toggleModal(type) {
    document.getElementById('modal-overlay').style.display = 'flex';
    document.getElementById('privacy').style.display = (type === 'privacy') ? 'block' : 'none';
    document.getElementById('terms').style.display = (type === 'terms') ? 'block' : 'none';
}

function closeModals() {
    document.getElementById('modal-overlay').style.display = 'none';
}

function downloadReport() {
    const opt = { margin: 10, filename: 'Salary_Report.pdf', html2canvas: { scale: 2 } };
    html2pdf().set(opt).from(document.getElementById('results')).save();
}
