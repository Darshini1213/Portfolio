// ---- TERMINAL TYPING ANIMATION ----
const termLines = [
  { text: `<span class="t-comment">// venkata.js — about me</span>` },
  { text: `` },
  { text: `<span class="t-keyword">const</span> <span class="t-prop">developer</span> <span class="t-bracket">= {</span>` },
  { text: `  <span class="t-prop">name</span><span class="t-bracket">:</span>    <span class="t-string">"Venkata Darshini"</span><span class="t-bracket">,</span>` },
  { text: `  <span class="t-prop">role</span><span class="t-bracket">:</span>    <span class="t-string">"Full Stack Dev"</span><span class="t-bracket">,</span>` },
  { text: `  <span class="t-prop">focus</span><span class="t-bracket">:</span>   <span class="t-string">"ML Engineering"</span><span class="t-bracket">,</span>` },
  { text: `  <span class="t-prop">skills</span><span class="t-bracket">: [</span><span class="t-string">"React"</span><span class="t-bracket">,</span> <span class="t-string">"Node"</span><span class="t-bracket">,</span> <span class="t-string">"AI"</span><span class="t-bracket">],</span>` },
  { text: `  <span class="t-prop">open</span><span class="t-bracket">:</span>    <span class="t-value">true</span> <span class="t-comment">// to opportunities</span>` },
  { text: `<span class="t-bracket">};</span>` },
  { text: `` },
  { text: `<span class="t-prop">developer</span><span class="t-bracket">.</span><span class="t-keyword">build</span><span class="t-bracket">(</span><span class="t-string">"the future"</span><span class="t-bracket">);</span>` },
];
const termEl = document.getElementById("terminal-code");
let li = 0;
function typeTerminal() {
  if (li < termLines.length) {
    termEl.innerHTML += (li > 0 ? "\n" : "") + termLines[li].text;
    li++;
    setTimeout(typeTerminal, li === 1 ? 300 : 200);
  }
}
setTimeout(typeTerminal, 800);

// ---- TYPING ANIMATION ----
const roles = [
  "CSE Student",
  "Full Stack Developer",
  "Aspiring ML Engineer",
  "React & Node.js Dev"
];
let rIdx = 0, cIdx = 0, deleting = false;
const typedEl = document.getElementById("typed");

function type() {
  const current = roles[rIdx];
  if (!deleting) {
    typedEl.textContent = current.slice(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      rIdx = (rIdx + 1) % roles.length;
    }
  }
  setTimeout(type, deleting ? 60 : 90);
}
type();

// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.style.boxShadow = window.scrollY > 20 ? "0 4px 24px rgba(0,0,0,0.4)" : "none";
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
hamburger.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
});
function closeMenu() {
  mobileMenu.classList.remove("open");
}

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
  });
  navLinks.forEach(link => {
    link.style.color = link.getAttribute("href") === "#" + current ? "var(--accent)" : "";
  });
});

// ---- SCROLL REVEAL ----
const reveals = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
  });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// Auto-add reveal to cards
document.querySelectorAll(".skill-card, .project-card, .achievement-list li, .contact-item").forEach(el => {
  el.classList.add("reveal");
  observer.observe(el);
});

// ---- CONTACT FORM ----
document.getElementById("contact-form").addEventListener("submit", function(e) {
  e.preventDefault();
  const msg = document.getElementById("form-msg");
  msg.textContent = "✅ Message received! I'll get back to you soon.";
  this.reset();
  setTimeout(() => { msg.textContent = ""; }, 5000);
});
