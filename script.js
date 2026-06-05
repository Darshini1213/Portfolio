/* Portfolio — professional motion & interactions */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const isNarrow = window.innerWidth <= 768;
  const useCustomCursor = !prefersReducedMotion && !isCoarsePointer && !isNarrow;
  const hasGsap = typeof gsap !== "undefined";
  const hasST = hasGsap && typeof ScrollTrigger !== "undefined";

  const cursorDot = document.querySelector(".cursor-dot");
  const cursorRing = document.querySelector(".cursor-ring");
  const themeToggle = document.getElementById("theme-toggle");
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const pageLoader = document.getElementById("page-loader");
  const loaderFill = document.getElementById("loader-fill");
  const scrollProgress = document.getElementById("scroll-progress");

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  /* ---------- Split hero characters ---------- */
  function splitHeroText() {
    document.querySelectorAll("[data-split]").forEach((el) => {
      const text = el.textContent;
      el.setAttribute("aria-label", text);
      el.innerHTML = text
        .split("")
        .map((ch) =>
          ch === " "
            ? '<span class="char">&nbsp;</span>'
            : `<span class="char" aria-hidden="true">${ch}</span>`
        )
        .join("");
    });
  }

  /* ---------- Page loader ---------- */
  function initLoader(onComplete) {
    if (!pageLoader || prefersReducedMotion) {
      document.body.classList.remove("is-loading");
      if (onComplete) onComplete();
      return;
    }

    document.body.classList.add("is-loading");
    let progress = 0;

    const tick = setInterval(() => {
      progress += Math.random() * 18 + 8;
      if (progress >= 100) {
        progress = 100;
        clearInterval(tick);
        if (loaderFill) loaderFill.style.width = "100%";

        setTimeout(() => {
          pageLoader.classList.add("is-done");
          document.body.classList.remove("is-loading");
          if (onComplete) onComplete();
        }, 350);
      } else if (loaderFill) {
        loaderFill.style.width = `${progress}%`;
      }
    }, 80);
  }

  /* ---------- Scroll progress ---------- */
  function initScrollProgress() {
    if (!scrollProgress) return;

    function update() {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      scrollProgress.style.width = `${pct}%`;
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (!useCustomCursor || !cursorDot || !cursorRing) return;

    document.body.classList.add("custom-cursor");

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    document.addEventListener("mousedown", () => cursorRing.classList.add("is-click"));
    document.addEventListener("mouseup", () => cursorRing.classList.remove("is-click"));

    function tick() {
      dotX += (mouseX - dotX) * 0.55;
      dotY += (mouseY - dotY) * 0.55;
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(tick);
    }
    tick();

    document
      .querySelectorAll(
        "a, button, .work-card, .skill-tag, .contact-link, .highlight-card, .btn-primary, .btn-secondary, .social-link"
      )
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursorRing.classList.add("is-hover"));
        el.addEventListener("mouseleave", () => cursorRing.classList.remove("is-hover"));
      });
  }

  /* ---------- Magnetic buttons ---------- */
  function initMagnetic() {
    if (prefersReducedMotion || isCoarsePointer) return;

    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        if (hasGsap) {
          gsap.to(btn, { x: x * 0.2, y: y * 0.2, duration: 0.3, ease: "power2.out" });
        } else {
          btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        }
      });
      btn.addEventListener("mouseleave", () => {
        if (hasGsap) gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.5)" });
        else btn.style.transform = "";
      });
    });
  }

  /* ---------- 3D tilt cards ---------- */
  function initTiltCards() {
    if (prefersReducedMotion || isCoarsePointer) return;

    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = -y * 10;
        const rotateY = x * 10;

        card.style.setProperty("--shine-x", `${(e.clientX - rect.left) / rect.width * 100}%`);
        card.style.setProperty("--shine-y", `${(e.clientY - rect.top) / rect.height * 100}%`);

        if (hasGsap) {
          gsap.to(card, {
            rotateX,
            rotateY,
            transformPerspective: 900,
            duration: 0.4,
            ease: "power2.out",
          });
        } else {
          card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
      });

      card.addEventListener("mouseleave", () => {
        if (hasGsap) {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
        } else {
          card.style.transform = "";
        }
      });
    });
  }

  /* ---------- Stat counters ---------- */
  function initCounters() {
    if (!hasST) return;

    document.querySelectorAll(".stat-number[data-count]").forEach((el) => {
      const target = parseInt(el.getAttribute("data-count"), 10);
      const suffix = el.getAttribute("data-suffix") || "";

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          const counter = { val: 0 };
          gsap.to(counter, {
            val: target,
            duration: 1.8,
            ease: "power2.out",
            onUpdate: () => {
              el.textContent = Math.round(counter.val) + suffix;
            },
          });
        },
      });
    });
  }

  /* ---------- Theme ---------- */
  function initTheme() {
    if (!themeToggle) return;
    const icon = themeToggle.querySelector("i");
    const saved = localStorage.getItem("theme") || "dark";

    function applyTheme(theme) {
      if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
        icon?.classList.replace("fa-moon", "fa-sun");
      } else {
        document.documentElement.removeAttribute("data-theme");
        icon?.classList.replace("fa-sun", "fa-moon");
      }
    }

    applyTheme(saved);

    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
      if (hasGsap) gsap.fromTo("body", { opacity: 0.94 }, { opacity: 1, duration: 0.4 });
    });
  }

  /* ---------- Code typewriter ---------- */
  function initCodeAnimation() {
    const codeOutput = document.getElementById("code-output");
    if (!codeOutput) return;

    const lines = [
      `<span class="kw">const</span> developer = {`,
      `  <span class="prop">name</span>: <span class="str">"Venkata Darshini"</span>,`,
      `  <span class="prop">role</span>: <span class="str">"Full Stack Developer"</span>,`,
      `  <span class="prop">stack</span>: [<span class="str">"React"</span>, <span class="str">"Node"</span>, <span class="str">"ML"</span>],`,
      `  <span class="prop">available</span>: <span class="bool">true</span>`,
      `};`,
      ``,
      `developer.<span class="fn">ship</span>(<span class="str">"impactful products"</span>);`,
    ];

    let i = 0;
    function typeLine() {
      if (i < lines.length) {
        codeOutput.innerHTML += (i > 0 ? "\n" : "") + lines[i];
        i += 1;
        setTimeout(typeLine, i === 1 ? 300 : 100);
      } else {
        codeOutput.innerHTML += `\n<span class="cursor-blink">|</span>`;
      }
    }
    setTimeout(typeLine, 900);
  }

  /* ---------- Role rotation ---------- */
  function initRoleRotation() {
    const roleText = document.getElementById("role-text");
    if (!roleText) return;

    const roles = [
      "Building AI Solutions",
      "Crafting Full-Stack Apps",
      "Engineering ML Systems",
      "Designing User Experiences",
    ];
    let idx = 0;

    setInterval(() => {
      if (hasGsap && !prefersReducedMotion) {
        gsap.to(roleText, {
          opacity: 0,
          y: -10,
          duration: 0.22,
          onComplete: () => {
            idx = (idx + 1) % roles.length;
            roleText.textContent = roles[idx];
            gsap.fromTo(roleText, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" });
          },
        });
      } else {
        idx = (idx + 1) % roles.length;
        roleText.textContent = roles[idx];
      }
    }, 3200);
  }

  /* ---------- Nav ---------- */
  function initNav() {
    window.addEventListener("scroll", () => {
      navbar?.classList.toggle("scrolled", window.scrollY > 40);
    });

    hamburger?.addEventListener("click", () => mobileMenu?.classList.toggle("open"));

    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
      let current = "home";
      sections.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 120) current = s.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
      });
    });
  }

  window.closeMenu = function closeMenu() {
    mobileMenu?.classList.remove("open");
  };

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const href = anchor.getAttribute("href");
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        closeMenu();
        const top = target.getBoundingClientRect().top + window.scrollY - 72;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
      });
    });
  }

  function initForm() {
    const form = document.getElementById("contact-form");
    const response = document.getElementById("form-response");
    if (!form || !response) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      response.className = "form-response";
      response.style.display = "block";
      response.textContent = "Sending…";
      setTimeout(() => {
        response.className = "form-response success";
        response.textContent = "Message sent! I'll get back to you soon.";
        form.reset();
        setTimeout(() => { response.style.display = "none"; }, 5000);
      }, 700);
    });
  }

  /* ---------- GSAP motion system ---------- */
  function initGSAP() {
    if (!hasST) return;
    gsap.registerPlugin(ScrollTrigger);

    /* Nav entrance */
    gsap.from(".nav-logo, .nav-link, .theme-toggle, .hamburger", {
      y: -24,
      opacity: 0,
      duration: 0.7,
      stagger: 0.06,
      ease: "power3.out",
      delay: 0.1,
    });

    /* Hero character reveal */
    const heroChars = document.querySelectorAll(".hero-word .char");
    if (heroChars.length) {
      gsap.from(heroChars, {
        y: "110%",
        opacity: 0,
        duration: 0.85,
        stagger: 0.025,
        ease: "power4.out",
        delay: 0.35,
      });
    }

    gsap.from(".hero-label", {
      x: -20,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      delay: 0.2,
    });

    gsap.from(".hero-subtitle", {
      y: 28,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
      delay: 0.75,
    });

    gsap.from(".hero-roles, .hero-cta, .hero-socials", {
      y: 32,
      opacity: 0,
      duration: 0.7,
      stagger: 0.12,
      ease: "power3.out",
      delay: 0.9,
    });

    gsap.from(".code-card", {
      x: 80,
      opacity: 0,
      rotateY: -12,
      duration: 1.1,
      ease: "power3.out",
      delay: 0.5,
    });

    gsap.from(".scroll-indicator", {
      opacity: 0,
      y: 16,
      duration: 0.6,
      delay: 1.4,
    });

    /* Parallax blobs */
    gsap.to(".mesh-blob-1", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 },
      y: 180,
      x: 40,
    });

    gsap.to(".mesh-blob-2", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 },
      y: -120,
      x: -30,
    });

    gsap.to(".orb-1", {
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 },
      y: 100,
    });

    /* Section headers — line draw */
    document.querySelectorAll(".section-header").forEach((header) => {
      const line = header.querySelector(".header-line");
      const kids = header.querySelectorAll(".section-num, .section-tag, h2, .header-subtitle");

      gsap.from(kids, {
        scrollTrigger: { trigger: header, start: "top 85%" },
        y: 40,
        opacity: 0,
        duration: 0.75,
        stagger: 0.08,
        ease: "power3.out",
      });

      if (line) {
        gsap.from(line, {
          scrollTrigger: { trigger: header, start: "top 85%" },
          scaleX: 0,
          duration: 0.8,
          ease: "power3.inOut",
        });
      }
    });

    /* Work cards */
    gsap.from(".work-card", {
      scrollTrigger: { trigger: ".work-grid", start: "top 78%" },
      y: 70,
      opacity: 0,
      duration: 0.75,
      stagger: 0.14,
      ease: "power3.out",
    });

    /* Skills — scale in */
    gsap.from(".skill-group", {
      scrollTrigger: { trigger: ".skills-container", start: "top 78%" },
      scale: 0.92,
      y: 36,
      opacity: 0,
      duration: 0.6,
      stagger: 0.09,
      ease: "back.out(1.4)",
    });

    /* About */
    gsap.from(".about-text p", {
      scrollTrigger: { trigger: ".about-grid", start: "top 78%" },
      x: -36,
      opacity: 0,
      duration: 0.65,
      stagger: 0.12,
      ease: "power2.out",
    });

    gsap.from(".highlight-card", {
      scrollTrigger: { trigger: ".about-highlights", start: "top 82%" },
      x: 40,
      opacity: 0,
      duration: 0.65,
      stagger: 0.15,
      ease: "power3.out",
    });

    gsap.from(".stat-card", {
      scrollTrigger: { trigger: ".about-stats", start: "top 85%" },
      y: 28,
      opacity: 0,
      duration: 0.55,
      stagger: 0.1,
      ease: "power2.out",
    });

    /* Contact */
    gsap.from(".contact-link", {
      scrollTrigger: { trigger: ".contact-links", start: "top 80%" },
      x: -50,
      opacity: 0,
      duration: 0.55,
      stagger: 0.12,
      ease: "power2.out",
    });

    gsap.from(".contact-form .form-group, .contact-form .btn-primary", {
      scrollTrigger: { trigger: ".contact-form", start: "top 80%" },
      y: 28,
      opacity: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: "power2.out",
    });

    /* Footer */
    gsap.from(".footer", {
      scrollTrigger: { trigger: ".footer", start: "top 95%" },
      opacity: 0,
      y: 20,
      duration: 0.6,
    });
  }

  function boot() {
    splitHeroText();
    initScrollProgress();
    initCursor();
    initTheme();
    initNav();
    initSmoothScroll();
    initForm();
    initMagnetic();
    initTiltCards();

    initLoader(() => {
      initCodeAnimation();
      initRoleRotation();
      initGSAP();
      initCounters();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
