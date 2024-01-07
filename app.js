document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  const slides = document.querySelectorAll(".slide");
  const ROTATION_ANGLE = 90; // Adjust for desired oval rotation

  let i = 1,
    intervalId;

  const intervalFn = () => {
    intervalId = setInterval(() => {
      const rotationAngle = -i * ROTATION_ANGLE;
      carousel.style.transform = `rotate(${rotationAngle}deg)`;

      const activeIndex = Array.from(slides).findIndex((slide) =>
        slide.classList.contains("active")
      );

      slides[activeIndex].classList.remove("active");

      for (let j = 0; j < slides.length; j++) {
        if (j !== activeIndex) {
          // Calculate the rotation angle for each non-active slide
          const slideRotation = j * ROTATION_ANGLE;

          // Calculate the position of the non-active slide based on the rotation angle
          const slideX = Math.sin(slideRotation * (Math.PI / 180)); // Adjust the multiplier based on your slide size
          const slideY = Math.cos(slideRotation * (Math.PI / 180)); // Adjust the multiplier based on your slide size

          // Apply the rotation and position to the non-active slide
          slides[j].style.transform = `rotate(${slideRotation}deg)`;

          // Remove active class from non-active slides
          slides[j].classList.remove("active");
        }
      }

      // Set the active class for the next slide
      const nextIndex = (activeIndex + 1) % slides.length;
      slides[nextIndex].classList.add("active");

      if (nextIndex === 0) {
        i = 0;
        carousel.style.transform = "rotate(0deg)";
      }

      i++;
    }, 4000);
  };

  // Trigger rotation once when the script starts
  intervalFn();

  // Start the interval after a short delay (10 milliseconds)
  setTimeout(() => {
    carousel.addEventListener("mouseenter", () => {
      clearInterval(intervalId);
      console.log("Pause");
    });

    carousel.addEventListener("mouseleave", () => {
      intervalFn();
      console.log("Play");
    });
  }, 10);
});
