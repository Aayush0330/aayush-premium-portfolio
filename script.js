(function () {
  "use strict";

  const heroTypographyStyle = document.createElement("style");
  heroTypographyStyle.textContent = `
    .hero-visual {
      display: none !important;
    }

    .hero-title {
      font-size: clamp(2.55rem, 4.4vw, 4rem) !important;
      font-weight: 600 !important;
      line-height: 1.08 !important;
      letter-spacing: -0.045em !important;
    }

    @media (max-width: 1280px) {
      .hero-title {
        font-size: clamp(2.5rem, 4.35vw, 3.75rem) !important;
      }
    }

    @media (max-width: 1024px) {
      .hero-title {
        max-width: 720px !important;
        font-size: clamp(2.45rem, 5.2vw, 3.35rem) !important;
      }
    }

    @media (max-width: 820px) {
      .hero-title {
        font-size: clamp(2.3rem, 6vw, 3rem) !important;
        line-height: 1.1 !important;
      }
    }

    @media (max-width: 540px) {
      .hero-title {
        font-size: clamp(2rem, 8.5vw, 2.5rem) !important;
        letter-spacing: -0.04em !important;
      }
    }

    @media (max-width: 420px) {
      .hero-title {
        font-size: clamp(1.95rem, 8.7vw, 2.3rem) !important;
      }
    }

    @media (max-width: 360px) {
      .hero-title {
        font-size: clamp(1.85rem, 8.8vw, 2rem) !important;
      }
    }

    @media (max-width: 320px) {
      .hero-title {
        font-size: 1.82rem !important;
      }
    }
  `;
  document.head.appendChild(heroTypographyStyle);

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

  const resumeParts = [
    ...Array.from({ length: 11 }, (_, index) =>
      `./resume/parts/part-${String(index).padStart(2, "0")}.txt`
    ),
    "./resume/parts/part-11a.txt",
    "./resume/parts/part-11b.txt",
    ...Array.from({ length: 9 }, (_, index) =>
      `./resume/parts/part-${String(index + 12).padStart(2, "0")}.txt`
    )
  ];

  async function downloadCurrentResume(event) {
    event.preventDefault();

    const link = event.currentTarget;
    const originalText = link.textContent;
    link.setAttribute("aria-busy", "true");
    link.style.pointerEvents = "none";

    if (originalText && /resume|cv/i.test(originalText)) {
      link.textContent = "Preparing Resume...";
    }

    try {
      const responses = await Promise.all(resumeParts.map((url) => fetch(url, { cache: "no-store" })));
      if (responses.some((response) => !response.ok)) {
        throw new Error("Latest resume data unavailable");
      }

      const chunks = await Promise.all(responses.map((response) => response.text()));
      const base64 = chunks.join("").replace(/\s/g, "");
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);

      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }

      const blob = new Blob([bytes], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = objectUrl;
      downloadLink.download = "Aayush_Chandak_Resume.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    } catch (error) {
      console.error("Resume download failed:", error);
      alert("Resume download failed. Please refresh the page and try again.");
    } finally {
      link.removeAttribute("aria-busy");
      link.style.pointerEvents = "";
      if (originalText) link.textContent = originalText;
    }
  }

  document.querySelectorAll('a[href*="Aayush_Chandak_Resume.pdf"]').forEach((link) => {
    link.addEventListener("click", downloadCurrentResume);
  });

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
