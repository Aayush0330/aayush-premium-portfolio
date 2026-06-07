(function () {
  "use strict";

  const body = document.body;
  const loader = document.querySelector(".page-loader");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const progress = document.querySelector(".scroll-progress");
  const cursorGlow = document.querySelector(".cursor-glow");
  const year = document.querySelector("#year");

  if (year) year.textContent = new Date().getFullYear();
  window.addEventListener("load", () => {
    if (window.gsap && loader) {
      gsap.timeline()
        .to(".loader-card", { scale: 0.92, opacity: 0, duration: 0.45, ease: "power2.inOut" })
        .to(loader, { yPercent: -100, duration: 0.85, ease: "expo.inOut" }, "-=0.18")
        .set(loader, { display: "none" });
    } else if (loader) {
      loader.style.display = "none";
    }
  });

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        body.classList.remove("menu-open");
      });
    });
  }

  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
  }, { passive: true });

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = event.clientX + "px";
      cursorGlow.style.top = event.clientY + "px";
    });
  }

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);

    gsap.defaults({ ease: "power3.out" });

    gsap.to(".orb-one", {
      x: 80,
      y: 60,
      scale: 1.08,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".orb-two", {
      x: -90,
      y: 70,
      scale: 1.1,
      duration: 9,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });


    gsap.utils.toArray(".reveal-up").forEach((el) => {
      gsap.fromTo(el,
        { y: 46, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          scrollTrigger: {
            trigger: el,
            start: "top 86%"
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-left").forEach((el) => {
      gsap.fromTo(el,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 84%"
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-right").forEach((el) => {
      gsap.fromTo(el,
        { x: 60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: el,
            start: "top 84%"
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-scale").forEach((el) => {
      gsap.fromTo(el,
        { scale: 0.92, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.05,
          scrollTrigger: {
            trigger: el,
            start: "top 86%"
          }
        }
      );
    });

    gsap.to(".visual-shell", {
      rotateY: -5,
      rotateX: 4,
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.2
      }
    });

    gsap.utils.toArray(".project-card").forEach((card) => {
      const thumb = card.querySelector(".project-thumb");
      card.addEventListener("mouseenter", () => {
        gsap.to(thumb, { scale: 1.025, duration: 0.45, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(thumb, { scale: 1, duration: 0.45, ease: "power2.out" });
      });
    });
  } else {
    document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => {
      el.style.opacity = 1;
    });
  }
})();
