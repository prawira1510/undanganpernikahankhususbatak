/* ============================================= */
/* KONFIGURASI UTAMA                             */
/* ============================================= */
const CONFIG = {
    weddingDate: '2026-12-12T10:00:00',
    galleryImages: [
        'images/gallery/1.jpg',
        'images/gallery/2.jpg',
        'images/gallery/3.jpg',
        'images/gallery/4.jpg',
        'images/gallery/5.jpg',
        'images/gallery/6.jpg',
        'images/gallery/7.jpg',
        'images/gallery/8.jpg'
    ],
    googleScriptUrl: ''
};

/* ============================================= */
/* DOM REFS                                      */
/* ============================================= */
const openingScreen     = document.getElementById('openingScreen');
const openInvitationBtn = document.getElementById('openInvitationBtn');
const mainContent       = document.getElementById('mainContent');
const backgroundMusic   = document.getElementById('backgroundMusic');
const musicControl      = document.getElementById('musicControl');
const musicToggle       = document.getElementById('musicToggle');
const musicMute         = document.getElementById('musicMute');
const toast             = document.getElementById('toast');
const rsvpForm          = document.getElementById('rsvpForm');
const rsvpNotification  = document.getElementById('rsvpNotification');
const lightbox          = document.getElementById('lightbox');
const lightboxImage     = document.getElementById('lightboxImage');
const lightboxClose     = document.getElementById('lightboxClose');
const lightboxPrev      = document.getElementById('lightboxPrev');
const lightboxNext      = document.getElementById('lightboxNext');
const countdownFinished = document.getElementById('countdownFinished');
const ucapanList        = document.getElementById('ucapanList');
const ucapanEmpty       = document.getElementById('ucapanEmpty');
const bottomNav         = document.getElementById('bottomNav');
const navLinks          = document.querySelectorAll('.nav-link');
const bottomNavLinks    = document.querySelectorAll('.bottom-nav-link');

let currentGalleryIndex = 0;
let isMusicPlaying = false;
let countdownInterval = null;

/* ============================================= */
/* OPENING SCREEN                                */
/* ============================================= */
openInvitationBtn.addEventListener('click', () => {
    openingScreen.classList.add('fade-out');

    setTimeout(() => {
        openingScreen.style.display = 'none';
        mainContent.classList.remove('hidden');
        musicControl.classList.remove('hidden');

        if (window.innerWidth <= 992) {
            bottomNav.classList.remove('hidden');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        playMusic();
        startCountdown();
        initScrollAnimations();
    }, 800);
});

/* ============================================= */
/* MUSIC                                         */
/* ============================================= */
function playMusic() {
    backgroundMusic.volume = 0.3;
    const p = backgroundMusic.play();
    if (p !== undefined) {
        p.then(() => {
            isMusicPlaying = true;
            musicToggle.textContent = '⏸';
        }).catch(() => {
            isMusicPlaying = false;
            musicToggle.textContent = '▶';
        });
    }
}

musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        backgroundMusic.pause();
        musicToggle.textContent = '▶';
        isMusicPlaying = false;
    } else {
        backgroundMusic.play().then(() => {
            musicToggle.textContent = '⏸';
            isMusicPlaying = true;
        }).catch(() => showToast('Tidak dapat memutar musik'));
    }
});

musicMute.addEventListener('click', () => {
    backgroundMusic.muted = !backgroundMusic.muted;
    musicMute.textContent = backgroundMusic.muted ? '🔇' : '🔊';
});

/* ============================================= */
/* SMOOTH SCROLL                                 */
/* ============================================= */
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 60;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

bottomNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 20;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            bottomNavLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

/* ============================================= */
/* ACTIVE STATE ON SCROLL                        */
/* ============================================= */
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    if (!bottomNav.classList.contains('hidden')) {
        bottomNavLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
});

/* ============================================= */
/* RESIZE HANDLER                                */
/* ============================================= */
window.addEventListener('resize', () => {
    if (mainContent.classList.contains('hidden')) return;
    if (window.innerWidth > 992) {
        bottomNav.classList.add('hidden');
    } else {
        bottomNav.classList.remove('hidden');
    }
});

/* ============================================= */
/* COUNTDOWN                                     */
/* ============================================= */
function startCountdown() {
    const targetDate = new Date(CONFIG.weddingDate).getTime();

    function update() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            countdownFinished.classList.remove('hidden');
            if (countdownInterval) clearInterval(countdownInterval);
            return;
        }

        const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent    = String(days).padStart(2, '0');
        document.getElementById('hours').textContent   = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    update();
    countdownInterval = setInterval(update, 1000);
}

/* ============================================= */
/* GALERI LIGHTBOX                               */
/* ============================================= */
document.querySelectorAll('.galeri-item').forEach((item, index) => {
    item.addEventListener('click', () => {
        currentGalleryIndex = index;
        openLightbox(index);
    });
});

function openLightbox(index) {
    lightboxImage.src = CONFIG.galleryImages[index];
    lightboxImage.alt = `Momen ${index + 1}`;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex - 1 + CONFIG.galleryImages.length) % CONFIG.galleryImages.length;
    lightboxImage.src = CONFIG.galleryImages[currentGalleryIndex];
});

lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    currentGalleryIndex = (currentGalleryIndex + 1) % CONFIG.galleryImages.length;
    lightboxImage.src = CONFIG.galleryImages[currentGalleryIndex];
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('hidden')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') {
            currentGalleryIndex = (currentGalleryIndex - 1 + CONFIG.galleryImages.length) % CONFIG.galleryImages.length;
            lightboxImage.src = CONFIG.galleryImages[currentGalleryIndex];
        }
        if (e.key === 'ArrowRight') {
            currentGalleryIndex = (currentGalleryIndex + 1) % CONFIG.galleryImages.length;
            lightboxImage.src = CONFIG.galleryImages[currentGalleryIndex];
        }
    }
});

/* ============================================= */
/* UCAPAN - STORAGE                              */
/* ============================================= */
const STORAGE_KEY = 'ucapanTamu_v1';

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getSavedUcapan() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
}

function saveUcapan(data) {
    const saved = getSavedUcapan();
    saved.push(data);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(saved)); }
    catch (err) { console.warn('Gagal simpan:', err); }
}

function renderUcapan(data, prepend = false) {
    const card = document.createElement('article');
    card.className = 'ucapan-card';

    const waktu = data.timestamp
        ? new Date(data.timestamp).toLocaleString('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
          })
        : '';

    card.innerHTML = `
        <p class="ucapan-text">"${escapeHtml(data.message)}"</p>
        <p class="ucapan-author">— ${escapeHtml(data.name)}</p>
        ${waktu ? `<p class="ucapan-time">${waktu}</p>` : ''}
    `;

    if (prepend && ucapanList.firstChild) {
        ucapanList.insertBefore(card, ucapanList.firstChild);
    } else {
        ucapanList.appendChild(card);
    }

    if (ucapanEmpty) ucapanEmpty.classList.add('hidden');
}

function loadAllUcapan() {
    const saved = getSavedUcapan();
    saved.forEach(item => renderUcapan(item));
}

async function sendToGoogleSheets(data) {
    if (!CONFIG.googleScriptUrl) return;
    try {
        await fetch(CONFIG.googleScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    } catch (err) { console.warn('Gagal kirim ke Sheets:', err); }
}

/* ============================================= */
/* RSVP FORM                                     */
/* ============================================= */
rsvpForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name       = document.getElementById('rsvpName').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked');
    const guests     = document.getElementById('rsvpGuests').value;
    const message    = document.getElementById('rsvpMessage').value.trim();

    if (!name || !attendance || !message) {
        showToast('Mohon lengkapi semua data');
        return;
    }

    const rsvpData = {
        name,
        attendance: attendance.value,
        guests: parseInt(guests, 10) || 1,
        message,
        timestamp: new Date().toISOString()
    };

    saveUcapan(rsvpData);
    renderUcapan(rsvpData, true);
    sendToGoogleSheets(rsvpData);

    rsvpNotification.classList.remove('hidden');
    rsvpForm.reset();
    setTimeout(() => rsvpNotification.classList.add('hidden'), 5000);

    showToast('Ucapan berhasil dikirim!');

    setTimeout(() => {
        const sec = document.getElementById('ucapan');
        if (sec) window.scrollTo({ top: sec.offsetTop - 20, behavior: 'smooth' });
    }, 900);

    console.log('RSVP Data:', rsvpData);
});

/* ============================================= */
/* COPY REKENING                                 */
/* ============================================= */
document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
        const text = btn.getAttribute('data-copy');
        try {
            await navigator.clipboard.writeText(text);
            showToast('Nomor rekening berhasil disalin!');
        } catch {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            try {
                document.execCommand('copy');
                showToast('Nomor rekening berhasil disalin!');
            } catch { showToast('Gagal menyalin'); }
            document.body.removeChild(ta);
        }
    });
});

/* ============================================= */
/* TOAST                                         */
/* ============================================= */
let toastTimeout = null;

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');
    void toast.offsetWidth;
    toast.classList.add('show');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2500);
}

/* ============================================= */
/* SCROLL ANIMATIONS                             */
/* ============================================= */
function initScrollAnimations() {
    const els = document.querySelectorAll(
        '.mempelai-card, .acara-card, .budaya-card, .gift-card, .love-story-item'
    );

    if (!('IntersectionObserver' in window)) {
        els.forEach(el => el.classList.add('animate-in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => {
        el.classList.add('animate-init');
        observer.observe(el);
    });
}

/* ============================================= */
/* INIT                                          */
/* ============================================= */
mainContent.classList.add('hidden');
musicControl.classList.add('hidden');
bottomNav.classList.add('hidden');

loadAllUcapan();