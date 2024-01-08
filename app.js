// document.addEventListener("DOMContentLoaded", function () {
//   const carousel = document.querySelector(".carousel");
//   const slides = document.querySelectorAll(".slide");
//   const ROTATION_ANGLE = 360 / slides.length; // Adjust for the number of slides

//   document.documentElement.style.setProperty(
//     "--rotation-angle",
//     ROTATION_ANGLE,
//   );

//   let i = 1,
//     intervalId;

//   const intervalFn = () => {
//     intervalId = setInterval(() => {
//       const activeIndex = Array.from(slides).findIndex((slide) =>
//         slide.classList.contains("active"),
//       );

//       slides[activeIndex].classList.remove("active");

//       for (let j = 0; j < slides.length; j++) {
//         const angle = j * ROTATION_ANGLE;
//         const distance = 10; // Adjust the distance based on your design
//         const x = distance * Math.cos(angle * (Math.PI / 180));
//         const y = distance * Math.sin(angle * (Math.PI / 180));

//         slides[
//           j
//         ].style.transform = `translate(${x}rem, ${y}rem) rotate(${angle}deg)`;
//         slides[j].classList.remove("active");
//       }

//       const nextIndex = (activeIndex + 1) % slides.length;
//       slides[nextIndex].classList.add("active");

//       i++;
//     }, 4000);
//   };

//   intervalFn();

//   setTimeout(() => {
//     carousel.addEventListener("mouseenter", () => {
//       clearInterval(intervalId);
//       console.log("Pause");
//     });

//     carousel.addEventListener("mouseleave", () => {
//       intervalFn();
//       console.log("Play");
//     });
//   }, 10);
// });

(function () {
  "use strict";

  class startSetup {
    constructor(sliderSize, slideSize, animationDuration, autoplayInterval) {
      this.sliderSize = parseFloat(sliderSize) / 100;
      this.slideSize = parseFloat(slideSize) / 100;
      this.animationDuration = parseFloat(animationDuration);
      this.autoplayInterval = parseFloat(autoplayInterval);
    }
  }

  class Slider {
    constructor(
      newSlider,
      sliderSize,
      slideSize,
      animationDuration,
      autoplayInterval,
    ) {
      (this.startSetup = new startSetup(
        sliderSize,
        slideSize,
        animationDuration,
        autoplayInterval,
      )),
        (this.wrapper = newSlider.querySelector(".wrapper"));

      this.slides = newSlider.querySelectorAll(
        ".circular-slider .wrapper .slides-holder .slides-holder__item",
      );

      this.slidesSize = 0;

      this.descriptionsHolder = newSlider.querySelector(
        ".circular-slider .wrapper .descriptions",
      );

      this.descriptions = newSlider.querySelectorAll(
        ".circular-slider .wrapper .descriptions .descriptions__item",
      );

      this.slidesHolder = newSlider.querySelector(
        ".circular-slider .wrapper .slides-holder",
      );

      this.btnLeft = newSlider.querySelector(
        ".circular-slider .wrapper .controls .controls__left",
      );

      this.btnRight = newSlider.querySelector(
        ".circular-slider .wrapper .controls .controls__right",
      );

      this.btnAutoplay = newSlider.querySelector(
        ".circular-slider .wrapper .controls .controls__autoplay",
      );

      this.currentAngle = 0;

      this.stepAngle =
        (2 * Math.PI) /
        newSlider.querySelectorAll(
          ".circular-slider .wrapper .slides-holder .slides-holder__item",
        ).length;

      this.currentSlide = 0;

      this.slidesHolder.style.transitionDuration =
        this.startSetup.animationDuration + "ms";
      this.onResize();
      this.setAutoplay();
      this.setNav();
      this.addStyle();

      let _this = this;
      this.btnAutoplay.onclick = function () {
        if (this.classList.contains("controls__autoplay_running")) {
          this.classList.remove("controls__autoplay_running");
          this.classList.add("controls__autoplay_paused");
          clearInterval(_this.autoplay);
          _this.autoplay = null;
        } else {
          this.classList.remove("controls__autoplay_paused");
          this.classList.add("controls__autoplay_running");
          _this.setAutoplay();
        }
      };
    }
    onResize() {
      let radius,
        w = this.wrapper.parentNode.getBoundingClientRect().width,
        h = this.wrapper.parentNode.getBoundingClientRect().height;

      2 * h <= w
        ? (radius = h * this.startSetup.sliderSize)
        : (radius = (w / 2) * this.startSetup.sliderSize);

      this.setSize(Math.round(radius));
    }
    setSize(radius) {
      this.wrapper.style.width = 20 * radius + "px";
      this.wrapper.style.height = 10 * radius + "px";

      let r = 2 * radius * (1 - this.startSetup.slideSize);
      this.slidesHolder.style.width = this.slidesHolder.style.height = r + "px";
      this.slidesRepositioning(r / 2);

      this.slidesHolder.style.marginTop =
        radius * this.startSetup.slideSize + "px";
      this.descriptionsHolder.style.width =
        (r / 2 - r * this.startSetup.slideSize + 20) * 2 + "px";
      this.descriptionsHolder.style.height =
        r / 2 - r * this.startSetup.slideSize + 20 + "px";

      this.slidesSize = Math.min(
        2 * radius * this.startSetup.slideSize,
        this.stepAngle * radius * (1 - this.startSetup.slideSize) - 50,
      );
      this.descriptionsHolder.style.fontSize =
        window.innerHeight < window.innerWidth ? "1.2vh" : "1.2vw";
      for (let i = 0; i < this.slides.length; i++) {
        this.slides[i].style.width = this.slides[i].style.height =
          this.slidesSize + "px";
      }
    }
    slidesRepositioning(r) {
      for (let i = 0; i < this.slides.length; i++) {
        let x = r * Math.cos(this.stepAngle * i - Math.PI / 2),
          y = r * Math.sin(this.stepAngle * i - Math.PI / 2);
        this.slides[i].style.transform =
          "translate( " +
          x +
          "px, " +
          y +
          "px ) rotate( " +
          ((this.stepAngle * 180) / Math.PI) * i +
          "deg )";
      }
    }
    rotate(multiplier) {
      let _this = this;

      this.removeStyle();
      this.resetNavs();

      this.currentSlide -= multiplier;
      this.currentAngle -= ((this.stepAngle * 180) / Math.PI) * multiplier;
      this.slidesHolder.style.transform =
        "rotate( " + this.currentAngle + "deg )";
      this.addStyle();
    }
    setNav() {
      let _this = this;
      _this.btnLeft.onclick = function () {
        _this.rotate(1);
      };
      _this.btnRight.onclick = function () {
        _this.rotate(-1);
      };
    }
    disableNav() {
      this.btnLeft.onclick = null;
      this.btnRight.onclick = null;
    }
    setAutoplay() {
      let _this = this;
      this.autoplay = setInterval(function () {
        _this.rotate(-1);
      }, _this.startSetup.autoplayInterval);
    }
    removeStyle() {
      let x = this.currentSlide;

      this.descriptions[x].classList.remove("descriptions__item_visible");
      this.slides[x].classList.remove("slides-holder__item_active");
      this.slides[x].style.height = this.slides[x].style.width =
        this.slidesSize + "px";
    }
    addStyle() {
      let x = this.currentSlide;

      this.descriptions[x].classList.add("descriptions__item_visible");
      this.slides[x].classList.add("slides-holder__item_active");
      this.slides[x].style.height = this.slides[x].style.width =
        this.slidesSize + 20 + "px";
    }
    resetNavs() {
      let _this = this;

      this.disableNav();
      setTimeout(function () {
        _this.setNav();
      }, this.startSetup.animationDuration + 20);
      if (this.autoplay != null) {
        clearInterval(this.autoplay);
        this.setAutoplay();
      }
    }
  }

  ///////////Init sliders///////////
  window.circularSlider1 = new Slider(
    document.querySelector(".circular-slider-1"),
    100,
    15,
    6000,
    2500,
  );
  window.circularSlider2 = new Slider(
    document.querySelector(".circular-slider-2"),
    90,
    13,
    700,
    3000,
  );
  window.circularSlider3 = new Slider(
    document.querySelector(".circular-slider-3"),
    80,
    18,
    800,
    3700,
  );
  window.circularSlider4 = new Slider(
    document.querySelector(".circular-slider-4"),
    70,
    20,
    900,
    4200,
  );

  let sliders = [
    window.circularSlider1,
    window.circularSlider2,
    window.circularSlider3,
    window.circularSlider4,
  ];

  window.onresize = function () {
    for (let i = 0; i < sliders.length; i++) {
      sliders[i].resetNavs();
      sliders[i].onResize();
    }
  };
  //////////////////////
})();
