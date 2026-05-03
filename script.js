function calculateTax() {
    const salary = parseFloat(document.getElementById('salary').value) || 0;
    const hasHECS = document.getElementById('hasHECS').checked;
    const hasPrivateHealth = document.getElementById('privateHealth').value === 'yes';
    const isFamily = document.getElementById('household').value === 'family';

    if (salary <= 0) {
        alert("Please enter a valid annual salary.");
        return;
    }

    // 1. Resident Tax Rates FY 2025-26 (Stage 3 Cuts)
    let incomeTax = 0;
    if (salary > 190000) incomeTax = 51638 + (salary - 190000) * 0.45;
    else if (salary > 135000) incomeTax = 31288 + (salary - 135000) * 0.37;
    else if (salary > 45000) incomeTax = 4288 + (salary - 45000) * 0.30;
    else if (salary > 18200) incomeTax = (salary - 18200) * 0.16;

    // 2. Medicare Levy (Standard 2%)
    let medicareLevy = salary > 27222 ? salary * 0.02 : 0;

    // 3. Medicare Levy Surcharge (MLS)
    let mlsAmount = 0;
    if (!hasPrivateHealth) {
        const threshold = isFamily ? 202000 : 101000;
        if (salary > threshold) {
            let mlsRate = 0.01; // Tier 1
            if (salary > (isFamily ? 316000 : 158000)) mlsRate = 0.015;
            else if (salary > (isFamily ? 236000 : 118000)) mlsRate = 0.0125;
            mlsAmount = salary * mlsRate;
        }
    }

    // 4. Marginal HECS/HELP Repayment (2025-26 Logic)
    let hecsRepayment = 0;
    if (hasHECS && salary > 67000) {
        // Marginal system: approx 15% on income ABOVE the threshold
        hecsRepayment = (salary - 67000) * 0.15;
        // Cap for very high earners at 10% total income
        if (hecsRepayment > (salary * 0.10)) hecsRepayment = salary * 0.10;
    }

    const totalTaxAndLevies = incomeTax + medicareLevy + mlsAmount + hecsRepayment;
    const netPay = salary - totalTaxAndLevies;
    const superContribution = salary * 0.12;

    // UI Updates
    document.getElementById('tax-amt').innerText = `A$${Math.round(totalTaxAndLevies).toLocaleString()}`;
    document.getElementById('net-pay').innerText = `A$${Math.round(netPay).toLocaleString()}`;
    document.getElementById('super-amt').innerText = `A$${Math.round(superContribution).toLocaleString()}`;
    
    document.getElementById('results').classList.remove('hidden');
    
    // Smooth scroll to results on mobile
    if (window.innerWidth < 768) {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
}
