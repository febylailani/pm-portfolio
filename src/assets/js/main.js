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
  // The modal's primary CTA is a real mailto: link, so it already works with JS off ,
  // the template renders it pre-filled with the generic dossier title. This narrows that
  // fallback to the case study the visitor actually clicked, so the request that lands in
  // the inbox names it instead of saying "one of your case studies".
  function buildCaseStudyMailto(link, title) {
    var to = link.dataset.contactEmail;
    var subject = (link.dataset.subjectTemplate || "").split("{title}").join(title);
    var body = (link.dataset.bodyTemplate || "").split("{title}").join(title);
    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  function openConfidentialModal(title) {
    var modal = document.getElementById("confidentialModal");
    var titleElem = document.getElementById("modalCaseTitle");
    if (!modal) return;
    if (title && titleElem) titleElem.textContent = title;

    var requestLink = modal.querySelector(".confidential-modal-schedule");
    if (requestLink && title) requestLink.href = buildCaseStudyMailto(requestLink, title);
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

    // Deliberately NOT preventDefault: the browser must still follow the mailto: href.
    // Closing is deferred a tick so the modal is not made inert while that click is
    // still being dispatched from inside it.
    var requestLink = document.querySelector(".confidential-modal-schedule");
    if (requestLink) {
      requestLink.addEventListener("click", function () {
        setTimeout(closeConfidentialModal, 0);
      });
    }

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

    var group = document.getElementById("topic-selector-group");
    if (group) group.dataset.selectedTopic = selectedBtn.dataset.topic || "";
  }

  function buildContactMailto(form) {
    var to = form.dataset.contactEmail;
    var name = document.getElementById("user-name").value.trim();
    var email = document.getElementById("user-email").value.trim();
    var org = document.getElementById("user-org").value.trim();
    var message = document.getElementById("user-msg").value.trim();
    var group = document.getElementById("topic-selector-group");
    var topic = (group && group.dataset.selectedTopic) || "";

    var subject = "Portfolio inquiry (" + topic + ") from " + name;

    var bodyLines = ["Name: " + name, "Email: " + email];
    if (org) bodyLines.push("Organization: " + org);
    bodyLines.push("Topic: " + topic);
    bodyLines.push("");
    bodyLines.push(message);

    return "mailto:" + to + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(bodyLines.join("\n"));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    var form = document.getElementById("contact-dispatch-form");
    var banner = document.getElementById("form-success-banner");
    if (!form) return;

    var mailtoUrl = buildContactMailto(form);
    form.dataset.lastMailtoHref = mailtoUrl;

    if (banner) banner.classList.remove("hidden");
    form.reset();
    setTimeout(function () {
      if (banner) banner.classList.add("hidden");
    }, 6000);

    window.location.href = mailtoUrl;
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
      var toast = btn.parentElement.querySelector(".copy-toast");
      btn.addEventListener("click", function () {
        var value = btn.dataset.copyValue;
        if (navigator.clipboard && value) {
          navigator.clipboard.writeText(value).then(function () {
            if (!toast) return;
            toast.classList.remove("hidden");
            clearTimeout(toast._hideTimer);
            toast._hideTimer = setTimeout(function () {
              toast.classList.add("hidden");
            }, 2000);
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
