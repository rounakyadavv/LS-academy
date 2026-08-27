const config = window.LS_ACADEMY_CONFIG;
const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

// Major section: icons and config-powered card rendering.
function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function setText(selector, value) {
  const node = $(selector);
  if (node) node.textContent = value;
}

function renderCards() {
  $("#heroStats").innerHTML = config.stats.map((stat) => `
    <div class="hero-stat">
      <strong>${stat.value}${stat.suffix}</strong>
      <span>${stat.label}</span>
    </div>
  `).join("");

  $("#whyGrid").innerHTML = config.reasons.map(([title, text, iconName]) => `
    <article class="info-card" data-reveal>
      ${icon(iconName)}
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");

  $("#courseGrid").innerHTML = config.courses.map((course) => `
    <article class="course-card" data-reveal>
      ${icon("school")}
      <h3>${course.className}</h3>
      <p>${course.timing}</p>
      <div class="subject-list">${course.subjects.map((subject) => `<span>${subject}</span>`).join("")}</div>
      <p><strong>Fees:</strong> ${course.fee}</p>
      <a class="btn-secondary" href="#contact">${icon("arrow-right")}Learn More</a>
    </article>
  `).join("");

  $("#timeline").innerHTML = config.methodology.map(([title, text, iconName]) => `
    <article class="method-step" data-reveal>
      ${icon(iconName)}
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");

  $("#featureGrid").innerHTML = config.features.map(([title, text, iconName]) => `
    <article class="feature-card" data-reveal>
      ${icon(iconName)}
      <h3>${title}</h3>
      <p>${text}</p>
    </article>
  `).join("");

  $("#resultsGrid").innerHTML = config.stats.map((stat) => `
    <div class="result-card">
      <strong><span class="counter" data-target="${stat.value}">0</span>${stat.suffix}</strong>
      <span>${stat.label}</span>
    </div>
  `).join("");

  $("#galleryGrid").innerHTML = config.gallery.map((item) => `
    <article class="gallery-item" data-reveal style="background-image:${item.image}">
      <div><strong>${item.title}</strong><span>${item.category}</span></div>
    </article>
  `).join("");

  $("#faqList").innerHTML = config.faqs.map(([question, answer], index) => `
    <article class="faq-item ${index === 0 ? "open" : ""}" data-reveal>
      <button type="button" aria-expanded="${index === 0 ? "true" : "false"}">
        <span>${question}</span>${icon("plus")}
      </button>
      <div class="faq-answer">${answer}</div>
    </article>
  `).join("");
}

// Major section: contact, footer, and admissions content from one config file.
function hydrateInstituteDetails() {
  const phone = config.institute.phone;
  const whatsappUrl = `https://wa.me/${config.institute.whatsapp}?text=${encodeURIComponent("Hello LS Academy, I want to book a free demo class.")}`;

  setText("#contactAddress", config.institute.address);
  setText("#contactTimings", config.institute.timings);
  setText("#admissionTitle", config.admissions.currentBatch);
  setText("#admissionNote", config.admissions.demoNote);

  $("#contactPhone").href = `tel:${phone}`;
  $("#contactPhone").textContent = phone;
  $("#contactEmail").href = `mailto:${config.institute.email}`;
  $("#contactEmail").textContent = config.institute.email;
  $("#contactInstagram").href = config.institute.instagramUrl;
  $("#contactInstagram").textContent = config.institute.instagram;
  $("#mapsFrame").src = config.institute.googleMapsEmbed;
  $("#whatsappFloat").href = whatsappUrl;
  $("#callFloat").href = `tel:${phone}`;
  $("#footerWhatsApp").href = whatsappUrl;
  $("#footerInstagram").href = config.institute.instagramUrl;
  $("#copyright").innerHTML = `© ${new Date().getFullYear()} ${config.institute.name}. All rights reserved. · Created by <a href="https://www.instagram.com/rounakyadavv/" target="_blank" rel="noopener noreferrer">@rounakyadavv</a>`;

  $("#documentsList").innerHTML = config.admissions.documents.map((documentName) => `
    <li>${icon("check-circle-2")}<span>${documentName}</span></li>
  `).join("");
}

// Major section: carousel for parent and student testimonials.
let testimonialIndex = 0;
function renderTestimonial() {
  const testimonial = config.testimonials[testimonialIndex];
  const card = $("#testimonialCard");
  card.classList.add("changing");
  window.setTimeout(() => {
    card.innerHTML = `
      <small>${testimonial.type}</small>
      <p>“${testimonial.quote}”</p>
      <strong>${testimonial.name}</strong>
    `;
    card.classList.remove("changing");
  }, 160);
}

function moveTestimonial(direction) {
  testimonialIndex = (testimonialIndex + direction + config.testimonials.length) % config.testimonials.length;
  renderTestimonial();
}

// Major section: dark mode and responsive navigation.
function setupNavigation() {
  const savedTheme = localStorage.getItem("ls-academy-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

if (savedTheme === "dark") {
    document.documentElement.classList.add("dark");
}
  
  const resourcesToggle = $("#resourcesToggle");
  const resourcesModal = $("#resourcesModal");
  const resourcesClose = $("#resourcesClose");
  const resourcesOverlay = $("#resourcesOverlay");
  const resourcesList = $("#resourcesList");

  resourcesList.innerHTML = config.studentResources.map((resource) => `
    <a class="resource-item" href="${resource.url}" target="_blank" rel="noopener noreferrer">
      <span class="resource-icon">${icon(resource.icon)}</span>
      <span class="resource-content">
        <strong>${resource.title}</strong>
        <small>${resource.description}</small>
      </span>
      ${icon("external-link")}
    </a>
  `).join("");

  const closeResources = () => {
    resourcesModal.classList.remove("open");
    resourcesModal.setAttribute("aria-hidden", "true");
  };

  resourcesToggle.addEventListener("click", () => {
    resourcesModal.classList.add("open");
    resourcesModal.setAttribute("aria-hidden", "false");
    lucide.createIcons();
  });

  resourcesClose.addEventListener("click", closeResources);
  resourcesOverlay.addEventListener("click", closeResources);
  const menu = $("#navMenu");
  const toggle = $("#menuToggle");
  toggle.addEventListener("click", () => {
    const open = menu.classList.toggle("open");
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });

  $$("#navMenu a").forEach((link) => link.addEventListener("click", () => {
    menu.classList.remove("open");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }));

  $("#themeToggle").addEventListener("click", () => {
    const dark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("ls-academy-theme", dark ? "dark" : "light");
    $("#themeToggle span").textContent = dark ? "Light" : "Dark";
    $("#themeToggle i").setAttribute("data-lucide", dark ? "sun" : "moon");
    lucide.createIcons();
  });
}

// Major section: scroll effects, animated counters, and FAQ behavior.
function setupInteractions() {
  const header = $(".site-header");
  const scrollTop = $("#scrollTop");

  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 24;
    header.classList.toggle("scrolled", scrolled);
    scrollTop.classList.toggle("visible", window.scrollY > 500);
  }, { passive: true });

  scrollTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  $("#prevTestimonial").addEventListener("click", () => moveTestimonial(-1));
  $("#nextTestimonial").addEventListener("click", () => moveTestimonial(1));
  window.setInterval(() => moveTestimonial(1), 6500);

  $$("#faqList .faq-item button").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
    });
  });

  $("#contactForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const message = `Hello LS Academy, my name is ${data.get("name")}. I am interested in ${data.get("class")}. Phone: ${data.get("phone")}. Message: ${data.get("message") || "Please contact me for admission details."}`;
    $("#formStatus").textContent = "Opening WhatsApp with your enquiry...";
    window.open(`https://wa.me/${config.institute.whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
}

function setupRevealAndCounters() {
  const revealed = new WeakSet();
  const animateCounter = (counter) => {
    if (counter.dataset.done) return;
    counter.dataset.done = "true";
    const target = Number(counter.dataset.target);
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      counter.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || revealed.has(entry.target)) return;
      revealed.add(entry.target);
      entry.target.classList.add("revealed");
      $$(".counter", entry.target).forEach(animateCounter);
    });
  }, { threshold: .16 });

  $$("[data-reveal], .results-band").forEach((node) => observer.observe(node));
}

window.addEventListener("load", () => {
  window.setTimeout(() => $("#loader").classList.add("hidden"), 350);
});

renderCards();
hydrateInstituteDetails();
renderTestimonial();
setupNavigation();
setupInteractions();
setupRevealAndCounters();
lucide.createIcons();
