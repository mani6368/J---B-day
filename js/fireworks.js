
// Wrap in a global function to trigger it later
window.startCustomFireworks = function () {
    $(function () {
        var canvas = $("#canvas")[0];
        canvas.width = $(window).width();
        canvas.height = $(window).height();
        var ctx = canvas.getContext("2d");

        // resize
        $(window).on("resize", function () {
            canvas.width = $(window).width();
            canvas.height = $(window).height();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            center = { x: canvas.width / 2, y: canvas.height / 2 };
        });

        // init
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // define array of sound - MOVED UP to prevent crash on init
        var listExpSound = $("audio.exp");
        var listLaunchSound = $("audio.launch");

        // objects
        var listFire = [];
        var listFirework = [];
        var listText = [];
        var listSpecial = [];
        var listSpark = [];
        var lights = [];
        var fireNumber = 10;
        var center = { x: canvas.width / 2, y: canvas.height / 2 };
        var range = 100;
        var fired = 0;
        var onHold = 0;
        var supprise = false;
        var textIndex = 0;
        var lastSoundTime = 0; // Throttle sound
        var actions = [
            makeDoubleFullCircleFirework,
            makePlanetCircleFirework,
            makeFullCircleFirework,
            makeDoubleCircleFirework,
            makeHeartFirework,
            makeCircleFirework,
            makeRandomFirework
        ];
        for (var i = 0; i < fireNumber; i++) {
            // Randomly choose Left (0-30%) or Right (70-100%)
            var isLeft = Math.random() < 0.5;
            var xPos;
            if (isLeft) {
                xPos = Math.random() * (canvas.width * 0.3);
            } else {
                xPos = (canvas.width * 0.7) + Math.random() * (canvas.width * 0.3);
            }

            var fire = {
                x: xPos,
                y: Math.random() * range * 2.5 + canvas.height,
                size: Math.random() + 0.5,
                fill: "#ff3",
                vx: Math.random() - 0.5,
                vy: -(Math.random() + 4),
                ax: Math.random() * 0.06 - 0.03,
                delay: Math.round(Math.random() * range) + range * 4,
                hold: false,
                alpha: 1,
                far: Math.random() * range + (center.y - range)
            };
            fire.base = {
                x: fire.x,
                y: fire.y,
                vx: fire.vx,
                vy: fire.vy
            };
            //
            listFire.push(fire);
            // play sound
            playLaunchSound();
        }

        // define array position of text - NOT USED but keeping variables to avoid ReferenceErrors if referenced elsewhere
        var textString = "happynewyear2025";

        function initText() {
            // DISABLED FOR BIRTHDAY - User request: NO "Happy New Year" text.
            // Just reset or stop
            return;
        }

        function initSpark() {
            var x = Math.random() * range * 3 - range * 1.5 + center.x;
            var vx = Math.random() - 0.5;
            var vy = -(Math.random() + 4);
            var ax = Math.random() * 0.04 - 0.02;
            var far = Math.random() * range * 4 - range + center.y;
            var direct = ax * 10 * Math.PI;
            var max = fireNumber * 0.5;
            for (var i = 0; i < max; i++) {
                var special = {
                    x: x,
                    y: Math.random() * range * 0.25 + canvas.height,
                    size: Math.random() + 2,
                    fill: "#ff3",
                    vx: vx,
                    vy: vy,
                    ax: ax,
                    direct: direct,
                    alpha: 1
                };
                special.far = far - (special.y - canvas.height);
                listSpecial.push(special);
                // play sound
                playLaunchSound();
            }
        }

        function randColor() {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            var color = "rgb($r, $g, $b)";
            color = color.replace("$r", r);
            color = color.replace("$g", g);
            color = color.replace("$b", b);
            return color;
        }

        function playExpSound() {
            var now = Date.now();
            if (now - lastSoundTime < 650) return; // Limit to ~1.5 sounds per second (3 in 2s)
            lastSoundTime = now;

            if (listExpSound.length > 0) {
                var sound = listExpSound[Math.floor(Math.random() * listExpSound.length)];
                var audioClone = sound.cloneNode();
                // FIXED VOLUME: Ensure every explosion is loud and clear
                audioClone.volume = 0.05; // Stay at 5%
                console.log('Playing Explosion Sound at Volume:', audioClone.volume);
                audioClone.play().catch(e => { /* ignore auto-play errors */ });
            }
        }

        function playLaunchSound() {
            if (listLaunchSound.length > 0) {
                var sound = listLaunchSound[Math.floor(Math.random() * listLaunchSound.length)];
                var audioClone = sound.cloneNode();
                audioClone.volume = 0.025; // Set to 2.5% as requested
                console.log('Playing Launch Sound at Volume:', audioClone.volume);
                audioClone.play().catch(e => { console.error('Launch play failed', e); });
            }
        }

        function makeCircleFirework(fire) {
            var color = randColor();
            // INCREASED VELOCITY (Radius)
            var velocity = Math.random() * 4 + 12; // Was 2 + 6
            var max = fireNumber * 5;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    // INCREASED PARTICLE SIZE
                    size: Math.random() * 3 + 3, // Was + 1.5
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.04,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 2
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return color;
        }

        function makeDoubleCircleFirework(fire) {
            var color = randColor();
            // INCREASED VELOCITY
            var velocity = Math.random() * 4 + 16; // Was 2 + 8
            var max = fireNumber * 3;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    // INCREASED PARTICLE SIZE
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.04,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            color = randColor();
            velocity = Math.random() * 6 + 8; // Was 3 + 4
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.04,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return color;
        }

        function makePlanetCircleFirework(fire) {
            var color = "#aa0609";
            // INCREASED VELOCITY
            var velocity = Math.random() * 4 + 8; // Was 2 + 4
            var max = fireNumber * 2;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.04,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            max = fireNumber * 4;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity * Math.random(),
                    vy: Math.sin(rad) * velocity * Math.random(),
                    ay: 0.04,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            max = fireNumber * 3;
            color = "#ff9";
            var rotate = Math.random() * Math.PI * 2;
            var vx = velocity * (Math.random() + 2);
            var vy = velocity * 0.6;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                // calc x, y for ellipse
                var cx = Math.cos(rad) * vx + (Math.random() - 0.5) * 0.5;
                var cy = Math.sin(rad) * vy + (Math.random() - 0.5) * 0.5;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: cx * Math.cos(rotate) - cy * Math.sin(rotate), // rotate x ellipse
                    vy: cx * Math.sin(rotate) + cy * Math.cos(rotate), // rotate y ellipse
                    ay: 0.02,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return "#aa0609";
        }

        function makeFullCircleFirework(fire) {
            var color = randColor();
            // INCREASED VELOCITY
            var velocity = Math.random() * 16 + 16; // Was 8 + 8
            var max = fireNumber * 3;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.06,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            max = fireNumber * Math.round(Math.random() * 4 + 4);
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity * Math.random(),
                    vy: Math.sin(rad) * velocity * Math.random(),
                    ay: 0.06,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return color;
        }

        function makeDoubleFullCircleFirework(fire) {
            var color = randColor();
            // INCREASED VELOCITY
            var velocity = Math.random() * 16 + 16;
            var max = fireNumber * 3;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.04,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            color = randColor();
            velocity = Math.random() * 6 + 8;
            max = fireNumber * 2;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.06,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            max = fireNumber * 4;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * velocity * Math.random(),
                    vy: Math.sin(rad) * velocity * Math.random(),
                    ay: 0.06,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return color;
        }

        function makeHeartFirework(fire) {
            var color = randColor();
            // INCREASED VELOCITY
            var velocity = Math.random() * 6 + 6; // Was 3 + 3
            var max = fireNumber * 5;
            var rotate = Math.random() * Math.PI * 2;
            for (var i = 0; i < max; i++) {
                var rad = (i * Math.PI * 2) / max + rotate;
                var v, p;
                if (rad - rotate < Math.PI * 0.5) {
                    p = (rad - rotate) / (Math.PI * 0.5);
                    v = velocity + velocity * p;
                } else if (rad - rotate > Math.PI * 0.5 && rad - rotate < Math.PI) {
                    p = (rad - rotate - Math.PI * 0.5) / (Math.PI * 0.5);
                    v = velocity * (2 - p);
                } else if (rad - rotate > Math.PI && rad - rotate < Math.PI * 1.5) {
                    p = (rad - rotate - Math.PI) / (Math.PI * 0.5);
                    v = velocity * (1 - p);
                } else if (rad - rotate > Math.PI * 1.5 && rad - rotate < Math.PI * 2) {
                    p = (rad - rotate - Math.PI * 1.5) / (Math.PI * 0.5);
                    v = velocity * p;
                } else {
                    v = velocity;
                }
                v = v + (Math.random() - 0.5) * 0.25;
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    vx: Math.cos(rad) * v,
                    vy: Math.sin(rad) * v,
                    ay: 0.02,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 1.5
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return color;
        }

        function makeRandomFirework(fire) {
            var color = randColor();
            for (var i = 0; i < fireNumber * 5; i++) {
                var firework = {
                    x: fire.x,
                    y: fire.y,
                    size: Math.random() * 3 + 3,
                    fill: color,
                    // INCREASED SPREAD
                    vx: Math.random() * 30 - 15, // Was 15 - 7.5
                    vy: Math.random() * -30 + 10, // Was -15 + 5
                    ay: 0.05,
                    alpha: 1,
                    life: Math.round((Math.random() * range) / 2) + range / 2
                };
                firework.base = {
                    life: firework.life,
                    size: firework.size
                };
                listFirework.push(firework);
            }
            return color;
        }

        function makeSpark(special) {
            var color = special.fill;
            // INCREASED VELOCITY
            var velocity = Math.random() * 12 + 24; // Was 6 + 12
            var max = fireNumber;
            for (var i = 0; i < max; i++) {
                var rad =
                    Math.random() * Math.PI * 0.3 + Math.PI * 0.35 + Math.PI + special.direct;
                var spark = {
                    x: special.x,
                    y: special.y,
                    size: Math.random() + 1,
                    fill: color,
                    vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                    ay: 0.02,
                    alpha: 1,
                    rad: rad,
                    direct: special.direct,
                    chain: Math.round(Math.random() * 2) + 2,
                    life: Math.round((Math.random() * range) / 2) + range / 2
                };
                spark.base = {
                    life: spark.life,
                    velocity: velocity
                };
                listSpark.push(spark);
            }
            return color;
        }

        function chainSpark(parentSpark) {
            var color = parentSpark.fill;
            if (parentSpark.chain > 0) {
                var velocity = parentSpark.base.velocity * 0.6;
                var max = Math.round(Math.random() * 5);
                for (var i = 0; i < max; i++) {
                    var rad =
                        Math.random() * Math.PI * 0.3 -
                        Math.PI * 0.15 +
                        parentSpark.rad +
                        parentSpark.direct;
                    var spark = {
                        x: parentSpark.x,
                        y: parentSpark.y,
                        size: parentSpark.size * 0.6,
                        fill: color,
                        vx: Math.cos(rad) * velocity + (Math.random() - 0.5) * 0.5,
                        vy: Math.sin(rad) * velocity + (Math.random() - 0.5) * 0.5,
                        ay: 0.02,
                        alpha: 1,
                        rad: rad,
                        direct: parentSpark.direct,
                        chain: parentSpark.chain,
                        life: parentSpark.base.life * 0.8
                    };
                    spark.base = {
                        life: spark.life,
                        size: spark.size,
                        velocity: velocity
                    };
                    listSpark.push(spark);
                }

                if (Math.random() > 0.9 && parentSpark.chain > 1) {
                    // play sound
                    playExpSound();
                }
            }
            return color;
        }

        (function loop() {
            if (window.stopFireworksAnimation) return; // Allow stopping externally
            requestAnimationFrame(loop);
            update();
            draw();
        })();

        function update() {
            // update fire logic
            for (var i = 0; i < listFire.length; i++) {
                var fire = listFire[i];
                //
                if (fire.y <= fire.far) {
                    // play sound
                    playExpSound();
                    // case add firework
                    fired++;
                    var color = actions[Math.floor(Math.random() * actions.length)](fire);
                    // light
                    lights.push({ x: fire.x, y: fire.y, color: color, radius: range * 2 });
                    // reset
                    fire.y = fire.base.y;

                    // RANDOMIZE X POSITION (50-50 Split)
                    var isLeft = Math.random() < 0.5;
                    if (isLeft) {
                        fire.x = Math.random() * (canvas.width * 0.3);
                    } else {
                        fire.x = (canvas.width * 0.7) + Math.random() * (canvas.width * 0.3);
                    }
                    // special
                    if (fired % 33 == 0) {
                        initSpark();
                    }
                    // on hold
                    supprise = false; // DISABLED: User requested continuous fireworks
                    // supprise = fired % 100 == 0 ? true : supprise;
                    if (supprise) {
                        fire.vx = 0;
                        fire.vy = 0;
                        fire.ax = 0;
                        fire.hold = true;
                        onHold++;
                    } else {
                        fire.vx = fire.base.vx;
                        fire.vy = fire.base.vy;
                        fire.ax = Math.random() * 0.06 - 0.03;
                        // play sound
                        playLaunchSound();
                    }
                }
                //
                if (fire.hold && fire.delay <= 0) {
                    onHold--;
                    fire.hold = false;
                    fire.delay = Math.round(Math.random() * range) + range * 4;
                    fire.vx = fire.base.vx;
                    fire.vy = fire.base.vy;
                    fire.ax = Math.random() * 0.06 - 0.03;
                    fire.alpha = 1;
                    // play sound
                    playLaunchSound();
                } else if (fire.hold && fire.delay > 0) {
                    fire.delay--;
                } else {
                    fire.x += fire.vx;
                    fire.y += fire.vy;
                    fire.vx += fire.ax;
                    // INCREASED TRAIL
                    fire.alpha = (fire.y - fire.far) / fire.far;
                }
            }

            // update firework logic
            for (var i = listFirework.length - 1; i >= 0; i--) {
                var firework = listFirework[i];
                if (firework) {
                    firework.vx *= 0.9;
                    firework.vy *= 0.9;
                    firework.x += firework.vx;
                    firework.y += firework.vy;
                    firework.vy += firework.ay;
                    firework.alpha = firework.life / firework.base.life;
                    firework.size = firework.alpha * firework.base.size;
                    firework.alpha = firework.alpha > 0.6 ? 1 : firework.alpha;
                    //
                    firework.life--;
                    if (firework.life <= 0) {
                        listFirework.splice(i, 1);
                    }
                }
            }

            // supprise happy new year!
            if (supprise && onHold == 10) {
                supprise = false;
                setTimeout(initText, 3000);
            }

            // update text logic
            for (var i = listText.length - 1; i >= 0; i--) {
                var text = listText[i];
                text.vx *= 0.9;
                text.vy *= 0.9;
                text.direct *= 0.9;
                text.x += text.vx + text.direct;
                text.y += text.vy;
                text.vy += text.ay;
                text.alpha = text.life / text.base.life;
                text.size = text.alpha * text.base.size;
                text.alpha = text.alpha > 0.6 ? 1 : text.alpha;
                //
                text.life--;
                if (text.life <= 0) {
                    listText.splice(i, 1);
                }
            }

            // update special logic
            for (var i = listSpecial.length - 1; i >= 0; i--) {
                var special = listSpecial[i];
                if (special.y <= special.far) {
                    // play sound
                    playExpSound();
                    // light
                    lights.push({
                        x: special.x,
                        y: special.y,
                        color: special.fill,
                        alpha: 0.02,
                        radius: range * 2
                    });
                    //
                    makeSpark(special);
                    // remove from list
                    listSpecial.splice(i, 1);
                } else {
                    special.x += special.vx;
                    special.y += special.vy;
                    special.vx += special.ax;
                    special.alpha = (special.y - special.far) / special.far;
                }
            }

            // update spark logic
            for (var i = listSpark.length - 1; i >= 0; i--) {
                var spark = listSpark[i];
                if (spark) {
                    spark.vx *= 0.9;
                    spark.vy *= 0.9;
                    spark.x += spark.vx;
                    spark.y += spark.vy;
                    spark.vy += spark.ay;
                    spark.alpha = spark.life / spark.base.life + 0.2;
                    //
                    spark.life--;
                    if (spark.life < spark.base.life * 0.8 && spark.life > 0) {
                        //
                        spark.chain--;
                        chainSpark(spark);
                    }
                    if (spark.life <= 0) {
                        listSpark.splice(i, 1);
                    }
                }
            }
        }

        function draw() {
            // clear
            ctx.globalCompositeOperation = "destination-out";
            ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // re-draw
            ctx.globalCompositeOperation = "screen";
            for (var i = 0; i < listFire.length; i++) {
                var fire = listFire[i];
                ctx.globalAlpha = fire.alpha;
                ctx.beginPath();
                ctx.arc(fire.x, fire.y, fire.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = fire.fill;
                ctx.fill();
            }

            for (var i = 0; i < listFirework.length; i++) {
                var firework = listFirework[i];
                ctx.globalAlpha = firework.alpha;
                ctx.beginPath();
                ctx.arc(firework.x, firework.y, firework.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fillStyle = firework.fill;
                ctx.fill();
            }

            for (var i = 0; i < listSpecial.length; i++) {
                var special = listSpecial[i];
                ctx.globalAlpha = special.alpha;
                // ctx.beginPath();
                // ctx.arc(special.x, special.y, special.size, 0, Math.PI * 2);
                // ctx.closePath();
                // ctx.fill();
                ctx.fillStyle = special.fill;
                ctx.fillRect(
                    special.x - special.size,
                    special.y - special.size,
                    special.size * 2,
                    special.size * 2
                );
            }

            for (var i = 0; i < listSpark.length; i++) {
                var spark = listSpark[i];
                ctx.globalAlpha = spark.alpha;
                // ctx.beginPath();
                // ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2);
                // ctx.closePath();
                // ctx.fill();
                ctx.fillStyle = spark.fill;
                ctx.fillRect(
                    spark.x - spark.size,
                    spark.y - spark.size,
                    spark.size * 2,
                    spark.size * 2
                );
            }

            // light effect
            while (lights.length) {
                var light = lights.pop();
                var gradient = ctx.createRadialGradient(
                    light.x,
                    light.y,
                    0,
                    light.x,
                    light.y,
                    light.radius
                );
                gradient.addColorStop(0, "#fff");
                gradient.addColorStop(0.2, light.color);
                gradient.addColorStop(0.8, "rgba(0, 0, 0, 0)");
                gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.globalAlpha = light.alpha ? light.alpha : 0.25;
                ctx.fillStyle = gradient;
                ctx.fillRect(
                    light.x - light.radius,
                    light.y - light.radius,
                    light.radius * 2,
                    light.radius * 2
                );
            }

            // supprise: HAPPY LUNAR NEW YEAR 2017!
            for (var i = 0; i < listText.length; i++) {
                var text = listText[i];
                ctx.globalAlpha = text.alpha;
                ctx.fillStyle = text.fill;
                ctx.fillRect(
                    text.x - text.size,
                    text.y - text.size,
                    text.size * 2,
                    text.size * 2
                );
            }
        }
    });
};
