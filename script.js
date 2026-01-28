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

  const params = new URLSearchParams({
    doctor: doctorInput.value.trim(),
    date: dateInput.value,
    patientName: document.getElementById("patientName").value.trim(),
    phone: document.getElementById("patientPhone").value.trim(),
    source: "Website"
  });

  try {
    const url = `${APPS_SCRIPT_URL}?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error("Response not OK");
    }

    const data = await response.json();

    if (!data.success) {
      alert("❌ " + data.message);
      return;
    }

    alert(`✅ Appointment booked!\nToken No: ${data.token}`);
    closeBookingModal();

  } catch (err) {
    console.error("Fetch error:", err);
    alert("⚠️ Network error. Please try again.");
  }
});