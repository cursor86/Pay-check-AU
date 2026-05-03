function calculateTax() {
    const salary = parseFloat(document.getElementById('salary').value) || 0;
    const hasHECS = document.getElementById('hasHECS').checked;
    const hasPrivateHealth = document.getElementById('privateHealth').value === 'yes';
    const isFamily = document.getElementById('household').value === 'family';

    if (salary <= 0) return alert("Please enter a valid salary.");

    // 1. Resident Tax 2025-26
    let incomeTax = 0;
    if (salary > 190000) incomeTax = 51638 + (salary - 190000) * 0.45;
    else if (salary > 135000) incomeTax = 31288 + (salary - 135000) * 0.37;
    else if (salary > 45000) incomeTax = 4288 + (salary - 45000) * 0.30;
    else if (salary > 18200) incomeTax = (salary - 18200) * 0.16;

    // 2. Medicare & HECS
    let medicareLevy = salary > 27222 ? salary * 0.02 : 0;
    let hecsRepayment = (hasHECS && salary > 67000) ? (salary - 67000) * 0.15 : 0;
    
    // 3. MLS
    let mls = 0;
    if (!hasPrivateHealth && salary > (isFamily ? 202000 : 101000)) {
        mls = salary * 0.01;
    }

    const totalTax = incomeTax + medicareLevy + hecsRepayment + mls;
    
    document.getElementById('tax-amt').innerText = `A$${Math.round(totalTax).toLocaleString()}`;
    document.getElementById('net-pay').innerText = `A$${Math.round(salary - totalTax).toLocaleString()}`;
    document.getElementById('super-amt').innerText = `A$${Math.round(salary * 0.12).toLocaleString()}`;
    document.getElementById('results').classList.remove('hidden');
}

