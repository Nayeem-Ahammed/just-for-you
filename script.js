/**
 * ==========================================================================
 * Romantic 1st Anniversary Web Application - Complete JavaScript Engine
 * Theme: Midnight Rose & Metallic Gold
 * ==========================================================================
 */

// ==========================================
// 1. Procedural Web Audio Engine
// ==========================================
class RomanticAudio {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.sequenceTimer = null;
    this.masterGain = null;
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  playNote(freq, time, duration = 1.2, type = 'sine') {
    if (!this.ctx || this.isMuted) return;
    const osc = this.ctx.createOscillator();
    const noteGain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, time);

    noteGain.gain.setValueAtTime(0.001, time);
    noteGain.gain.exponentialRampToValueAtTime(0.18, time + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(noteGain);
    noteGain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + duration);
  }

  startAmbientMusic() {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.isPlaying = true;

    const chordProgressions = [
      [277.18, 349.23, 415.30, 523.25], // Db Maj7
      [207.65, 311.13, 415.30, 493.88], // Ab add9
      [233.08, 277.18, 349.23, 440.00], // Bbm7
      [185.00, 277.18, 369.99, 440.00], // Gb Maj
    ];

    let chordIdx = 0;
    let noteStep = 0;

    const tick = () => {
      if (!this.isPlaying) return;
      const now = this.ctx.currentTime;
      const currentChord = chordProgressions[chordIdx];
      const noteFreq = currentChord[noteStep % currentChord.length];

      this.playNote(noteFreq, now, 1.8, 'sine');
      if (noteStep % 2 === 0) {
        this.playNote(noteFreq * 2, now + 0.08, 0.9, 'triangle');
      }

      noteStep++;
      if (noteStep >= currentChord.length * 2) {
        noteStep = 0;
        chordIdx = (chordIdx + 1) % chordProgressions.length;
      }

      this.sequenceTimer = setTimeout(tick, 450);
    };

    tick();
  }

  playBurstChime() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const chimes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    chimes.forEach((freq, idx) => {
      this.playNote(freq, now + idx * 0.09, 2.2, 'triangle');
    });
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.22, this.ctx.currentTime);
    }
    return !this.isMuted;
  }
}

// ==========================================
// 2. High-Performance Particle Burst Engine
// ==========================================
class ParticleBurstSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.ambientParticles = [];
    this.animationFrameId = null;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initAmbientParticles();
    this.startLoop();
  }

  resize() {
    this.canvas.width = window.innerWidth * window.devicePixelRatio;
    this.canvas.height = window.innerHeight * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  initAmbientParticles() {
    const count = 30;
    for (let i = 0; i < count; i++) {
      this.ambientParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.4 + 0.1,
        speedY: Math.random() * -0.3 - 0.1,
        speedX: (Math.random() - 0.5) * 0.2,
        color: Math.random() > 0.5 ? '#d8b36a' : '#e8a8b8',
      });
    }
  }

  triggerBurst(originX, originY) {
    const x = originX || window.innerWidth / 2;
    const y = originY || window.innerHeight / 2;
    const count = 135;
    const colors = ['#d8b36a', '#e8a8b8', '#6f3048', '#fff4e8', '#ff7b90'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 3;
      const type = Math.random() < 0.35 ? 'heart' : Math.random() < 0.65 ? 'petal' : 'confetti';

      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        type,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 12 + 6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.16,
        friction: 0.98,
        alpha: 1,
        decay: Math.random() * 0.012 + 0.007,
      });
    }
  }

  drawHeart(ctx, x, y, size, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    const topCurveHeight = size * 0.3;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
    ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, (size + topCurveHeight) / 1.4, 0, size);
    ctx.bezierCurveTo(0, (size + topCurveHeight) / 1.4, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
    ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawPetal(ctx, x, y, size, color, alpha, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.4, size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  updateAndDraw() {
    this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    this.ambientParticles.forEach((p) => {
      p.y += p.speedY;
      p.x += p.speedX;
      if (p.y < 0) p.y = window.innerHeight;
      if (p.x < 0) p.x = window.innerWidth;
      if (p.x > window.innerWidth) p.x = 0;

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      if (p.type === 'heart') {
        this.drawHeart(this.ctx, p.x, p.y, p.size, p.color, p.alpha);
      } else if (p.type === 'petal') {
        this.drawPetal(this.ctx, p.x, p.y, p.size, p.color, p.alpha, p.rotation);
      } else {
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.globalAlpha = p.alpha;
        this.ctx.fillStyle = p.color;
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size * 0.5);
        this.ctx.restore();
      }
    }

    this.animationFrameId = requestAnimationFrame(() => this.updateAndDraw());
  }

  startLoop() {
    if (!this.animationFrameId) {
      this.updateAndDraw();
    }
  }
}

window.romanticAudio = new RomanticAudio();

// ==========================================
// Section 1: The Opening Experience
// ==========================================
function initOpeningSection() {
  const canvas = document.getElementById('particle-canvas');
  const btnBegin = document.getElementById('btn-begin-journey');
  const introState = document.getElementById('intro-state');
  const countdownState = document.getElementById('countdown-state');
  const countdownNum = document.getElementById('countdown-number');
  const revealState = document.getElementById('reveal-state');
  const btnScroll = document.getElementById('btn-scroll-story');

  if (canvas) {
    window.particleSystem = new ParticleBurstSystem(canvas);
  }

  if (!btnBegin) return;

  btnBegin.addEventListener('click', () => {
    window.romanticAudio.startAmbientMusic();
    const floatingBtn = document.getElementById('fixed-audio-toggle');
    if (floatingBtn) floatingBtn.classList.remove('muted');

    if (introState) introState.style.display = 'none';
    if (countdownState) countdownState.style.display = 'flex';

    let count = 3;
    if (countdownNum) countdownNum.textContent = count;

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        if (countdownNum) {
          countdownNum.textContent = count;
          countdownNum.style.animation = 'none';
          void countdownNum.offsetWidth;
          countdownNum.style.animation = 'countdownPop 0.95s cubic-bezier(0.16, 1, 0.3, 1) forwards';
        }
      } else {
        clearInterval(interval);
        if (countdownState) countdownState.style.display = 'none';
        if (revealState) revealState.style.display = 'flex';

        window.romanticAudio.playBurstChime();
        if (window.particleSystem) {
          window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight * 0.45);
          setTimeout(() => {
            window.particleSystem.triggerBurst(window.innerWidth * 0.3, window.innerHeight * 0.4);
          }, 350);
          setTimeout(() => {
            window.particleSystem.triggerBurst(window.innerWidth * 0.7, window.innerHeight * 0.4);
          }, 700);
        }
      }
    }, 1000);
  });

  if (btnScroll) {
    btnScroll.addEventListener('click', () => {
      const nextSection = document.getElementById('section-story');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// ==========================================
// 20 Deep, Romantic Reasons Array
// ==========================================
const romanticReasons = [
    "You Never Support What Is Wrong <br> You never stay silent just because everyone else does. When something is wrong, you speak up. Even when others choose to remain quiet, you have the courage to stand against what isn't right. <br> That's something I deeply admire about you. <blockquote>I love your heart—not only because it loves me, but because it knows what is right. </blockquote>",
    "Your infinite patience with me, and how we always choose to understand each other and grow together.",
    "How thoughtful you are, remembering tiny details I offhandedly mentioned months ago.",
    "How fiercely loyal and protective you are of the people and values you cherish with all your heart.",

    "Maybe the world has its own definition of beauty. I don't care. Because when I look at you, I see the most beautiful woman I've ever known. Your face, your smile, your eyes, the little expressions you make— <br> <b>everything about you is beautiful to me.</b> <blockquote>You Are Beautiful. To Me, Unbelievably Beautiful.</blockquote>",
    "Before you, life was simply life. Then you came into it, and suddenly there were more reasons to smile, more memories to make, and someone to dream about tomorrow with. You didn't just become a part of my life. <br> <b>You made my life feel more beautiful.</b> <blockquote>You Made My Life Beautiful</blockquote>",
    "<blockquote>You held my hand when I had nothing to give, and I promise to hold yours for everything that comes next.</blockquote>",
    "The effortless way your laughter turns my most stressful days into warmth and sunshine.",
    "Your kindness to everyone you meet, constantly showing me what pure, genuine compassion looks like.",
    "The comfort of resting my head against your shoulder while we dream out loud about our future.",
    "Because marrying you is, and will forever be, the single greatest decision of my entire life.",
    "Because with you, my love, 'forever' doesn't sound nearly long enough.",
    "Your love isn't only something I hear; it's something I feel in all the little things you do", 
    "Because You Love Me So Much <br> You Care Me Very Much..",
    "You Trust Me!",
    "I don't love a perfect version of you. I love you—the real you—and that's more than enough for me.",
    "The another reason is : <blockquote>No Reasion..!!</blockquote>"
];

// ==========================================
// Section 2: Timeline Intersection Observer
// ==========================================
function initTimelineScroll() {
  const timelineSection = document.getElementById('section-story');
  const timelineProgress = document.getElementById('timeline-progress');
  const timelineItems = document.querySelectorAll('.timeline-item');

  if (!timelineSection || !timelineItems.length) return;

  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  timelineItems.forEach((item) => itemObserver.observe(item));

  if (timelineProgress) {
    const updateProgressLine = () => {
      const rect = timelineSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const startOffset = viewportHeight * 0.7;
      const totalHeight = rect.height;
      const scrolled = startOffset - rect.top;
      
      let percentage = (scrolled / totalHeight) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      timelineProgress.style.height = `${percentage}%`;
    };

    window.addEventListener('scroll', updateProgressLine, { passive: true });
    updateProgressLine();
  }
}

// ==========================================
// Section 3: Reasons I Love You Reveal
// ==========================================
function initReasonsReveal() {
  const btnGiveReason = document.getElementById('btn-give-reason');
  const reasonCard = document.getElementById('reason-card');
  const reasonNumber = document.getElementById('reason-number');
  const reasonText = document.getElementById('reason-text');

  if (!btnGiveReason || !reasonCard || !reasonText || !reasonNumber) return;

  let currentReasonIndex = 0;

  const showNextReason = (e) => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * romanticReasons.length);
    } while (nextIndex === currentReasonIndex && romanticReasons.length > 1);

    currentReasonIndex = nextIndex;
    const formattedNum = String(currentReasonIndex + 1).padStart(2, '0');

    reasonCard.style.animation = 'none';
    void reasonCard.offsetWidth;
    reasonCard.style.animation = 'reasonEntry 0.65s cubic-bezier(0.16, 1, 0.3, 1) forwards';

    reasonNumber.textContent = `#${formattedNum}`;
    reasonText.innerHTML = `"${romanticReasons[currentReasonIndex]}"`;

    if (window.particleSystem) {
      const rect = e.currentTarget.getBoundingClientRect();
      window.particleSystem.triggerBurst(rect.left + rect.width / 2, rect.top);
    }
  };

  btnGiveReason.addEventListener('click', showNextReason);
}

// ==========================================
// Section 4: Polaroid Gallery & Photo Modal
// ==========================================
function initScrapbookModal() {
  const modalBackdrop = document.getElementById('photo-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDate = document.getElementById('modal-date');
  const modalDesc = document.getElementById('modal-desc');
  const polaroids = document.querySelectorAll('.polaroid-card');

  if (!modalBackdrop || !polaroids.length) return;

  const openModal = (card) => {
    const imgEl = card.querySelector('.polaroid-img');
    const titleEl = card.querySelector('.polaroid-title');
    const dateEl = card.querySelector('.polaroid-date');
    const fullDesc = card.getAttribute('data-full-memory') || card.querySelector('.polaroid-desc')?.textContent;

    if (modalImg && imgEl) modalImg.src = imgEl.src;
    if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent;
    if (modalDate && dateEl) modalDate.textContent = dateEl.textContent;
    if (modalDesc) modalDesc.textContent = fullDesc;

    modalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  polaroids.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('active')) {
      closeModal();
    }
  });
}

// ==========================================
// Floating Audio Toggle Button (🎵)
// ==========================================
function initFloatingAudioControl() {
  const floatingBtn = document.getElementById('fixed-audio-toggle');
  if (!floatingBtn) return;

  floatingBtn.addEventListener('click', () => {
    if (window.romanticAudio) {
      const isAudible = window.romanticAudio.toggleMute();
      floatingBtn.classList.toggle('muted', !isAudible);
      const textSpan = floatingBtn.querySelector('.audio-label');
      if (textSpan) {
        textSpan.textContent = isAudible ? 'Melody Playing' : 'Music Muted';
      }
    } else {
      floatingBtn.classList.toggle('muted');
    }
  });
}

// ==========================================
// Section 5: Animated Traveling Heart on S-Curve Path
// ==========================================
function initTravelingHeartRoute() {
  const container = document.getElementById('route-visual-area');
  const heartBadge = document.getElementById('traveling-heart-badge');
  const mobilePath = document.getElementById('mobile-path');
  const desktopPath = document.getElementById('desktop-path');
  const mobileSvg = document.querySelector('.route-svg-mobile');
  const desktopSvg = document.querySelector('.route-svg-desktop');

  if (!container || !heartBadge || (!mobilePath && !desktopPath)) return;

  const duration = 7000; // 7s one-way trip

  function animate(timestamp) {
    const isMobile = window.innerWidth < 768;
    const activePath = isMobile ? (mobilePath || desktopPath) : (desktopPath || mobilePath);
    const activeSvg = isMobile ? (mobileSvg || desktopSvg) : (desktopSvg || mobileSvg);

    if (activePath && activeSvg) {
      try {
        const totalLength = activePath.getTotalLength();
        if (totalLength > 0) {
          const cycle = (timestamp % (duration * 2)) / (duration * 2);
          const factor = 0.5 - Math.cos(cycle * 2 * Math.PI) * 0.5;
          
          const currentLength = factor * totalLength;
          const pt = activePath.getPointAtLength(currentLength);

          const svgRect = activeSvg.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const viewBox = activeSvg.viewBox.baseVal;

          if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
            const scaleX = svgRect.width / viewBox.width;
            const scaleY = svgRect.height / viewBox.height;
            const posX = (svgRect.left - containerRect.left) + (pt.x * scaleX);
            const posY = (svgRect.top - containerRect.top) + (pt.y * scaleY);

            heartBadge.style.left = `${posX}px`;
            heartBadge.style.top = `${posY}px`;
          }
        }
      } catch (e) {
        // Safe fallback during render init
      }
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

// ==========================================
// Section 6: Interactive Envelope & Typewriter Effect
// ==========================================
const romanticLetterText = `My Love (wife),

One year ago today, I made a promise to love you, cherish you, and stand by your side through every chapter of this life. Looking back at our first 365 days together, you have made our home the warmest, happiest place I have ever known.

Thank you for your endless patience, your gentle laughter that brightens even my darkest days, and the way your hand fits perfectly in mine. Every memory we've created—from our quiet Sunday mornings to our late-night drives—has shown me that true love is found in the simplest moments shared with you.

No matter where life takes us, you will forever be my favorite adventure, my quiet solace, and my greatest blessing.
You held my hand when I had nothing to offer, and that kind of loyalty changed how I see the world. I promise you today——I will always honor and protect the trust, respect, and love you've given me.

Happy 1st Anniversary, my love.
Yours forever & always,
Your Loving Husband ❤️`;


function initLetterTypewriter() {
  const openBtn = document.getElementById('btn-open-letter');
  const sealBtn = document.getElementById('envelope-seal');
  const envelopeCard = document.getElementById('envelope-card');
  const parchmentLetter = document.getElementById('parchment-letter');
  const letterTextContainer = document.getElementById('parchment-text');
  const cursorSpan = document.getElementById('typewriter-cursor');

  if (!openBtn || !parchmentLetter || !letterTextContainer) return;

  let isTyping = false;
  let hasTyped = false;

  const typeLetter = () => {
    if (isTyping || hasTyped) return;
    isTyping = true;
    hasTyped = true;

    if (envelopeCard) envelopeCard.style.display = 'none';
    parchmentLetter.classList.add('open');

    if (window.romanticAudio?.playBurstChime) {
      window.romanticAudio.playBurstChime();
    }

    let charIndex = 0;
    letterTextContainer.textContent = '';
    if (cursorSpan) cursorSpan.style.display = 'inline-block';

    const typeInterval = setInterval(() => {
      if (charIndex < romanticLetterText.length) {
        letterTextContainer.textContent += romanticLetterText.charAt(charIndex);
        charIndex++;
      } else {
        clearInterval(typeInterval);
        isTyping = false;
      }
    }, 28);
  };

  openBtn.addEventListener('click', typeLetter);
  if (sealBtn) sealBtn.addEventListener('click', typeLetter);
}

// ==========================================
// Section 7: "If I Could Go Back..." Hearts Explosion
// ==========================================
function initChoiceConfetti() {
  const chooseBtn = document.getElementById('btn-choose-yes');
  const responseSubtext = document.getElementById('choice-response-subtext');

  if (!chooseBtn) return;

  chooseBtn.addEventListener('click', () => {
    if (responseSubtext) {
      responseSubtext.classList.add('visible');
    }
    chooseBtn.innerHTML = '<span>YES, IN EVERY LIFETIME ❤️</span>';

    if (window.romanticAudio?.playBurstChime) {
      window.romanticAudio.playBurstChime();
    }

    if (window.particleSystem) {
      window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight * 0.5);
    }

    const heartSymbols = ['❤️', '💖', '💕', '💗', '✨', '💍'];
    for (let i = 0; i < 60; i++) {
      const heart = document.createElement('div');
      heart.textContent = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
      heart.style.position = 'fixed';
      heart.style.zIndex = '999';
      heart.style.pointerEvents = 'none';
      heart.style.left = `${Math.random() * 100}vw`;
      heart.style.top = `${Math.random() * 100}vh`;
      heart.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
      heart.style.opacity = '1';
      heart.style.transition = 'all 2s ease-out';

      document.body.appendChild(heart);

      setTimeout(() => {
        heart.style.transform = `translateY(-${Math.random() * 150 + 50}px) scale(${Math.random() * 0.5 + 0.8})`;
        heart.style.opacity = '0';
      }, 50);

      setTimeout(() => heart.remove(), 2100);
    }
  });
}

// ==========================================
// Section 8: 365 Days of Us Counter Stats
// ==========================================
function initCounterStats() {
  const statsSection = document.getElementById('section-stats');
  if (!statsSection) return;

  const statDays = document.getElementById('stat-days');
  const statHours = document.getElementById('stat-hours');
  const statMinutes = document.getElementById('stat-minutes');

  let hasAnimated = false;

  const animateNumber = (element, targetValue, duration = 2200) => {
    if (!element) return;
    const startValue = 0;
    const startTime = performance.now();

    const step = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(startValue + (targetValue - startValue) * ease);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = targetValue.toLocaleString();
      }
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateNumber(statDays, 365, 2000);
        animateNumber(statHours, 8760, 2400);
        animateNumber(statMinutes, 525600, 2600);
      }
    });
  }, { threshold: 0.25 });

  observer.observe(statsSection);
}

// ==========================================
// Section 9: Memory Bubbles Modal
// ==========================================
function initMemoryBubblesModal() {
  const memoryModal = document.getElementById('memory-modal');
  const closeBtn = document.getElementById('btn-close-memory');
  const modalIcon = document.getElementById('memory-modal-icon');
  const modalTitle = document.getElementById('memory-modal-title');
  const modalDate = document.getElementById('memory-modal-date');
  const modalDesc = document.getElementById('memory-modal-desc');
  const bubbles = document.querySelectorAll('.memory-bubble');

  if (!memoryModal || !bubbles.length) return;

  const openMemory = (bubble) => {
    const icon = bubble.getAttribute('data-icon') || '💖';
    const title = bubble.getAttribute('data-title') || 'A Sweet Memory';
    const date = bubble.getAttribute('data-date') || 'Cherished Moment';
    const story = bubble.getAttribute('data-story') || '';

    if (modalIcon) modalIcon.textContent = icon;
    if (modalTitle) modalTitle.textContent = title;
    if (modalDate) modalDate.textContent = date;
    if (modalDesc) modalDesc.textContent = `"${story}"`;

    memoryModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeMemory = () => {
    memoryModal.classList.remove('active');
    document.body.style.overflow = '';
  };

  bubbles.forEach((b) => {
    b.addEventListener('click', () => openMemory(b));
  });

  if (closeBtn) closeBtn.addEventListener('click', closeMemory);

  memoryModal.addEventListener('click', (e) => {
    if (e.target === memoryModal) closeMemory();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && memoryModal.classList.contains('active')) {
      closeMemory();
    }
  });
}

// ==========================================
// Section 10: Future Roadmap Chapters
// ==========================================
function initRoadmapChapters() {
  const chapterCards = document.querySelectorAll('.chapter-card');
  if (!chapterCards.length) return;

  chapterCards.forEach((card) => {
    card.addEventListener('click', () => {
      chapterCards.forEach((c) => c.classList.remove('active'));
      card.classList.add('active');

      if (window.romanticAudio?.playBurstChime) {
        window.romanticAudio.playBurstChime();
      }
    });
  });
}

// ==========================================
// Section 11: Replay Our Story
// ==========================================
function initReplayStory() {
  const replayBtn = document.getElementById('btn-replay-story');
  if (!replayBtn) return;

  replayBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    const introState = document.getElementById('intro-state');
    const countdownState = document.getElementById('countdown-state');
    const revealState = document.getElementById('reveal-state');

    setTimeout(() => {
      if (introState && countdownState && revealState) {
        countdownState.style.display = 'none';
        revealState.style.display = 'none';
        introState.style.display = 'flex';
      }
      if (window.particleSystem) {
        window.particleSystem.triggerBurst(window.innerWidth / 2, window.innerHeight * 0.4);
      }
    }, 700);
  });
}

// ==========================================
// Master Initializer on DOM Load
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initOpeningSection();
  initTimelineScroll();
  initReasonsReveal();
  initScrapbookModal();
  initFloatingAudioControl();
  initTravelingHeartRoute();
  initLetterTypewriter();
  initChoiceConfetti();
  initCounterStats();
  initMemoryBubblesModal();
  initRoadmapChapters();
  initReplayStory();
});