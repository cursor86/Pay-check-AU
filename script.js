/**
 * SS Traders Logic Engine
 * 1. Page Routing
 * 2. Audio-Assist (Accessibility)
 * 3. Cookie Compliance (AdSense Req)
 */

// 1. Navigation Controller
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-content');
    pages.forEach(page => page.classList.remove('active'));
    
    // Show selected page
    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 2. Audio-Assist "Read for Me" (Speech Synthesis)
function readArticle() {
    // Check if voice is already speaking to toggle off
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        return;
    }

    const articleText = document.getElementById('main-article').innerText;
    const utterance = new SpeechSynthesisUtterance(articleText);
    
    // Customizing the voice
    utterance.lang = 'en-AU'; // Australian English
    utterance.rate = 0.9;      // Slightly slower for clarity
    utterance.pitch = 1.0;

    window.speechSynthesis.speak(utterance);
}

// 3. Cookie Consent Management
function acceptCookies() {
    localStorage.setItem('ss_cookies_accepted', 'true');
    document.getElementById('cookie-banner').style.display = 'none';
}

// Run on page load
window.onload = function() {
    // Check for cookie consent
    if (!localStorage.getItem('ss_cookies_accepted')) {
        document.getElementById('cookie-banner').style.display = 'flex';
    }
    
    // Smooth scroll for footer links
    document.querySelectorAll('footer li').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.getAttribute('data-page');
            if (page) showPage(page);
        });
    });
};
