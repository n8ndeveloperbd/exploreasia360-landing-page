const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const chips = document.querySelectorAll(".chip");
const feedback = document.querySelector("#form-feedback");
const quickForm = document.querySelector("#quick-form");
const inquiryForm = document.querySelector("#travel-inquiry-form");

const WHATSAPP_NUMBER = "8801788155379";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=`;

const quickFields = {
  destination: document.querySelector("#quick-destination"),
  city: document.querySelector("#quick-city"),
  date: document.querySelector("#quick-date"),
  duration: document.querySelector("#quick-duration"),
  travellers: document.querySelector("#quick-travellers"),
  budget: document.querySelector("#quick-budget"),
};

const mainFields = {
  name: inquiryForm.querySelector('input[name="full-name"]'),
  mobile: inquiryForm.querySelector('input[name="mobile-number"]'),
  email: inquiryForm.querySelector('input[name="email-address"]'),
  destination: document.querySelector("#main-destination"),
  city: document.querySelector("#main-city"),
  date: document.querySelector("#main-date"),
  duration: document.querySelector("#main-duration"),
  adults: document.querySelector("#main-adults"),
  children: document.querySelector("#main-children"),
  childAges: document.querySelector("#main-child-ages"),
  hotel: inquiryForm.querySelector('select[name="hotel-type"]'),
  room: inquiryForm.querySelector('select[name="room-preference"]'),
  purpose: inquiryForm.querySelector('select[name="travel-purpose"]'),
  budget: document.querySelector("#main-budget"),
  flight: inquiryForm.querySelector('select[name="flight-booking-required"]'),
  visa: inquiryForm.querySelector('select[name="visa-assistance-required"]'),
  transfers: inquiryForm.querySelector('select[name="airport-transfers-required"]'),
  notes: inquiryForm.querySelector('textarea[name="special-requests"]'),
};

const quickPreview = {
  destination: document.querySelector("#quick-preview-destination"),
  city: document.querySelector("#quick-preview-city"),
  date: document.querySelector("#quick-preview-date"),
  duration: document.querySelector("#quick-preview-duration"),
  travellers: document.querySelector("#quick-preview-travellers"),
  budget: document.querySelector("#quick-preview-budget"),
};

const mainPreview = {
  name: document.querySelector("#main-preview-name"),
  mobile: document.querySelector("#main-preview-mobile"),
  email: document.querySelector("#main-preview-email"),
  destination: document.querySelector("#main-preview-destination"),
  city: document.querySelector("#main-preview-city"),
  date: document.querySelector("#main-preview-date"),
  duration: document.querySelector("#main-preview-duration"),
  travellers: document.querySelector("#main-preview-travellers"),
  hotel: document.querySelector("#main-preview-hotel"),
  room: document.querySelector("#main-preview-room"),
  purpose: document.querySelector("#main-preview-purpose"),
  budget: document.querySelector("#main-preview-budget"),
  activities: document.querySelector("#main-preview-activities"),
  services: document.querySelector("#main-preview-services"),
  notes: document.querySelector("#main-preview-notes"),
};

const today = new Date().toISOString().split("T")[0];
quickFields.date.min = today;
mainFields.date.min = today;

const displayValue = (value, fallback = "Not provided") => {
  const normalized = String(value || "").trim();
  return normalized || fallback;
};

const formatDate = (value) => {
  if (!value) {
    return "Not provided";
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const openWhatsApp = (message) => {
  window.open(`${WHATSAPP_URL}${encodeURIComponent(message)}`, "_blank", "noopener");
};

const syncChipState = (destination) => {
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.destination === destination);
  });

  quickFields.destination.value = destination;
  mainFields.destination.value = destination;
  updateQuickPreview();
  updateMainPreview();
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    syncChipState(chip.dataset.destination);
  });
});

quickFields.destination.addEventListener("change", (event) => {
  syncChipState(event.target.value);
});

menuToggle?.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("is-open");
    menuToggle?.setAttribute("aria-expanded", "false");
  });
});

const parseTravellers = (value) => {
  const adultsMatch = value.match(/(\d+)\s*adult/i);
  const childrenMatch = value.match(/(\d+)\s*child/i);

  mainFields.adults.value = adultsMatch ? adultsMatch[1] : "2";
  mainFields.children.value = childrenMatch ? childrenMatch[1] : "0";

  if (!childrenMatch) {
    mainFields.childAges.value = "";
  }
};

const getTravellerSummary = () => {
  const adults = Number(mainFields.adults.value || 0);
  const children = Number(mainFields.children.value || 0);
  const pieces = [];

  if (adults > 0) {
    pieces.push(`${adults} Adult${adults > 1 ? "s" : ""}`);
  }

  if (children > 0) {
    pieces.push(`${children} Child${children > 1 ? "ren" : ""}`);
  }

  if (!pieces.length) {
    return "Not provided";
  }

  if (children > 0 && mainFields.childAges.value.trim()) {
    pieces.push(`Child ages: ${mainFields.childAges.value.trim()}`);
  }

  return pieces.join(", ");
};

const getActivities = () =>
  Array.from(inquiryForm.querySelectorAll('input[name="activities"]:checked'))
    .map((input) => input.value)
    .join(", ");

const getServiceSummary = () =>
  [
    `Flights: ${displayValue(mainFields.flight.value)}`,
    `Visa: ${displayValue(mainFields.visa.value)}`,
    `Transfers: ${displayValue(mainFields.transfers.value)}`,
  ].join(" | ");

const syncQuickIntoMainForm = () => {
  mainFields.destination.value = quickFields.destination.value;
  mainFields.city.value = quickFields.city.value;
  mainFields.date.value = quickFields.date.value;
  mainFields.duration.value = quickFields.duration.value;
  mainFields.budget.value = quickFields.budget.value;
  parseTravellers(quickFields.travellers.value);
  updateMainPreview();
};

const updateQuickPreview = () => {
  quickPreview.destination.textContent = displayValue(quickFields.destination.value);
  quickPreview.city.textContent = displayValue(quickFields.city.value);
  quickPreview.date.textContent = formatDate(quickFields.date.value);
  quickPreview.duration.textContent = displayValue(quickFields.duration.value);
  quickPreview.travellers.textContent = displayValue(quickFields.travellers.value);
  quickPreview.budget.textContent = displayValue(quickFields.budget.value);
};

const updateMainPreview = () => {
  mainPreview.name.textContent = displayValue(mainFields.name.value);
  mainPreview.mobile.textContent = displayValue(mainFields.mobile.value);
  mainPreview.email.textContent = displayValue(mainFields.email.value);
  mainPreview.destination.textContent = displayValue(mainFields.destination.value);
  mainPreview.city.textContent = displayValue(mainFields.city.value);
  mainPreview.date.textContent = formatDate(mainFields.date.value);
  mainPreview.duration.textContent = displayValue(mainFields.duration.value);
  mainPreview.travellers.textContent = getTravellerSummary();
  mainPreview.hotel.textContent = displayValue(mainFields.hotel.value);
  mainPreview.room.textContent = displayValue(mainFields.room.value);
  mainPreview.purpose.textContent = displayValue(mainFields.purpose.value);
  mainPreview.budget.textContent = displayValue(mainFields.budget.value);
  mainPreview.activities.textContent = displayValue(getActivities());
  mainPreview.services.textContent = getServiceSummary();
  mainPreview.notes.textContent = displayValue(
    mainFields.notes.value,
    "No special requests added yet"
  );
};

const buildQuickMessage = () => [
  "ExploreAsia360 Quick Planner Inquiry",
  "",
  `Destination: ${displayValue(quickFields.destination.value)}`,
  `Departure City: ${displayValue(quickFields.city.value)}`,
  `Travel Date: ${formatDate(quickFields.date.value)}`,
  `Days / Nights: ${displayValue(quickFields.duration.value)}`,
  `Travellers: ${displayValue(quickFields.travellers.value)}`,
  `Budget Range: ${displayValue(quickFields.budget.value)}`,
].join("\n");

const buildDetailedMessage = () => [
  "ExploreAsia360 Personalized Trip Inquiry",
  "",
  "Personal Details",
  `Full Name: ${displayValue(mainFields.name.value)}`,
  `Mobile Number: ${displayValue(mainFields.mobile.value)}`,
  `Email Address: ${displayValue(mainFields.email.value)}`,
  "",
  "Travel Details",
  `Preferred Destination: ${displayValue(mainFields.destination.value)}`,
  `Departure City: ${displayValue(mainFields.city.value)}`,
  `Travel Date: ${formatDate(mainFields.date.value)}`,
  `Days / Nights: ${displayValue(mainFields.duration.value)}`,
  `Travellers: ${getTravellerSummary()}`,
  "",
  "Preferences",
  `Hotel Type: ${displayValue(mainFields.hotel.value)}`,
  `Room Preference: ${displayValue(mainFields.room.value)}`,
  `Purpose of Travel: ${displayValue(mainFields.purpose.value)}`,
  `Budget Range: ${displayValue(mainFields.budget.value)}`,
  `Preferred Activities: ${displayValue(getActivities())}`,
  "",
  "Support Services",
  `Flight Booking Required: ${displayValue(mainFields.flight.value)}`,
  `Visa Assistance Required: ${displayValue(mainFields.visa.value)}`,
  `Airport Transfers Required: ${displayValue(mainFields.transfers.value)}`,
  "",
  `Special Requests / Notes: ${displayValue(mainFields.notes.value, "None")}`,
].join("\n");

Object.values(quickFields).forEach((field) => {
  field.addEventListener("input", updateQuickPreview);
  field.addEventListener("change", updateQuickPreview);
});

Array.from(inquiryForm.elements).forEach((field) => {
  field.addEventListener("input", updateMainPreview);
  field.addEventListener("change", updateMainPreview);
});

quickForm.addEventListener("submit", (event) => {
  event.preventDefault();
  syncQuickIntoMainForm();
  updateQuickPreview();
  feedback.textContent = "Quick planner preview is ready. WhatsApp is opening with the customer's trip summary.";
  openWhatsApp(buildQuickMessage());
});

inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  updateMainPreview();
  feedback.textContent = "Detailed trip preview is ready. WhatsApp is opening with the completed travel request.";
  openWhatsApp(buildDetailedMessage());
});

const handleHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

syncChipState("Malaysia");
updateQuickPreview();
updateMainPreview();
handleHeaderState();
window.addEventListener("scroll", handleHeaderState);
