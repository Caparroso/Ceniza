(() => {
  "use strict";

  const config = window.CENIZA_CONFIG || {};
  const ticketStorageKey = "ceniza-al-grito-ticket-v1";
  const gate = document.querySelector("#gate");
  const ritual = document.querySelector("#ritual");
  const invitation = document.querySelector("#invitation");
  const weapon = document.querySelector("#weapon");
  const drum = document.querySelector("#drum");
  const impactFlash = document.querySelector("#impactFlash");
  const smoke = document.querySelector("#smoke");
  const logoChamber = document.querySelector("#logoChamber");
  const chamberLogo = document.querySelector("#chamberLogo");
  const introStatus = document.querySelector("#introStatus");
  const backgroundAudio = document.querySelector("#backgroundAudio");
  const shootAudio = document.querySelector("#shootAudio");
  const treeFilm = document.querySelector("#treeFilm");
  const registrationForm = document.querySelector("#registrationForm");
  const submitRegistration = document.querySelector("#submitRegistration");
  const formError = document.querySelector("#formError");
  const restoreTicket = document.querySelector("#restoreTicket");
  const ticketOverlay = document.querySelector("#ticketOverlay");
  const ticketControls = document.querySelector("#ticketControls");
  const cleanHint = document.querySelector("#cleanHint");
  const ticketName = document.querySelector("#ticketName");
  const ticketToken = document.querySelector("#ticketToken");
  const ticketQr = document.querySelector("#ticketQr");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const introBrands = [
    { name: "Ceniza", logo: "assets/logo-ceniza-light.png" },
    { name: "Estuche de Balatas", logo: "assets/logo-edb-light.png" },
  ];

  let audioContext;
  let drumAnimation;
  let drumRotation = 0;
  let sequenceTimers = [];
  let ticket = null;

  const clearSequence = () => {
    sequenceTimers.forEach(window.clearTimeout);
    sequenceTimers = [];
  };

  const getAudioContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioContext ||= new AudioContext();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    return audioContext;
  };

  const startBackgroundAudio = () => {
    backgroundAudio.volume = 0.34;
    if (backgroundAudio.paused) backgroundAudio.play().catch(() => {});
  };

  const playShootSound = () => {
    shootAudio.pause();
    shootAudio.currentTime = 0;
    shootAudio.volume = 0.94;
    shootAudio.play().catch(() => {});
  };

  const synthesizeCylinderTurn = () => {
    const context = getAudioContext();
    if (!context) return;
    const start = context.currentTime;
    [0, 0.075, 0.15, 0.235, 0.34].forEach((offset, index) => {
      const oscillator = context.createOscillator();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      const now = start + offset;
      oscillator.type = index % 2 ? "square" : "triangle";
      oscillator.frequency.setValueAtTime(1180 - index * 115, now);
      oscillator.frequency.exponentialRampToValueAtTime(310, now + 0.045);
      filter.type = "bandpass";
      filter.frequency.value = 1450;
      filter.Q.value = 2.8;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.075, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.055);
      oscillator.connect(filter).connect(gain).connect(context.destination);
      oscillator.start(now);
      oscillator.stop(now + 0.06);
    });
  };

  const setBrand = (index) => {
    const brand = introBrands[index];
    chamberLogo.src = brand.logo;
    chamberLogo.alt = brand.name;
    introStatus.textContent = brand.name;
    logoChamber.dataset.brand = index === 0 ? "ceniza" : "edb";
    logoChamber.classList.remove("is-detonating");
    logoChamber.classList.remove("is-hidden");
  };

  const fire = () => {
    weapon.classList.remove("is-firing");
    impactFlash.classList.remove("is-fired");
    smoke.classList.remove("is-active");
    logoChamber.classList.remove("is-detonating");
    void weapon.offsetWidth;
    weapon.classList.add("is-firing");
    impactFlash.classList.add("is-fired");
    smoke.classList.add("is-active");
    logoChamber.classList.add("is-detonating");
    playShootSound();
    sequenceTimers.push(window.setTimeout(() => logoChamber.classList.add("is-hidden"), 390));
    sequenceTimers.push(window.setTimeout(() => logoChamber.classList.remove("is-detonating"), 540));
  };

  const rotateDrum = (nextBrandIndex) => {
    logoChamber.classList.add("is-hidden");
    synthesizeCylinderTurn();
    const from = drumRotation;
    drumRotation += 60;
    drumAnimation?.cancel();
    drum.style.transform = `rotate(${drumRotation}deg)`;
    drumAnimation = drum.animate(
      [
        { transform: `rotate(${from}deg)` },
        { offset: 0.76, transform: `rotate(${drumRotation + 8}deg)` },
        { transform: `rotate(${drumRotation}deg)` },
      ],
      { duration: 640, easing: "cubic-bezier(0.18, 0.72, 0.2, 1)" },
    );
    sequenceTimers.push(window.setTimeout(() => setBrand(nextBrandIndex), 670));
  };

  const showInvitation = () => {
    clearSequence();
    drumAnimation?.cancel();
    gate.hidden = true;
    ritual.hidden = true;
    ritual.classList.remove("is-leaving");
    invitation.hidden = false;
    document.body.style.overflow = "";
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const normalizeName = (value) => value.replace(/\s+/g, " ").trim();

  const createTicketToken = () => {
    const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    const bytes = new Uint8Array(8);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  };

  const showFormError = (message) => {
    formError.textContent = message;
    formError.hidden = !message;
  };

  const updateRestoreButton = () => {
    restoreTicket.hidden = !ticket;
    if (ticket) restoreTicket.textContent = `VER MI ACCESO GUARDADO · ${ticket.token}`;
  };

  const renderTicket = async () => {
    if (!ticket) return;
    ticketName.textContent = ticket.name;
    ticketToken.textContent = ticket.token;
    ticketQr.alt = `Código QR del acceso ${ticket.token}`;
    const qrPayload = `${config.eventName || "MEX-í-CAN"}\n${config.eventDate || "11 SEP 2026 · 7:30 PM"}\nTOKEN: ${ticket.token}`;
    try {
      ticketQr.src = await window.QRCode.toDataURL(qrPayload, {
        errorCorrectionLevel: "H",
        margin: 2,
        width: 320,
        color: { dark: "#090704", light: "#eadfc9" },
      });
    } catch {
      ticketQr.removeAttribute("src");
    }
  };

  const showTicket = async () => {
    if (!ticket) return;
    await renderTicket();
    ticketOverlay.hidden = false;
    ticketOverlay.classList.remove("is-clean");
    ticketControls.hidden = false;
    cleanHint.hidden = true;
    document.body.style.overflow = "hidden";
  };

  const closeTicket = () => {
    ticketOverlay.hidden = true;
    ticketOverlay.classList.remove("is-clean");
    ticketControls.hidden = false;
    cleanHint.hidden = true;
    document.body.style.overflow = "";
  };

  const enterScreenshotMode = () => {
    ticketOverlay.classList.add("is-clean");
    ticketControls.hidden = true;
    cleanHint.hidden = false;
    window.setTimeout(() => {
      cleanHint.hidden = true;
    }, 2200);
  };

  const exitScreenshotMode = () => {
    ticketOverlay.classList.remove("is-clean");
    ticketControls.hidden = false;
    cleanHint.hidden = true;
  };

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (submitRegistration.disabled) return;
    showFormError("");

    const formData = new FormData(registrationForm);
    const name = normalizeName(String(formData.get("name") || ""));
    const instagram = String(formData.get("instagram") || "").trim();
    const gotcha = String(formData.get("_gotcha") || "");

    if (name.length < 2) {
      showFormError("Escribe el nombre que presentarás en la entrada.");
      return;
    }
    if (!config.formEndpoint) {
      showFormError("El registro todavía no tiene un destino configurado.");
      return;
    }

    const nextTicket = {
      name,
      instagram: instagram || undefined,
      token: createTicketToken(),
      registeredAt: new Date().toISOString(),
    };
    const submission = new FormData();
    submission.append("name", nextTicket.name);
    submission.append("instagram", nextTicket.instagram || "—");
    submission.append("access_token", nextTicket.token);
    submission.append("registered_at", nextTicket.registeredAt);
    submission.append("event", `${config.eventName} — ${config.eventDate}`);
    submission.append("location", config.locationName || "Magda San Ángel");
    submission.append("subject", `Nuevo acceso Ceniza · ${nextTicket.token}`);
    submission.append("_gotcha", gotcha);

    submitRegistration.disabled = true;
    submitRegistration.querySelector("span").textContent = "GENERANDO ACCESO…";
    try {
      const response = await fetch(config.formEndpoint, {
        method: "POST",
        body: submission,
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new Error("Registro rechazado");
      ticket = nextTicket;
      localStorage.setItem(ticketStorageKey, JSON.stringify(ticket));
      updateRestoreButton();
      registrationForm.reset();
      await showTicket();
    } catch {
      showFormError("No pudimos generar tu acceso. Revisa tu conexión e inténtalo otra vez.");
    } finally {
      submitRegistration.disabled = false;
      submitRegistration.querySelector("span").textContent = "GENERAR MI ACCESO";
    }
  };

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -10%", threshold: 0.08 },
  );

  document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

  if (treeFilm) {
    const mediaObserver = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        const source = treeFilm.querySelector("source[data-src]");
        if (source) {
          source.src = source.dataset.src;
          source.removeAttribute("data-src");
          treeFilm.load();
          treeFilm.play().catch(() => {});
        }
        mediaObserver.disconnect();
      },
      { rootMargin: "500px 0px" },
    );
    mediaObserver.observe(treeFilm);
  }

  const startRitual = () => {
    clearSequence();
    drumAnimation?.cancel();
    drumRotation = 0;
    drum.style.transform = "rotate(0deg)";
    ritual.classList.remove("is-leaving");
    weapon.classList.remove("is-firing");
    smoke.classList.remove("is-active");
    impactFlash.classList.remove("is-fired");
    logoChamber.classList.remove("is-detonating");
    logoChamber.classList.add("is-hidden");
    gate.hidden = true;
    invitation.hidden = true;
    ritual.hidden = false;
    document.body.style.overflow = "hidden";
    getAudioContext();
    startBackgroundAudio();

    if (prefersReducedMotion.matches) {
      showInvitation();
      return;
    }

    sequenceTimers.push(window.setTimeout(() => setBrand(0), 260));
    sequenceTimers.push(window.setTimeout(fire, 1180));
    sequenceTimers.push(window.setTimeout(() => rotateDrum(1), 1900));
    sequenceTimers.push(window.setTimeout(fire, 3430));
    sequenceTimers.push(window.setTimeout(() => ritual.classList.add("is-leaving"), 4210));
    sequenceTimers.push(window.setTimeout(showInvitation, 4830));
  };

  document.querySelector("#startExperience").addEventListener("click", startRitual);
  document.querySelector("#replayIntro").addEventListener("click", startRitual);
  registrationForm.addEventListener("submit", handleRegistration);
  restoreTicket.addEventListener("click", showTicket);
  document.querySelector("#screenshotMode").addEventListener("click", enterScreenshotMode);
  document.querySelector("#closeTicket").addEventListener("click", closeTicket);
  ticketOverlay.addEventListener("click", (event) => {
    if (ticketOverlay.classList.contains("is-clean")) {
      event.preventDefault();
      exitScreenshotMode();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !ticketOverlay.hidden) closeTicket();
    else if (event.key === "Escape" && !ritual.hidden) showInvitation();
  });

  try {
    const savedTicket = localStorage.getItem(ticketStorageKey);
    if (savedTicket) ticket = JSON.parse(savedTicket);
  } catch {
    localStorage.removeItem(ticketStorageKey);
  }

  updateRestoreButton();
  setBrand(0);
})();
