'use strict';

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(TextPlugin);

    const getElement = (id) => document.getElementById(id);

    const introSection = getElement('popupstart');
    const videoSection = getElement('video-section');
    const finalSection = getElement('final-section');
    const startButton = getElement('startButton');
    const videoPlayer = getElement('video-player');
    const portraitWarning = getElement('portraitWarning');
    const speechBubble = getElement('speechBubble');
    const dialogueText = getElement('dialogue-text');
    const characterVideo = getElement('characterVideo');
    const showTextBtn1 = getElement('showTextBtn1');


    const SPEECH_PHRASES = {
        initial: "Excellent capitaine. Continuez vers la prochaine salle.",
        button1: " Il vous faudra votre carte pour accéder au cockpit.",
    };
    const REDIRECT_URLS = {
        button1: "silverrocket.html",
    };
    const SECTIONS_CONFIG = {
        'popupstart': { element: introSection, zIndex: 30, initialDisplay: 'flex' },
        'video-section': { element: videoSection, zIndex: 20, initialDisplay: 'flex' },
        'final-section': { element: finalSection, zIndex: 10, initialDisplay: 'flex' }
    };

    let currentActiveSectionId = 'popupstart';
    let currentSpeechSource = 'initial';
    let finalSectionContentInitialized = false;
    window.speechTimeline = null;

    function safePlayMedia(mediaElement, errorMessagePrefix = "Media play failed:") {
        if (mediaElement && typeof mediaElement.play === 'function') {
            if (mediaElement.readyState >= 3 && mediaElement.paused) {
                mediaElement.play().catch(e => console.warn(`${errorMessagePrefix}`, e));
            } else if (mediaElement.readyState < 3) {
                mediaElement.addEventListener('canplaythrough', () => {
                    if (mediaElement.paused) {
                        mediaElement.play().catch(e => console.warn(`${errorMessagePrefix} (on canplaythrough)`, e));
                    }
                }, { once: true });
                console.warn(`${errorMessagePrefix} Media not ready (readyState: ${mediaElement.readyState}). Waiting for canplaythrough.`);
            }
        } else {
            console.warn(`${errorMessagePrefix} Invalid media element or play method not available.`);
        }
    }


    function updateSectionVisibility(activeId, duration = 0.1) {
        for (const id in SECTIONS_CONFIG) {
            const config = SECTIONS_CONFIG[id];
            if (config.element) {
                if (id === activeId) {
                    config.element.style.display = config.initialDisplay;
                }
                gsap.to(config.element, {
                    autoAlpha: id === activeId ? 1 : 0,
                    duration: duration,
                    onComplete: () => {
                        if (id !== activeId && config.element) {
                            config.element.style.display = 'none';
                        }
                    }
                });
            }
        }
    }



    function initFinalSectionContent() {
        if (finalSectionContentInitialized && window.speechTimeline?.isActive()) {
            safePlayMedia(characterVideo, "Character video play failed on re-init (active speech):");
            return;
        }

        if (finalSectionContentInitialized && !window.speechTimeline?.isActive()) {
            safePlayMedia(characterVideo, "Character video play failed on re-init (inactive speech):");
            startSpeechAnimation(SPEECH_PHRASES.initial, 'initial');
            currentSpeechSource = 'initial';
            return;
        }

        finalSectionContentInitialized = true;
        safePlayMedia(characterVideo, "Character video play failed on init:");

        if (speechBubble) {
            gsap.to(speechBubble, { opacity: 1, duration: 0.8, ease: "power2.out", delay: 0.5 });
        }
        startSpeechAnimation(SPEECH_PHRASES.initial, 'initial');
        currentSpeechSource = 'initial';
    }

    function transitionToSection(fromSectionEl, toSectionEl, newActiveSectionId, onCompleteCallback) {
        currentActiveSectionId = newActiveSectionId;
        const tl = gsap.timeline({
            onComplete: () => {
                if (onCompleteCallback) onCompleteCallback();
            }
        });

        for (const id in SECTIONS_CONFIG) {
            const config = SECTIONS_CONFIG[id];
            if (config.element && config.element !== fromSectionEl && config.element !== toSectionEl) {
                tl.set(config.element, { autoAlpha: 0, display: 'none' }, 0);
            }
        }

        if (fromSectionEl) {
            tl.to(fromSectionEl, {
                autoAlpha: 0,
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                    if (fromSectionEl.style.display !== 'none') {
                        fromSectionEl.style.display = 'none';
                    }
                }
            });
        }

        if (toSectionEl) {
            gsap.set(toSectionEl, { display: SECTIONS_CONFIG[newActiveSectionId]?.initialDisplay || 'flex', autoAlpha: 0 });
            tl.to(toSectionEl, {
                autoAlpha: 1,
                duration: 0.8,
                ease: 'power2.inOut'
            }, fromSectionEl ? "-=1" : "+=0");
        }
    }

    // Modified function: Removed references to revealedTextContainer
    function handleInteractiveButtonClick(phraseKey) {
        if (!SPEECH_PHRASES[phraseKey]) return; // Check if the phrase key exists

        currentSpeechSource = phraseKey;
        // Removed GSAP animation for revealedTextContainer
        // Directly call startSpeechAnimation
        startSpeechAnimation(SPEECH_PHRASES[phraseKey], phraseKey);
    }

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

            for (const id in SECTIONS_CONFIG) {
                const config = SECTIONS_CONFIG[id];
                if (config.element) {
                    if (id === currentActiveSectionId) {
                        config.element.style.display = config.initialDisplay;
                        gsap.set(config.element, { autoAlpha: 1 });
                    } else {
                        config.element.style.display = 'none';
                        gsap.set(config.element, { autoAlpha: 0 });
                    }
                }
            }

            if (currentActiveSectionId === 'video-section') {
                safePlayMedia(videoPlayer, "Video play failed on orientation change:");
            } else if (currentActiveSectionId === 'final-section') {
                safePlayMedia(characterVideo, "Character video play failed on orientation change:");
                if (finalSectionContentInitialized) {
                    if (window.speechTimeline?.paused()) {
                        window.speechTimeline.resume();
                    } else if (!window.speechTimeline?.isActive()) {
                        const phrase = SPEECH_PHRASES[currentSpeechSource] || SPEECH_PHRASES.initial;
                        startSpeechAnimation(phrase, currentSpeechSource || 'initial');
                    }
                } else {
                    initFinalSectionContent();
                }
            }
        }
    }

    if (startButton && introSection && videoSection) {
        startButton.addEventListener('click', () => {
            transitionToSection(introSection, videoSection, 'video-section', () => {
                safePlayMedia(videoPlayer);
            });
        });
    }

    if (videoPlayer && videoSection && finalSection) {
        videoPlayer.addEventListener('ended', () => {
            transitionToSection(videoSection, finalSection, 'final-section', initFinalSectionContent);
        });
        videoPlayer.addEventListener('error', (e) => {
            console.error('Erreur vidéo principale :', e);
            if (currentActiveSectionId === 'video-section' && gsap.getProperty(videoSection, "autoAlpha") > 0) {
                console.warn("Erreur vidéo, passage au contenu final.");
                transitionToSection(videoSection, finalSection, 'final-section', initFinalSectionContent);
            }
        });
    }

    if (showTextBtn1) {
        showTextBtn1.addEventListener('click', () => handleInteractiveButtonClick('button1'));
    }

    for (const id in SECTIONS_CONFIG) {
        const config = SECTIONS_CONFIG[id];
        if (config.element) {
            gsap.set(config.element, {
                autoAlpha: id === currentActiveSectionId ? 1 : 0,
                zIndex: config.zIndex,
                display: id === currentActiveSectionId ? config.initialDisplay : 'none'
            });
        } else {
            console.warn(`L'élément DOM pour la section '${id}' n'a pas été trouvé.`);
        }
    }
    if (SECTIONS_CONFIG[currentActiveSectionId] && SECTIONS_CONFIG[currentActiveSectionId].element) {
        SECTIONS_CONFIG[currentActiveSectionId].element.style.display = SECTIONS_CONFIG[currentActiveSectionId].initialDisplay;
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
});

'use strict';

/**

 * @param {string} text - Le texte à afficher.
 * @param {HTMLElement} element - L'élément HTML où afficher le texte.
 * @param {number} [speed=30] - La vitesse de frappe en millisecondes.
 */
function typeWriter(text, element, speed = 30) {
    if (!element) {
        console.error("L'élément pour typeWriter est null ou non défini :", element);
        return;
    }
    let i = 0;
   

    function typing() {
        if (i < text.length) {
            if (i === 0) { 
                element.textContent = "";
            }
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        }
    }
    typing();
}

document.addEventListener('DOMContentLoaded', () => {
    const allColonnesTexte = document.querySelectorAll('.colonne-texte');

    if (allColonnesTexte.length === 0) {
        console.warn("Aucun élément avec la classe '.colonne-texte' n'a été trouvé.");
    }

    allColonnesTexte.forEach(colonneTexte => {


        const observerOptions = {
            root: null, 
            rootMargin: '0px',
            threshold: 0.3 
        };

        const observerCallback = (entries, observer) => {
            entries.forEach(async entry => { 
                if (entry.isIntersecting) {
                    const currentColonne = entry.target;
                    const currentH2 = currentColonne.querySelector('h2.texte-anime');
                    const currentP = currentColonne.querySelector('p.texte-anime');

                    const animateElement = (el, speed = 30) => {
                        return new Promise((resolve) => {
                            if (!el) {
                                console.warn("Tentative d'animation d'un élément null.");
                                resolve(); 
                                return;
                            }
                            
                            const originalText = el.getAttribute('data-original-text') || el.textContent.trim();
                            el.setAttribute('data-original-text', originalText); 

                            gsap.to(el, {
                                opacity: 0, 
                                duration: 0.01, 
                                onComplete: () => {
                                    typeWriter(originalText, el, speed);
                                    gsap.to(el, {
                                        opacity: 1,
                                        duration: 0.5, 
                                        delay: 0.1,   
                                        onComplete: resolve 
                                    });
                                }
                            });
                        });
                    };

                   
                    if (currentH2) {
                        await animateElement(currentH2, 30); 
                    }
                    if (currentP) {
                        
                        await animateElement(currentP, 25); 
                    }
                    

                    observer.unobserve(currentColonne);
                }
            });
        };

        const intersectionObserver = new IntersectionObserver(observerCallback, observerOptions);
        intersectionObserver.observe(colonneTexte);
    });
});