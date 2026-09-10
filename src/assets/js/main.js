/**
 * Interactive behavior for the Feby Lailani portfolio page.
 * Ported from the original Stitch export's inline <script> block; rewritten to
 * bind via data attributes/classes instead of inline onclick="" handlers so
 * content (aiDemo.json topics, etc.) can change without touching this file.
 */
(function () {
  "use strict";

  function findTopic(label) {
    var topics = window.__mockResponses || [];
    for (var i = 0; i < topics.length; i++) {
      if (topics[i].label === label) return topics[i];
    }
    return null;
  }

  function setTopic(label) {
    var input = document.getElementById("ai-prompt-input");
    var box = document.getElementById("ai-response-box");
    var text = document.getElementById("ai-response-text");
    if (!input || !box || !text) return;

    var topic = findTopic(label);
    input.value = label;
    box.classList.remove("hidden");
    text.textContent = topic ? topic.response : (window.__aiDemoConfig && window.__aiDemoConfig.fallbackResponse) || "";
  }

  function handleDemoSearch() {
    var input = document.getElementById("ai-prompt-input");
    var box = document.getElementById("ai-response-box");
    var text = document.getElementById("ai-response-text");
    if (!input || !box || !text) return;

    var topics = window.__mockResponses || [];
    var query = input.value.trim();

    if (!query) {
      if (topics.length) setTopic(topics[0].label);
      return;
    }

    var template = (window.__aiDemoConfig && window.__aiDemoConfig.freeTextResponseTemplate) || "";
    box.classList.remove("hidden");
    text.textContent = template.replace("{{query}}", query);
  }

  function initAiDemo() {
    var submitBtn = document.getElementById("ai-prompt-submit");
    var input = document.getElementById("ai-prompt-input");

    if (submitBtn) submitBtn.addEventListener("click", handleDemoSearch);
    if (input) {
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") handleDemoSearch();
      });
    }

    document.querySelectorAll(".ai-topic-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setTopic(btn.dataset.topic);
      });
    });
  }

  // --- Confidential Case Study Modal -----------------------------------
  function openConfidentialModal(title) {
    var modal = document.getElementById("confidentialModal");
    var titleElem = document.getElementById("modalCaseTitle");
    if (!modal) return;
    if (title && titleElem) titleElem.textContent = title;
    modal.classList.remove("opacity-0", "pointer-events-none");
    modal.classList.add("opacity-100", "pointer-events-auto");
    modal.inert = false;
    document.body.style.overflow = "hidden";
  }

  function closeConfidentialModal() {
    var modal = document.getElementById("confidentialModal");
    if (!modal) return;
    modal.classList.add("opacity-0", "pointer-events-none");
    modal.classList.remove("opacity-100", "pointer-events-auto");
    modal.inert = true;
    document.body.style.overflow = "";
  }

  function scheduleFromModal() {
    closeConfidentialModal();
    var contactSection = document.getElementById("contact");
    if (contactSection) contactSection.scrollIntoView({ behavior: "smooth" });
  }

  function initModal() {
    document.querySelectorAll(".case-study-lock-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openConfidentialModal(btn.dataset.modalTitle);
      });
    });

    document.querySelectorAll(".confidential-modal-close").forEach(function (btn) {
      btn.addEventListener("click", closeConfidentialModal);
    });

    var backdrop = document.getElementById("confidentialModalBackdrop");
    if (backdrop) backdrop.addEventListener("click", closeConfidentialModal);

    var scheduleBtn = document.querySelector(".confidential-modal-schedule");
    if (scheduleBtn) scheduleBtn.addEventListener("click", scheduleFromModal);

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeConfidentialModal();
    });
  }

  // --- Mobile nav panel ---------------------------------------------------
  function setMobileNavOpen(open) {
    var toggle = document.getElementById("mobile-nav-toggle");
    var panel = document.getElementById("mobile-nav-panel");
    if (!toggle || !panel) return;

    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    panel.classList.toggle("hidden", !open);
    toggle.querySelector('[data-icon="menu"]').classList.toggle("hidden", open);
    toggle.querySelector('[data-icon="close"]').classList.toggle("hidden", !open);
  }

  function initMobileNav() {
    var toggle = document.getElementById("mobile-nav-toggle");
    var panel = document.getElementById("mobile-nav-panel");
    if (!toggle || !panel) return;

    toggle.addEventListener("click", function () {
      setMobileNavOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    panel.querySelectorAll(".mobile-nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        setMobileNavOpen(false);
      });
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setMobileNavOpen(false);
    });
  }

  // --- Contact form ------------------------------------------------------
  function selectFormTopic(selectedBtn) {
    var base = "topic-btn inline-flex items-center min-h-[44px] sm:min-h-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all";
    document.querySelectorAll(".topic-btn").forEach(function (btn) {
      btn.className = base + " border-slate-200 bg-slate-50 text-brand-slate hover:border-brand-navy";
    });
    selectedBtn.className = base + " border-brand-navy bg-brand-navy text-white";
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    var banner = document.getElementById("form-success-banner");
    var form = document.getElementById("contact-dispatch-form");
    if (banner) banner.classList.remove("hidden");
    if (form) form.reset();
    setTimeout(function () {
      if (banner) banner.classList.add("hidden");
    }, 6000);
  }

  function initContactForm() {
    document.querySelectorAll(".topic-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectFormTopic(btn);
      });
    });

    var form = document.getElementById("contact-dispatch-form");
    if (form) form.addEventListener("submit", handleFormSubmit);

    document.querySelectorAll(".contact-copy-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var value = btn.dataset.copyValue;
        if (navigator.clipboard && value) {
          navigator.clipboard.writeText(value).then(function () {
            window.alert("Email address copied!");
          });
        }
      });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initAiDemo();
    initModal();
    initMobileNav();
    initContactForm();
  });
})();
