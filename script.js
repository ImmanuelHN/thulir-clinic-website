/* ================= CONFIG ================= */

// 🔴 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyi7d4gzHo2UiOzJAKiw9IVm6iq6XTXDk-47irROre5U-kU6GckEpbmi7sHJDCONVUL/exec";

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

  const payload = {
    doctor: doctorInput.value.trim(),
    date: dateInput.value,
    patientName: document.getElementById("patientName").value.trim(),
    phone: document.getElementById("patientPhone").value.trim(),
    source: "Website"
  };

  // Basic validation
  if (!payload.doctor || !payload.date || !payload.patientName || !payload.phone) {
    alert("⚠️ Please fill all fields");
    return;
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (result.status === "closed") {
      alert(`❌ Booking closed for ${payload.doctor}`);
      return;
    }

    alert(
      `✅ Appointment Confirmed!\n\nDoctor: ${payload.doctor}\nDate: ${payload.date}\nToken No: ${result.token}`
    );

    closeBookingModal();

  } catch (error) {
    console.error(error);
    alert("⚠️ Network error. Please try again.");
  }
});
