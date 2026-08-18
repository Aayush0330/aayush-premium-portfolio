(function () {
  "use strict";

  const body = document.body;
  const loader = document.querySelector(".page-loader");
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const header = document.querySelector(".site-header");
  const progress = document.querySelector(".scroll-progress");
  const cursorGlow = document.querySelector(".cursor-glow");
  const year = document.querySelector("#year");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const faviconPath = "./assets/profile.png";
  const favicon = document.querySelector('link[rel="icon"]') || document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/png";
  favicon.href = faviconPath;
  if (!favicon.parentNode) {
    document.head.appendChild(favicon);
  }

  const appleTouchIcon = document.querySelector('link[rel="apple-touch-icon"]') || document.createElement("link");
  appleTouchIcon.rel = "apple-touch-icon";
  appleTouchIcon.href = faviconPath;
  if (!appleTouchIcon.parentNode) {
    document.head.appendChild(appleTouchIcon);
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.addEventListener("load", () => {
    if (window.gsap && loader && !reduceMotion) {
      gsap.timeline()
        .to(".loader-card", {
          scale: 0.96,
          opacity: 0,
          duration: 0.32,
          ease: "power2.inOut"
        })
        .to(loader, {
          yPercent: -100,
          duration: 0.68,
          ease: "expo.inOut"
        }, "-=0.12")
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

  function updateScrollUI() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;

    if (progress) {
      progress.style.width = pct + "%";
    }

    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 20);
    }
  }

  updateScrollUI();
  window.addEventListener("scroll", updateScrollUI, { passive: true });

  if (cursorGlow && window.matchMedia("(pointer: fine)").matches && !reduceMotion) {
    window.addEventListener("pointermove", (event) => {
      cursorGlow.style.left = event.clientX + "px";
      cursorGlow.style.top = event.clientY + "px";
    });
  }

  const sectionLinks = new Map();
  document.querySelectorAll('.nav-menu a[href^="#"]').forEach((link) => {
    const section = document.querySelector(link.getAttribute("href"));
    if (section) {
      sectionLinks.set(section, link);
    }
  });

  if (sectionLinks.size && "IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visibleEntries.length) return;

      const activeLink = sectionLinks.get(visibleEntries[0].target);
      document.querySelectorAll(".nav-menu a").forEach((link) => {
        link.classList.toggle("is-active", link === activeLink);
      });
    }, {
      rootMargin: "-30% 0px -55% 0px",
      threshold: [0.05, 0.2, 0.5]
    });

    sectionLinks.forEach((_, section) => sectionObserver.observe(section));
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
      const responses = await Promise.all(
        resumeParts.map((url) => fetch(url, { cache: "no-store" }))
      );

      if (responses.some((response) => !response.ok)) {
        throw new Error("Latest resume data unavailable");
      }

      const chunks = await Promise.all(
        responses.map((response) => response.text())
      );

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
      if (originalText) {
        link.textContent = originalText;
      }
    }
  }

  document.querySelectorAll('a[href*="Aayush_Chandak_Resume.pdf"]').forEach((link) => {
    link.addEventListener("click", downloadCurrentResume);
  });

  if (window.gsap && !reduceMotion) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: "power3.out" });

    gsap.to(".orb-one", {
      x: 56,
      y: 42,
      scale: 1.05,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.to(".orb-two", {
      x: -62,
      y: 48,
      scale: 1.06,
      duration: 12,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });

    gsap.utils.toArray(".reveal-up").forEach((element) => {
      gsap.fromTo(element,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.78,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-left").forEach((element) => {
      gsap.fromTo(element,
        { x: -34, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.82,
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-right").forEach((element) => {
      gsap.fromTo(element,
        { x: 34, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.82,
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true
          }
        }
      );
    });

    gsap.utils.toArray(".reveal-scale").forEach((element) => {
      gsap.fromTo(element,
        { scale: 0.975, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.86,
          scrollTrigger: {
            trigger: element,
            start: "top 88%",
            once: true
          }
        }
      );
    });

    gsap.utils.toArray(".project-card").forEach((card) => {
      const thumb = card.querySelector(".project-thumb");
      if (!thumb) return;

      card.addEventListener("mouseenter", () => {
        gsap.to(thumb, {
          scale: 1.018,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(thumb, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });
  } else {
    document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale").forEach((element) => {
      element.style.opacity = 1;
      element.style.transform = "none";
    });
  }
})();
