
export class ButterflySwarm {
    constructor() {
        this.active = false;
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('butterfly-css-anim')) return;
        const style = document.createElement('style');
        style.id = 'butterfly-css-anim';
        style.textContent = `
            .butterfly-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 99999;
                overflow: hidden;
            }
            .butterfly {
                position: absolute;
                background-image: none; 
                z-index: 5;
                will-change: transform;
            }

            /* ANIMATION: Move L->R with 90deg TILT (Facing Right) */
            @keyframes moveLeftToRight {
                0% { 
                    transform: translate3d(-800px, 0, 0) rotate(90deg); 
                }
                100% { 
                    transform: translate3d(4000px, 0, 0) rotate(90deg); 
                }
            }

            @keyframes flap {
                0% { transform: scaleX(1); }
                50% { transform: scaleX(0.4); }
                100% { transform: scaleX(1); }
            }
        `;
        document.head.appendChild(style);
    }

    start(onSwarmPeak) {
        if (this.active) return;
        this.active = true;

        const container = document.createElement('div');
        container.className = 'butterfly-container';
        document.body.appendChild(container);

        // COUNT: 90 (Dense wall)
        const count = 90;

        for (let i = 0; i < count; i++) {
            let b = document.createElement('div');
            b.classList.add('butterfly');

            // Random Height
            let topPos = -20 + Math.random() * 140;

            // SIZE: ~400px (350px - 450px)
            let size = 350 + Math.random() * 100;

            // DURATION: ~6 seconds (5.5s - 6.5s)
            let duration = 5.5 + Math.random() * 1.0;

            // Spread delays
            let delay = Math.random() * 3.0;

            let flapSpeed = 0.1 + Math.random() * 0.15;

            b.style.top = topPos + 'vh';
            b.style.width = size + 'px';
            b.style.height = size + 'px';
            b.style.left = '-800px';

            // INNER DIV FOR FLAPPING
            const inner = document.createElement('div');
            inner.style.width = '100%';
            inner.style.height = '100%';
            inner.style.backgroundImage = "url('img/butterfly.png')";
            inner.style.backgroundSize = "contain";
            inner.style.backgroundRepeat = "no-repeat";
            inner.style.backgroundPosition = "center";
            inner.style.transform = "translateZ(0)";
            inner.style.willChange = "transform";
            inner.style.animation = `flap ${flapSpeed}s infinite linear alternate`;

            b.appendChild(inner);

            // ANIMATION
            b.style.animationName = 'moveLeftToRight';
            b.style.animationDuration = duration + 's';
            b.style.animationDelay = delay + 's';
            b.style.animationTimingFunction = "linear";
            b.style.animationFillMode = "forwards";

            container.appendChild(b);
        }

        // FADEOUT TRIGGER
        // Window of FULL COVERAGE (Head past right, Tail not yet left) is approx 3.4s to 4.0s.
        // Trigger at 3400ms to start fade exactly when full coverage is achieved.
        if (onSwarmPeak) {
            setTimeout(() => {
                onSwarmPeak();
            }, 3400);
        }

        // CLEANUP
        setTimeout(() => {
            if (container) container.remove();
            this.active = false;
        }, 12000);
    }
}
