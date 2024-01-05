const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const ROTATION_ANGLE = 90;

let i = 0,
  intervalId;

const intervalFn = () => {
  intervalId = setInterval(() => {
    const rotationAngle = -i * ROTATION_ANGLE;
    carousel.style.transform = `rotate(${rotationAngle}deg)`;

    const activeIndex = Array.from(slides).findIndex((slide) =>
      slide.classList.contains("active")
    );

    slides[activeIndex].classList.remove("active");

    const j = (activeIndex + 1) % slides.length;

    // const slideRotation = -j * ROTATION_ANGLE;
    // slides[j].style.transform = `rotate(${slideRotation}deg)`;

    slides[j].classList.add("active");

    if (j === 0) {
      i = 0;
      carousel.style.transform = "rotate(0deg)";
    }

    i++;
  }, 4000);
};

intervalFn();

carousel.addEventListener("mouseenter", () => {
  clearInterval(intervalId);
  console.log("Pause");
});

carousel.addEventListener("mouseleave", () => {
  intervalFn();
  console.log("Play");
});
