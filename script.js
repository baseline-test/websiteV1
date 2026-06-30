/* =================================================================
   BASELINE — WAITLIST FORM
   =================================================================
   STEP 1 of setup: paste your Google Apps Script Web App URL below.
   (The README explains exactly how to get this URL.)
   ================================================================= */

const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwEmIPfjqnSURDu00CDSF0mJ4SdOmBhegvIjokvBgbCOS5mudVlst24-T8E9voMnOe4vQ/exec";

/* ----------------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const form    = document.getElementById("waitlist-form");
  const nameEl  = document.getElementById("name");
  const emailEl = document.getElementById("email");
  const hpEl    = document.getElementById("company"); // honeypot
  const button  = document.getElementById("submit-btn");
  const status  = document.getElementById("form-status");

  if (!form) return;

  // A reasonable email check. This is the backup you mentioned:
  // the type="email" on the input catches most junk, and this catches the rest.
  const looksLikeEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const setStatus = (message, kind) => {
    status.textContent = message;
    status.className = "form-status" + (kind ? " is-" + kind : "");
  };

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // 1) Honeypot: if this hidden field has anything in it, it's a bot.
    //    We quietly pretend it worked and send nothing.
    if (hpEl && hpEl.value.trim() !== "") {
      setStatus("You're on the list. We'll be in touch when Baseline launches.", "success");
      form.reset();
      return;
    }

    const name  = nameEl.value.trim();
    const email = emailEl.value.trim();

    // 2) Validation
    if (!name) {
      setStatus("Add your name so we know who's joining.", "error");
      nameEl.focus();
      return;
    }
    if (!looksLikeEmail(email)) {
      setStatus("Enter a valid email address so we can reach you.", "error");
      emailEl.focus();
      return;
    }

    // 3) Send it
    button.disabled = true;
    const originalLabel = button.textContent;
    button.textContent = "Joining…";
    setStatus("", null);

    try {
      // Form-encoded + no-cors keeps Google Apps Script happy from a static page.
      const body = new URLSearchParams({ name, email });
      await fetch(APPS_SCRIPT_URL, { method: "POST", mode: "no-cors", body });

      // With no-cors we can't read the response, so we treat a completed
      // request as success. (The row still gets written to your sheet.)
      setStatus("You're on the list. We'll be in touch when Baseline launches.", "success");
      form.reset();
    } catch (err) {
      setStatus("Something went wrong on our end — give it another try in a moment.", "error");
    } finally {
      button.disabled = false;
      button.textContent = originalLabel;
    }
  });
});
