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
// --- 8. FILTRAGE DYNAMIQUE AVEC ANIMATION ---
const filterButtons = document.querySelectorAll('.filter-btn');
const speakerCards = document.querySelectorAll('.speaker-card');

if (filterButtons.length > 0 && speakerCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Activer le bouton cliqué
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            speakerCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    // Réactiver la visibilité si l'animation était appliquée
                    card.classList.add('active-zoom');
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}
// --- 9. VALIDATION DU FORMULAIRE DE CONTACT / INSCRIPTION ---
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Empêche l'envoi par défaut

        // Récupération des champs
        const fullname = document.getElementById('fullname');
        const email = document.getElementById('email');
        const phone = document.getElementById('phone');
        const message = document.getElementById('message');

        let isValid = true;

        // 1. Validation du Nom complet (requis)
        if (fullname.value.trim() === '') {
            setError(fullname, 'Le nom complet est requis.');
            isValid = false;
        } else {
            setSuccess(fullname);
        }

        // 2. Validation de l'Email par Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email.value.trim() === '') {
            setError(email, "L'email est requis.");
            isValid = false;
        } else if (!emailRegex.test(email.value.trim())) {
            setError(email, "Veuillez entrer une adresse email valide.");
            isValid = false;
        } else {
            setSuccess(email);
        }

        // 3. Validation du Téléphone (minimum 8 chiffres, enlevant les espaces)
        const phoneDigits = phone.value.replace(/\D/g, '');
        if (phone.value.trim() === '') {
            setError(phone, 'Le numéro de téléphone est requis.');
            isValid = false;
        } else if (phoneDigits.length < 8) {
            setError(phone, 'Le téléphone doit contenir au moins 8 chiffres.');
            isValid = false;
        } else {
            setSuccess(phone);
        }

        // 4. Validation du Message (minimum 20 caractères)
        if (message.value.trim() === '') {
            setError(message, 'Le message est requis.');
            isValid = false;
        } else if (message.value.trim().length < 20) {
            setError(message, `Le message doit contenir au moins 20 caractères (actuellement ${message.value.trim().length}).`);
            isValid = false;
        } else {
            setSuccess(message);
        }

        // 5. Si tout est valide
        if (isValid) {
            // Supprimer un éventuel ancien message de succès
            let oldSuccess = document.getElementById('form-success-msg');
            if (oldSuccess) oldSuccess.remove();

            // Créer et afficher le message de succès stylisé
            const successDiv = document.createElement('div');
            successDiv.id = 'form-success-msg';
            successDiv.innerHTML = '<i class="bi bi-check-circle-fill"></i> Inscription réussie ! Merci pour votre message.';
            
            contactForm.prepend(successDiv);

            // Réinitialiser le formulaire
            contactForm.reset();

            // Retirer les classes de succès visuelles après réinitialisation
            document.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('success', 'error');
                const errSpan = group.querySelector('.error-message');
                if (errSpan) errSpan.remove();
            });

            // Faire disparaître le message de succès après 5 secondes
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    });

    // Fonctions utilitaires pour le retour visuel
    function setError(inputElement, errorMessage) {
        const formGroup = inputElement.parentElement;
        formGroup.classList.remove('success');
        formGroup.classList.add('error');

        // Vérifier si un message d'erreur existe déjà, sinon le créer
        let errorSpan = formGroup.querySelector('.error-message');
        if (!errorSpan) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            formGroup.appendChild(errorSpan);
        }
        errorSpan.textContent = errorMessage;
    }

    function setSuccess(inputElement) {
        const formGroup = inputElement.parentElement;
        formGroup.classList.remove('error');
        formGroup.classList.add('success');

        // Supprimer le message d'erreur s'il existe
        const errorSpan = formGroup.querySelector('.error-message');
        if (errorSpan) {
            errorSpan.remove();
        }
    }
}
// --- 10. ANIMATIONS AU DÉFILEMENT (SCROLL REVEAL) ---
document.addEventListener("DOMContentLoaded", function() {
    // Sélectionner tous les éléments que l'on veut animer (cartes, sections, etc.)
    const animatedElements = document.querySelectorAll('.speaker-card, .theme-card, section h1, section h2, .faq-item');

    // Ajouter la classe de base pour l'animation
    animatedElements.forEach(el => {
        el.classList.add('reveal');
    });

    // Configuration de l'Intersection Observer
    const observerOptions = {
        root: null, // utilise la fenêtre du navigateur
        rootMargin: '0px',
        threshold: 0.15 // l'animation se déclenche quand 15% de l'élément est visible
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-reveal');
                // Optionnel : arrêter d'observer l'élément une fois qu'il est affiché
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Lancer l'observation sur chaque élément
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});

// --- ANIMATION ZOOM-IN AU DÉFILEMENT ---
// --- ANIMATION FADE-IN GLOBALE (SECTIONS, TITRES, CARTES, TABLEAUX) ---
document.addEventListener("DOMContentLoaded", function() {
    // Ajout de 'table' dans la liste des éléments à animer
    const elementsToAnimate = document.querySelectorAll('section, h1, h2, table, .speaker-card, .theme-card, .stat-item');

    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
    });

    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.10 });

        fadeElements.forEach(element => {
            observer.observe(element);
        });
    }
});
// --- ANIMATION ZOOM-IN EN CASCADE POUR LES INTERVENANTS ---
document.addEventListener("DOMContentLoaded", function() {
    const speakerCards = document.querySelectorAll('.speaker-card');

    if (speakerCards.length > 0) {
        speakerCards.forEach((card, index) => {
            // Ajoute la classe de base
            card.classList.add('speaker-zoom');
            
            // Crée un léger décalage (stagger) pour qu'elles n'arrivent pas toutes en même temps
            let delay = (index % 4) * 0.12; // Décale de 0.12s chaque carte d'une même ligne
            card.style.transitionDelay = `${delay}s`;
        });

        const speakerObserver = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active-speaker');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.10 });

        speakerCards.forEach(card => {
            speakerObserver.observe(card);
        });
    }
});
// --- ANIMATION HERO AU CHARGEMENT ---
document.addEventListener("DOMContentLoaded", function() {
    const heroElements = document.querySelectorAll('.hero-slide-right');
    heroElements.forEach(el => {
        // Petit délai pour laisser le temps au navigateur de charger
        setTimeout(() => {
            el.classList.add('active-hero');
        }, 150);
    });
});
// --- ANIMATION DES H1 (CHARGEMENT DIRECT OU DÉFILEMENT) ---
document.addEventListener("DOMContentLoaded", function() {
    const h1Elements = document.querySelectorAll('.h1-slide-right');

    h1Elements.forEach(h1 => {
        // Vérifie si l'élément est déjà visible au chargement de la page
        const rect = h1.getBoundingClientRect();
        if (rect.top < window.innerHeight) {
            h1.classList.add('active-h1'); // S'anime tout de suite s'il est visible en haut
        } else {
            // Sinon, utilise l'observer s'il est plus bas sur la page
            const h1Observer = new IntersectionObserver((entries, observerInstance) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active-h1');
                        observerInstance.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.10 });
            h1Observer.observe(h1);
        }
    });
});