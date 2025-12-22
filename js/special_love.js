// Logic for Do You Love Me and Heart Animation

const dylmWrapper = document.getElementById("dylm-wrapper");
const questionContainer = document.querySelector(".question-container");
const resultContainer = document.querySelector(".result-container");
const gifResult = document.querySelector(".gif-result");
const heartLoader = document.querySelector(".cssload-main");
const yesBtn = document.querySelector(".js-yes-btn");
const noBtn = document.querySelector(".js-no-btn");
const heartContainer = document.querySelector(".heart-container");
const audio = document.getElementById("audios");
const dylmTriggerBtn = document.getElementById("dylmTriggerBtn");

// --- Trigger Logic (Transition from Main Site) ---
if (dylmTriggerBtn) {
    dylmTriggerBtn.addEventListener('click', function () {
        // Hide Birthday Message
        const bdayMsg = document.getElementById('birthdayMessage');
        if (bdayMsg) {
            bdayMsg.style.transition = 'opacity 1s ease';
            bdayMsg.style.opacity = '0';
            setTimeout(() => bdayMsg.style.display = 'none', 1000);
        }

        // Hide Fireworks
        const fireworksCanvas = document.getElementById('canvas');
        const tsparticles = document.getElementById('tsparticles');
        if (fireworksCanvas) fireworksCanvas.style.display = 'none';
        if (tsparticles) tsparticles.style.display = 'none';

        // STOP Fireworks Loop (Stops new sounds from spawning)
        window.stopFireworksAnimation = true;

        // Stop any fireworks audio
        const audioExp = document.querySelector('audio.exp');
        const audioLaunch = document.querySelector('audio.launch');
        if (audioExp) audioExp.pause();
        if (audioLaunch) audioLaunch.pause();

        // Show Do You Love Me Section
        if (dylmWrapper) {
            // Trigger reflow to enable transition from display:none
            dylmWrapper.style.display = 'flex';
            // Force a reflow
            void dylmWrapper.offsetWidth;
            // Add class to trigger opacity/blur transition
            dylmWrapper.classList.add('visible');

            // Reduce bgMusic volume further for the question
            const bgMusic = document.getElementById('bgMusic');
            if (bgMusic) {
                bgMusic.volume = 0.02; // Drop to 2%
            }
        }
    });
}


// --- Do You Love Me Logic ---

// Change the position of no button
// Change the position of no button
// Change the position of no button
if (noBtn) {
    noBtn.addEventListener("mouseover", () => {
        // Fix: Move button to body to avoid 'transform' context issues from parents
        if (noBtn.parentNode !== document.body) {
            document.body.appendChild(noBtn);
        }

        // Ensure buttons stay within the EXACT screen dimensions
        // Use window.innerWidth/Height - button size - padding
        const pad = 20;
        const maxX = window.innerWidth - noBtn.offsetWidth - pad;
        const maxY = window.innerHeight - noBtn.offsetHeight - pad;

        const yesRect = yesBtn.getBoundingClientRect();

        let newX, newY;
        let overlap = true;
        let attempts = 0;

        while (overlap && attempts < 15) {
            newX = Math.floor(Math.random() * maxX);
            newY = Math.floor(Math.random() * maxY);

            // Limit to positive values (never go off left/top)
            newX = Math.max(pad, newX);
            newY = Math.max(pad, newY);

            // Check collision with Yes button (with extra padding)
            if (
                newX < yesRect.right + 30 &&
                newX + noBtn.offsetWidth > yesRect.left - 30 &&
                newY < yesRect.bottom + 30 &&
                newY + noBtn.offsetHeight > yesRect.top - 30
            ) {
                overlap = true;
            } else {
                overlap = false;
            }
            attempts++;
        }

        // Final fallback: if overlap persists, put it in a safe corner (bottom-left)
        if (overlap) {
            newX = 50;
            newY = window.innerHeight - 100;
        }

        noBtn.style.position = 'fixed';
        noBtn.style.left = `${newX}px`;
        noBtn.style.top = `${newY}px`;
        noBtn.style.zIndex = '10000'; // High z-index to stay visible
    });
}

// Yes button functionality
if (yesBtn) {
    yesBtn.addEventListener("click", () => {
        if (questionContainer) questionContainer.style.display = "none";

        // Fix: Hide No button explicitly since it might be attached to body now
        if (noBtn) noBtn.style.display = 'none';

        if (heartLoader) heartLoader.style.display = "block"; // Use block for loader

        setTimeout(() => {
            if (heartLoader) heartLoader.style.display = "none";
            if (resultContainer) {
                resultContainer.style.display = "block";
                if (gifResult) {
                    gifResult.play().catch(e => console.log("Video play error:", e));
                    // Check if it's visible
                    gifResult.style.display = 'block';
                }
            }

            /* 
               User requested to STOP here. 
               No fadeout, no transition to Heart Animation.
               The flow ends at 'I Knew It'. 
            */

        }, 3000); // 3 seconds loader
    });
}

