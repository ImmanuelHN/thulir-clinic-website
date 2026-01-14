const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyi7d4gzHo2UiOzJAKiw9IVm6iq6XTXDk-47irROre5U-kU6GckEpbmi7sHJDCONVUL/exec"; // <-- paste URL here

const modal = document.getElementById("bookingModal");
const form = document.getElementById("bookingForm");
const doctorInput = document.getElementById("selectedDoctor");

function openBookingModal(doctorName = "") {
  modal.style.display = "block";
  doctorInput.value = doctorName;
  doctorInput.readOnly = !!doctorName;
}

function closeBookingModal() {
  modal.style.display = "none";
  form.reset();
}

window.onclick = e => {
  if (e.target === modal) closeBookingModal();
};

form.addEventListener("submit", async e => {
  e.preventDefault();

  const payload = {
    doctor: doctorInput.value,
    date: document.getElementById("bookDate").value,
    patientName: document.getElementById("patientName").value,
    phone: document.getElementById("patientPhone").value,
    source: "Website"
  };

  try {
    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status === "closed") {
      alert(`❌ Registration closed for ${payload.doctor}`);
      return;
    }

    alert(`✅ Booking confirmed!\nToken No: ${data.token}`);
    closeBookingModal();

  } catch {
    alert("⚠️ Something went wrong. Try again.");
  }
});
