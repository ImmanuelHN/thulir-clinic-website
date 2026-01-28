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

  /* ================= VALIDATION ================= */

  if (name.length < 3) {
    alert("⚠️ Patient name must be at least 3 characters");
    return;
  }

  if (!/^\d{10}$/.test(phone)) {
    alert("⚠️ Phone number must be exactly 10 digits");
    return;
  }

  if (!doctor || !date) {
    alert("⚠️ Please fill all fields");
    return;
  }

  /* ================= SUBMISSION ================= */

  const params = new URLSearchParams({
    doctor,
    date,
    patientName: name,
    phone,
    source: "Website"
  });

  try {
    await fetch(`${APPS_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors"   // 🔥 THIS IS THE KEY
    });

    alert("✅ Appointment submitted successfully!\nToken No: ${data.token}\nWe will contact you shortly.");
    closeBookingModal();

  } catch (err) {
    console.error(err);
    alert("⚠️ Network error. Please try again.");
  }
});
