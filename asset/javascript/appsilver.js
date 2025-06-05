'use strict';
const bubble = document.getElementById("chat-bubble");

const messages = {
    btnstart: "On dirait qu’il manque un composant de l’alimentation du propulseur.",
    backgroundChangeButton: "Super, c'est cela. Je vais vous aider à la placer et je vous ouvre les portes.",
    componentButtonS2: "“Parfait ! Ça m’a l’air de pouvoir faire l’affaire. Je me charge de la placer, capitaine. Il serait fâcheux que vous vous électrocutez maintenant", 
    btnShowDigipad: "Parfait! Maintenant que tu as ta carte, nous pouvons déverrouiller la porte. Quel est le code déjà ? 1960 ou 4020 ?",
    btn3: "Bienvenue dans la salle des machines, c’est ici le cœur de la fusée. tu devrais trouver un moyen de connecter les câbles entre eux.", 
    landButton: "Vous allez atterrir. Préparez-vous !",
    btnback: "Vous êtes revenu en arrière.",
    btnback1: "Vous êtes revenu en arrière.",
};
function typeWriter(text, element, speed = 30) {
    if (!element) {
        console.error("L'élément pour typeWriter est null ou non défini.");
        return;
    }
    let i = 0;
    element.textContent = "";

    function typing() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}
window.onload = function() {
    const welcomePopup = document.getElementById('welcomePopup');
    const closePopupSpan = document.getElementById('closePopup');
    const btn1Start = document.getElementById('btn1');

    if (welcomePopup && btn1Start) {
        welcomePopup.style.display = 'flex';

        function handleStartButtonClick() {
            welcomePopup.style.display = 'none';
            const msg = messages.btnstart;
            if (msg && bubble) {
                gsap.to(bubble, {
                    opacity: 0, duration: 0.2, onComplete: () => {
                        typeWriter(msg, bubble);
                        gsap.to(bubble, { opacity: 1, duration: 0.2 });
                    }
                });
            }
        }
        btn1Start.onclick = handleStartButtonClick;

        if (closePopupSpan) {
            closePopupSpan.onclick = function() {
                welcomePopup.style.display = 'none';
            };
        }
    }
};
document.querySelectorAll("main button").forEach((btn) => {
    btn.addEventListener("click", () => {
        const msgKey = btn.id;
        const msg = messages[msgKey];
        if (msgKey && msg && bubble) {
             gsap.to(bubble, {
                opacity: 0, duration: 0.2, onComplete: () => {
                    typeWriter(msg, bubble);
                    gsap.to(bubble, { opacity: 1, duration: 0.2 });
                }
            });
        }
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const carouselContainer = document.getElementById('carousel-container');
    const sections = carouselContainer ? Array.from(carouselContainer.querySelectorAll('section')) : [];
    const navButtons = document.querySelectorAll('.nav-button');
    let currentSectionIndex = 0;

    function showSection(indexToShow) {
        if (sections.length === 0 || indexToShow < 0 || indexToShow >= sections.length) {
            console.error(`Index de section invalide : ${indexToShow}.`);
            return;
        }
        sections.forEach((section, index) => {
            section.classList.toggle('active', index === indexToShow);
        });
        currentSectionIndex = indexToShow;
    }

    navButtons.forEach(button => {
        if (button.classList.contains('image-button')) return;

        button.addEventListener('click', () => {
            const targetId = button.dataset.target;
            if (targetId) {
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    const targetIndex = sections.indexOf(targetSection);
                    if (targetIndex !== -1) {
                        showSection(targetIndex);
                    }
                }
            }
        });
    });

    if (sections.length > 0) {
        showSection(0);
    }
    const section1 = document.getElementById('section1');
    const backgroundChangeButton = document.getElementById('backgroundChangeButton');
    const goToSection2Btn = document.getElementById('btn3');

    if (section1 && backgroundChangeButton && goToSection2Btn) {
        section1.classList.add('background-initial');
        backgroundChangeButton.addEventListener('click', () => {
            section1.classList.toggle('background-initial');
            section1.classList.toggle('background-alternative');
            backgroundChangeButton.style.display = 'none';
            goToSection2Btn.style.display = 'inline-block';
        });
    }
    const section2 = document.getElementById('section2');
    const componentButtonS2 = document.getElementById('componentButtonS2'); 
    const goToSection3Btn = document.getElementById('btnGoToS3'); 
    const simonPopupElement = document.getElementById('simonPopup');

    if (section2 && componentButtonS2 && goToSection3Btn && simonPopupElement) {
        section2.classList.add('background-initial-s2');
        componentButtonS2.addEventListener('click', () => {
            section2.classList.toggle('background-initial-s2');
            section2.classList.toggle('background-alternative-s2');
            componentButtonS2.style.display = 'none';
            setTimeout(() => {
                simonPopupElement.style.display = 'flex';
                generateSequence();
                playSequence();
            }, 1500);
        });
    }
    const buttonShowDigipad = document.getElementById("btnShowDigipad");
    const popupDigipad = document.getElementById("popupDigipad");
    const inputCode = document.getElementById("inputCode");
    const errorMsgDigipad = document.getElementById("errorMsg");
    const numButtonsDigipad = document.querySelectorAll(".digipad-buttons .num-btn");
    const btnClearDigipad = document.getElementById("btnClear");
    const btnValidateDigipad = document.getElementById("btnValidate");
    const goToSection4Btn = document.getElementById('btnGoToS4');
    const correctPasswordS3 = "4020";

    if (!buttonShowDigipad) console.error("L'élément #btnShowDigipad est introuvable.");

    if (buttonShowDigipad && popupDigipad) {
        buttonShowDigipad.addEventListener("click", () => {
            if (!buttonShowDigipad.classList.contains('state-clicked')) {
                buttonShowDigipad.classList.add('state-clicked');
            }
            popupDigipad.style.display = "flex";
            if (inputCode) inputCode.value = "";
            if (errorMsgDigipad) {
                errorMsgDigipad.textContent = "";
                errorMsgDigipad.style.color = "#e74c3c";
            }
        });
    }

    if (numButtonsDigipad.length > 0 && inputCode) {
        numButtonsDigipad.forEach(button => {
            button.addEventListener("click", () => {
                if (inputCode.value.length < 6) {
                    inputCode.value += button.textContent;
                }
            });
        });
    }

    if (btnClearDigipad && inputCode && errorMsgDigipad) {
        btnClearDigipad.addEventListener("click", () => {
            inputCode.value = "";
            errorMsgDigipad.textContent = "";
        });
    }

    if (btnValidateDigipad && inputCode && errorMsgDigipad && popupDigipad && goToSection4Btn) {
        btnValidateDigipad.addEventListener("click", () => {
            if (inputCode.value === correctPasswordS3) {
                if(errorMsgDigipad) {
                    errorMsgDigipad.style.color = "#2ecc71";
                    errorMsgDigipad.textContent = "Accès autorisé !";
                }
                setTimeout(() => {
                    if (popupDigipad) popupDigipad.style.display = "none";
                    if (goToSection4Btn) {
                        goToSection4Btn.style.display = 'inline-block';
                        const successDigipadMsg = messages.btnGoToS4 || "Cockpit déverrouillé. Delta, nous voilà !";
                        if (bubble && typeof typeWriter === 'function') {
                             gsap.to(bubble, {
                                opacity: 0, duration: 0.2, onComplete: () => {
                                    typeWriter(successDigipadMsg, bubble);
                                    gsap.to(bubble, { opacity: 1, duration: 0.2 });
                                }
                            });
                        }
                    }
                }, 1500);
            } else {
                if(errorMsgDigipad) {
                    errorMsgDigipad.style.color = "#e74c3c";
                    errorMsgDigipad.textContent = "Code incorrect. Réessaie.";
                }
                if (inputCode) inputCode.value = "";
                const digipadBox = popupDigipad ? popupDigipad.querySelector('.digipad-content') : null;
                if(digipadBox && typeof digipadBox.classList !== 'undefined') {
                    digipadBox.classList.add('shake-error');
                    setTimeout(() => { digipadBox.classList.remove('shake-error'); }, 300);
                }
            }
        });
    }
    const landButton = document.getElementById('landButton');
    const redirectionURL = "https://www.ledelta.be/";

    if (landButton) {
        landButton.addEventListener('click', () => {
            let count = 3;
            landButton.disabled = true;
            landButton.textContent = count;

            const countdown = setInterval(() => {
                count--;
                if (count > 0) {
                    landButton.textContent = count;
                } else if (count === 0) {
                    landButton.textContent = "GO!";
                } else {
                    clearInterval(countdown);
                    window.location.href = redirectionURL;
                }
            }, 1000);
        });
    }
    const startSimonButton = document.getElementById("startSimon");

    if (startSimonButton) {
        startSimonButton.addEventListener("click", () => {
            generateSequence();
            playSequence();
        });
    }
    document.querySelectorAll("#simonPopup .pad").forEach(pad => {
        pad.addEventListener("click", () => {
            if (!acceptingInputSimon) return;
            const color = pad.dataset.color;
            userSequence.push(color);
            flashColorSimon(color);
            checkUserInputSimon();
        });
    });

});
const simonSequence = [];
const userSequence = [];
const simonColors = ['red', 'green', 'blue', 'yellow'];
let acceptingInputSimon = false;

function generateSequence() {
    simonSequence.length = 0;
    userSequence.length = 0;
    for (let i = 0; i < 5; i++) { 
        simonSequence.push(simonColors[Math.floor(Math.random() * simonColors.length)]);
    }
}

function flashColorSimon(color) {
    const pad = document.querySelector(`#simonPopup .pad[data-color="${color}"]`);
    if(pad) {
        pad.style.opacity = "0.4";
        setTimeout(() => { pad.style.opacity = "1"; }, 300);
    }
}

function playSequence() {
    let i = 0;
    acceptingInputSimon = false;
    const simonPopupElement = document.getElementById('simonPopup');
    const centerButtonSimon = simonPopupElement ? simonPopupElement.querySelector('.center-button') : null;

    if(centerButtonSimon) centerButtonSimon.textContent = "Mémorisez";

    const interval = setInterval(() => {
        if (i < simonSequence.length) {
            flashColorSimon(simonSequence[i]);
            i++;
        } else {
            clearInterval(interval);
            acceptingInputSimon = true;
            if(centerButtonSimon) centerButtonSimon.textContent = "Jouez !";
            userSequence.length = 0;
        }
    }, 700);
}

function checkUserInputSimon() {
    const simonPopupElement = document.getElementById('simonPopup');
    const centerButtonSimon = simonPopupElement ? simonPopupElement.querySelector('.center-button') : null;

    for (let i = 0; i < userSequence.length; i++) {
        if (userSequence[i] !== simonSequence[i]) {
            if(centerButtonSimon) centerButtonSimon.textContent = "Erreur!";
            userSequence.length = 0;
            acceptingInputSimon = false;
            setTimeout(() => {
                playSequence(); 
            }, 1200);
            return;
        }
    }

    if (userSequence.length === simonSequence.length) { 
        if(centerButtonSimon) centerButtonSimon.textContent = "Réussi !";
        acceptingInputSimon = false;
        setTimeout(() => {
            if (simonPopupElement) simonPopupElement.style.display = "none";
            if(centerButtonSimon) centerButtonSimon.textContent = "Redémarrer";

            const simonSuccessMsg = "Système de sécurité secondaire désactivé.";
            if (bubble && typeof typeWriter === 'function') {
                 gsap.to(bubble, {
                    opacity: 0, duration: 0.2, onComplete: () => {
                        typeWriter(simonSuccessMsg, bubble);
                        gsap.to(bubble, { opacity: 1, duration: 0.2 });
                    }
                });
            }
            const S2_goToSection3Btn = document.getElementById('btnGoToS3'); 
            if (S2_goToSection3Btn) {
                S2_goToSection3Btn.style.display = 'inline-block';
                console.log("Bouton #btnGoToS3 (vers Section 3) rendu visible après succès Simon.");

                const S3NavUnlockedMsg = messages.btnGoToS3 || "Navigation vers la section suivante débloquée. Bien joué maintenant à vous de trouver la carte d'accès.";
                if (S3NavUnlockedMsg && bubble && typeof typeWriter === 'function') { 
                    setTimeout(() => { 
                        gsap.to(bubble, {
                            opacity: 0, duration: 0.2, onComplete: () => {
                                typeWriter(S3NavUnlockedMsg, bubble);
                                gsap.to(bubble, { opacity: 1, duration: 0.2 });
                            }
                        });
                    }, 1500); 
                }
            } else {
                console.error("Bouton #btnGoToS3 non trouvé lors du succès Simon.");
            }

        }, 1000);
    }
}

const portraitWarning = getElement('portraitWarning');
function handleOrientationChange(event) {
    const isPortrait = event.matches; 

    if (isPortrait) {
        if (portraitWarning) portraitWarning.style.display = 'flex'; 
        for (const id in SECTIONS_CONFIG) {
            if (SECTIONS_CONFIG[id].element) SECTIONS_CONFIG[id].element.style.display = 'none';
        }
        if (videoPlayer && typeof videoPlayer.pause === 'function') videoPlayer.pause();
        if (characterVideo && typeof characterVideo.pause === 'function') characterVideo.pause();
        if (window.speechTimeline?.isActive()) window.speechTimeline.pause();

    } else {
        if (portraitWarning) portraitWarning.style.display = 'none'; 
    }
}
if (window.matchMedia) {
    const orientationQuery = window.matchMedia("(orientation: portrait)");
    if (orientationQuery.addEventListener) {
        orientationQuery.addEventListener('change', handleOrientationChange);
    } else if (orientationQuery.addListener) { 
        orientationQuery.addListener(handleOrientationChange);
    }
    handleOrientationChange(orientationQuery); 
} else {
    console.warn("window.matchMedia n'est pas supporté. L'avertissement de mode portrait ne fonctionnera pas. Affichage en mode paysage par défaut.");
    if (portraitWarning) portraitWarning.style.display = 'none'; 
}

