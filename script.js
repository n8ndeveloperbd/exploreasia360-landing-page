const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const chips = document.querySelectorAll(".chip");
const quickDestination = document.querySelector("#quick-destination");
const quickForm = document.querySelector("#quick-form");
const quickCity = document.querySelector("#quick-city");
const quickDate = document.querySelector("#quick-date");
const quickDuration = document.querySelector("#quick-duration");
const quickTravellers = document.querySelector("#quick-travellers");
const quickBudget = document.querySelector("#quick-budget");

const mainDestination = document.querySelector("#main-destination");
const mainCity = document.querySelector("#main-city");
const mainDate = document.querySelector("#main-date");
const mainDuration = document.querySelector("#main-duration");
const mainAdults = document.querySelector("#main-adults");
const mainChildren = document.querySelector("#main-children");
const mainChildAges = document.querySelector("#main-child-ages");
const mainBudget = document.querySelector("#main-budget");
const feedback = document.querySelector("#form-feedback");
const inquiryForm = document.querySelector("#travel-inquiry-form");

const today = new Date().toISOString().split("T")[0];
quickDate.min = today;
mainDate.min = today;

const syncChipState = (destination) => {
  chips.forEach((chip) => {
    chip.classList.toggle("is-active", chip.dataset.destination === destination);
  });

  quickDestination.value = destination;
  mainDestination.value = destination;
};

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    syncChipState(chip.dataset.destination);
  });
});

quickDestination.addEventListener("change", (event) => {
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

  mainAdults.value = adultsMatch ? adultsMatch[1] : "2";
  mainChildren.value = childrenMatch ? childrenMatch[1] : "0";

  if (!childrenMatch) {
    mainChildAges.value = "";
  }
};

quickForm.addEventListener("submit", (event) => {
  event.preventDefault();

  mainDestination.value = quickDestination.value;
  mainCity.value = quickCity.value;
  mainDate.value = quickDate.value;
  mainDuration.value = quickDuration.value;
  mainBudget.value = quickBudget.value;

  parseTravellers(quickTravellers.value);

  document.querySelector("#trip-form").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  feedback.textContent = `Your ${quickDestination.value || "selected"} travel preferences are ready below. Complete the full form and we will tailor the itinerary around them.`;
});

inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(inquiryForm);
  const name = formData.get("full-name");
  const destination = formData.get("preferred-destination");

  feedback.textContent = `${name}, thank you. Your inquiry for ${destination} is ready to be reviewed by the ExploreAsia360 team.`;
  inquiryForm.reset();
  mainAdults.value = "2";
  mainChildren.value = "0";
  syncChipState("Malaysia");
});

const handleHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 20);
};

handleHeaderState();
window.addEventListener("scroll", handleHeaderState);
