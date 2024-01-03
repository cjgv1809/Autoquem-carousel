const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const controlLinks = document.querySelectorAll(".controls a");

let i = 0,
  j = 1,
  intervalId;

const intervalFn = () => {
  intervalId = setInterval(() => {
    carousel.style.rotate = `-${++i * 90}deg`;

    document.querySelector(".slide.active").classList.remove("active");
    const activeSlide = document.querySelector(`.slide:nth-child(${++j})`);
    activeSlide.classList.add("active");

    document.querySelector("a.active").classList.remove("active");
    const activeLink = document.querySelector(`.controls a:nth-child(${j})`);
    activeLink.classList.add("active");

    rotateText(activeSlide, 0); // Rotate the text within the active slide with a fixed adjustment

    if (j === 4) j = 0;
  }, 4000);
};

const rotateText = (slide, rotationAdjustment) => {
  const textElements = slide.querySelectorAll("h4, p, span");
  textElements.forEach((element) => {
    element.style.transform = `rotate(${rotationAdjustment}deg)`;
  });
};

intervalFn();

controlLinks.forEach((control) => {
  control.addEventListener("click", () => {
    clearInterval(intervalId);
    carousel.style.rotate = `-${
      (i - j + Number(control.dataset.index)) * 90
    }deg`;

    document.querySelector(".slide.active").classList.remove("active");
    const activeSlide = document.querySelector(
      `.slide:nth-child(${control.dataset.index})`
    );
    activeSlide.classList.add("active");

    document.querySelector("a.active").classList.remove("active");
    control.classList.add("active");

    rotateText(activeSlide, 0); // Rotate the text within the active slide with a fixed adjustment
  });
});

carousel.addEventListener("mouseenter", () => {
  clearInterval(intervalId);
  console.log("Pause");
});

carousel.addEventListener("mouseleave", () => {
  intervalFn();
  console.log("Play");
});
