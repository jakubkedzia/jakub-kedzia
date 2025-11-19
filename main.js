function copyEmail() {
  const emailEl = document.getElementById('contactEmail');
  if (!emailEl) return;

  const email = emailEl.textContent.trim();

  navigator.clipboard.writeText(email).then(() => {
    const btn = document.getElementById('copyBtn');
    if (!btn) return;

    const originalText = btn.innerText;
    btn.innerText = 'Skopiowano!';
    setTimeout(() => {
      btn.innerText = originalText;
    }, 1500);
  });
}

// Ustawienie roku w stopce + logika formularza
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) return;

  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Wyczyść stare błędy (klasy + komunikat)
    [nameInput, emailInput, messageInput].forEach((el) => {
      if (el) el.classList.remove("input-error");
    });
    status.textContent = "";
    status.className = "text-sm font-medium";

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Walidacja: imię i nazwisko
    if (name.length < 3) {
      status.textContent = "Podaj poprawne imię i nazwisko.";
      status.className = "text-sm font-medium text-red-600";
      nameInput.classList.add("input-error");
      nameInput.focus();
      return;
    }

    // Walidacja: email
    if (!emailRegex.test(email)) {
      status.textContent = "Podaj poprawny adres e-mail.";
      status.className = "text-sm font-medium text-red-600";
      emailInput.classList.add("input-error");
      emailInput.focus();
      return;
    }

    // Walidacja: wiadomość
    if (message.length < 10) {
      status.textContent = "Podaj więcej szczegółów o projekcie.";
      status.className = "text-sm font-medium text-red-600";
      messageInput.classList.add("input-error");
      messageInput.focus();
      return;
    }

    // Blokuj przycisk na czas wysyłki
    submitBtn.disabled = true;
    submitBtn.classList.add("opacity-60", "cursor-not-allowed");
    submitBtn.textContent = "Wysyłam...";

    try {
      const formData = new FormData(form);

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      const result = await response.json();

      if (result.success) {
        status.textContent = "Wiadomość wysłana! Odezwę się jak najszybciej.";
        status.className = "text-sm font-medium text-emerald-600";
        form.reset();
      } else {
        status.textContent = "Wystąpił błąd. Spróbuj ponownie.";
        status.className = "text-sm font-medium text-red-600";
      }

    } catch (error) {
      status.textContent = "Błąd połączenia. Spróbuj ponownie za chwilę.";
      status.className = "text-sm font-medium text-red-600";
    }

    // Odblokuj przycisk
    submitBtn.disabled = false;
    submitBtn.classList.remove("opacity-60", "cursor-not-allowed");
    submitBtn.textContent = "Wyślij";
  });
});
