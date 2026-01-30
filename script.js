/* ================= CONFIG ================= */

// 🔴 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz013FEob3kSlLmcnRSJUbbSWoWmu0apDIpN7pwvusosi4DUXQ3JvvW_gGA8jpc0V2s/exec";
/* ================= ELEMENTS ================= */

const modal = document.getElementById("bookingModal");
const form = document.getElementById("bookingForm");
const doctorInput = document.getElementById("selectedDoctor");
const dateInput = document.getElementById("bookDate");

/* ================= DATE VALIDATION ================= */

// Prevent past date booking
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const minDate = `${yyyy}-${mm}-${dd}`;
dateInput.setAttribute("min", minDate);

/* ================= MODAL FUNCTIONS ================= */

function openBookingModal(doctorName = "") {
  modal.style.display = "block";

  if (doctorName) {
    doctorInput.value = doctorName;
    doctorInput.readOnly = true;
  } else {
    doctorInput.value = "";
    doctorInput.readOnly = false;
  }
}

function closeBookingModal() {
  modal.style.display = "none";
  form.reset();
  doctorInput.readOnly = false;
}

/* Close modal when clicking outside */
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeBookingModal();
  }
});

/* ================= FORM SUBMISSION ================= */

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("patientName").value.trim();
  const phone = document.getElementById("patientPhone").value.trim();
  const doctor = doctorInput.value.trim();
  const date = dateInput.value;

  if (name.length < 3) {
    alert("⚠️ Patient name must be at least 3 characters");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("⚠️ Phone number must be exactly 10 digits");
    return;
  }

  const params = new URLSearchParams({
    doctor,
    date,
    patientName: name,
    phone,
    source: "Website"
  });

  try {
    const response = await fetch(
      `${APPS_SCRIPT_URL}?${params.toString()}`,
      { method: "GET", cache: "no-store" }
    );

    const data = await response.json();

    if (!data.success) {
      alert("❌ " + data.message);
      return;
    }

    // ✅ THIS WILL ALWAYS SHOW THE TOKEN
    const token = data.token;

    alert(
      "✅ Appointment submitted successfully!\n\n" +
      "Token No: " + token + "\n\n" +
      "We will contact you shortly."
    );

    closeBookingModal();

  } catch (err) {
    console.error(err);
    alert("⚠️ Network error. Please try again.");
  }
});

/* ================= into video ================= */
document.addEventListener("DOMContentLoaded", () => {
  const video = document.getElementById("heroVideo");
  const header = document.querySelector("header");

  if (!video || !header) return;
  header.classList.remove("header-visible");

  video.addEventListener("ended", () => {
    header.classList.add("header-visible");
  });
  // Always start from beginning on refresh
  video.currentTime = 0;

  // Play once when page loads
  const playPromise = video.play();

  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // Autoplay blocked — user interaction fallback
      document.body.addEventListener(
        "click",
        () => video.play(),
        { once: true }
      );
    });
  }

  // When video ends → freeze last frame
  video.addEventListener("ended", () => {
    video.pause();
    // DO NOT hide the video
    // DO NOT reset currentTime
  });
});


/* ================= Comments ================= */
document.getElementById("commentForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const params = new URLSearchParams({
    action: "comment",
    name: document.getElementById("commentName").value.trim(),
    email: document.getElementById("commentEmail").value.trim(),
    message: document.getElementById("commentMessage").value.trim()
  });

  try {
    await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
      mode: "no-cors"
    });

    alert("✅ Thank you for your feedback!");
    e.target.reset();

  } catch {
    alert("⚠️ Unable to submit comment");
  }
});
