document.addEventListener("DOMContentLoaded", () => {

    // --- 1. DARK MODE / LIGHT MODE PERSISTANT ---
    const themeToggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme");

    if (currentTheme) {
        document.documentElement.setAttribute("data-theme", currentTheme);
        if (currentTheme === "dark") {
            document.body.classList.add("dark-mode");
            if (themeToggleBtn) {
                const icon = themeToggleBtn.querySelector("i");
                if (icon) icon.className = "bi bi-sun-fill";
                else themeToggleBtn.textContent = "☀️";
            }
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");
            const isDark = document.body.classList.contains("dark-mode");
            
            document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
            localStorage.setItem("theme", isDark ? "dark" : "light");

            const icon = themeToggleBtn.querySelector("i");
            if (icon) {
                icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars";
            } else {
                themeToggleBtn.textContent = isDark ? "☀️" : "🌙";
            }
        });
    }


    // --- 2. GESTION DU MENU MOBILE ET DU HAMBURGER ---
    const hamburger = document.getElementById("hamburger-btn");
    const navLinks = document.getElementById("nav-links");

    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });

        // Fermer le menu automatiquement quand on clique sur un lien
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }


   // --- 3. ONGLETS DU PROGRAMME ---
window.showDay = function(dayNumber, clickedButton) {
    // 1. Cacher tous les contenus de jours
    const dayContents = document.querySelectorAll(".day-content");
    dayContents.forEach(content => {
        content.style.display = "none";
    });

    // 2. Afficher le jour sélectionné
    const activeDay = document.getElementById(`day${dayNumber}`);
    if (activeDay) {
        activeDay.style.display = "block";
    }

    // 3. Retirer la classe active de tous les boutons de jours
    const dayButtons = document.querySelectorAll('nav[aria-label="Navigation par jour"] button');
    dayButtons.forEach(btn => {
        btn.classList.remove("active");
    });

    // 4. Ajouter la classe active uniquement sur le bouton cliqué
    if (clickedButton) {
        clickedButton.classList.add("active");
    }
};

    // --- 4. BOUTON RETOUR EN HAUT ---
    let backToTopBtn = document.getElementById("back-to-top");
    if (!backToTopBtn) {
        backToTopBtn = document.createElement("button");
        backToTopBtn.id = "back-to-top";
        backToTopBtn.innerHTML = "↑";
        document.body.appendChild(backToTopBtn);
    }

    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = "flex";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });


    // --- 5. ANNÉE DYNAMIQUE DANS LE FOOTER ---
    const footerYears = document.querySelectorAll(".current-year");
    footerYears.forEach(el => {
        el.textContent = new Date().getFullYear();
    });

}); // FIN DU DOMCONTENTLOADED


// --- 6. COMPTE À REBOURS (Indépendant du DOM) ---
const eventDate = new Date("2026-11-15T09:00:00").getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const timeLeft = eventDate - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (timeLeft > 0) {
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    } else {
        const countdownContainer = document.getElementById("countdown");
        if (countdownContainer) {
            countdownContainer.innerHTML = "<p style='color: #38bdf8; font-size: 1.2rem; font-weight: bold; width: 100%; text-align: center;'>Le sommet a commencé !</p>";
        }
    }
}

if (document.getElementById("countdown")) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}


// --- 7. ANIMATION DES CHIFFRES (COMPTEURS) ---
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    const speed = 200;

    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        const hasPlus = counter.textContent.includes('+');
        let count = 0;

        const updateCount = () => {
            const increment = target / speed;

            if (count < target) {
                count += increment;
                let currentVal = Math.ceil(count);
                counter.textContent = (hasPlus ? '+' : '') + currentVal.toLocaleString('fr-FR');
                setTimeout(updateCount, 15);
            } else {
                counter.textContent = (hasPlus ? '+' : '') + target.toLocaleString('fr-FR');
            }
        };

        updateCount();
    });
}

const statsSection = document.getElementById('stats');
if (statsSection) {
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}