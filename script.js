const menuToggle = document.getElementById("menuToggle");
const mainMenu = document.getElementById("mainMenu");
const year = document.getElementById("year");
const heroSlides = document.querySelectorAll(".hero-slide");
const heroSlider = document.getElementById("heroSlider");
const heroDots = document.querySelectorAll(".hero-dot");
const heroSection = document.querySelector(".hero");
const floatingOrder = document.querySelector(".floating-order");
const floatingCall = document.querySelector(".floating-call");
const backToTop = document.getElementById("backToTop");
const siteHeader = document.querySelector(".site-header");
const openStatusElements = document.querySelectorAll("[data-open-status]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const orderModal = document.getElementById("orderModal");
const orderTriggers = document.querySelectorAll("[data-order-trigger]");
const orderCloseControls = document.querySelectorAll("[data-order-close]");

let lastOrderTrigger = null;

if (orderModal && orderTriggers.length > 0) {
  orderModal.hidden = true;

  const modalFocusableSelector = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

  const getModalFocusable = () => Array.from(orderModal.querySelectorAll(modalFocusableSelector));

  const openOrderModal = (trigger) => {
    lastOrderTrigger = trigger || null;
    orderModal.hidden = false;
    document.body.classList.add("is-modal-open");

    const focusable = getModalFocusable();
    if (focusable.length > 0) {
      focusable[0].focus();
    }
  };

  const closeOrderModal = () => {
    orderModal.hidden = true;
    document.body.classList.remove("is-modal-open");

    if (lastOrderTrigger) {
      lastOrderTrigger.focus();
    }
  };

  orderTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      openOrderModal(trigger);
    });
  });

  orderCloseControls.forEach((control) => {
    control.addEventListener("click", () => {
      closeOrderModal();
    });
  });

  orderModal.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      closeOrderModal();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (orderModal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeOrderModal();
      return;
    }

    if (event.key === "Tab") {
      const focusable = getModalFocusable();
      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

if (menuToggle && mainMenu) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    const nextExpanded = !expanded;
    menuToggle.setAttribute("aria-expanded", String(nextExpanded));
    menuToggle.classList.toggle("is-open", nextExpanded);
    mainMenu.classList.toggle("open");
  });

  mainMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-open");
      mainMenu.classList.remove("open");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.classList.remove("is-open");
      mainMenu.classList.remove("open");
    }
  });
}

if (siteHeader) {
  const updateHeaderState = () => {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 16);
  };

  window.addEventListener("scroll", updateHeaderState, { passive: true });
  updateHeaderState();
}

if (openStatusElements.length > 0) {
  const timeFormatter = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Athens"
  });

  const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "Europe/Athens"
  });

  const updateOpenStatus = () => {
    const now = new Date();
    const athensTimeParts = timeFormatter.formatToParts(now);
    const hour = Number(athensTimeParts.find((part) => part.type === "hour")?.value || "0");
    const minute = Number(athensTimeParts.find((part) => part.type === "minute")?.value || "0");
    const weekday = weekdayFormatter.format(now);

    const isLateWeek = weekday === "Fri" || weekday === "Sat" || weekday === "Sun";
    const openMinutes = 12 * 60;
    const closeMinutes = isLateWeek ? 24 * 60 : 22 * 60;
    const nowMinutes = hour * 60 + minute;
    const isOpen = nowMinutes >= openMinutes && nowMinutes < closeMinutes;
    const closeLabel = isLateWeek ? "00:00" : "22:00";

    const statusText = isOpen
      ? `Open now • closes at ${closeLabel} (Athens time)`
      : "Closed now • opens at 12:00 (Athens time)";

    openStatusElements.forEach((element) => {
      element.textContent = statusText;
    });
  };

  updateOpenStatus();
  setInterval(updateOpenStatus, 60000);
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

if (heroSection && (floatingOrder || floatingCall)) {
  if ("IntersectionObserver" in window) {
    const heroObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (floatingOrder) {
            floatingOrder.classList.toggle("is-hidden", entry.isIntersecting);
          }

          if (floatingCall) {
            floatingCall.classList.toggle("is-hidden", entry.isIntersecting);
          }
        });
      },
      { threshold: 0.35 }
    );

    heroObserver.observe(heroSection);
  }
}

if (backToTop) {
  const scrollThreshold = 480;

  const updateBackToTopVisibility = () => {
    backToTop.classList.toggle("is-visible", window.scrollY > scrollThreshold);
  };

  window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
  updateBackToTopVisibility();

  backToTop.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  });
}

if (heroSlides.length > 1) {
  let currentIndex = 0;
  const slideDurationMs = prefersReducedMotion ? 4500 : 2000;
  const transitionMs = prefersReducedMotion ? 0 : 1200;
  const initialSlideDelayMs = prefersReducedMotion ? 2200 : 700;
  let sliderTimer;
  let initialSlideTimeout;

  const updateDots = (activeIndex) => {
    heroDots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === activeIndex);
    });
  };

  const goToSlide = (nextIndex) => {
    if (nextIndex === currentIndex) {
      return;
    }

    const currentSlide = heroSlides[currentIndex];
    const nextSlide = heroSlides[nextIndex];

    currentSlide.classList.remove("is-active");
    currentSlide.classList.add("is-exit-right");
    nextSlide.classList.add("is-active");

    setTimeout(() => {
      currentSlide.classList.remove("is-exit-right");
    }, transitionMs);

    currentIndex = nextIndex;
    updateDots(currentIndex);
  };

  const startAutoSlider = () => {
    clearTimeout(initialSlideTimeout);
    clearInterval(sliderTimer);
    initialSlideTimeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % heroSlides.length;
      goToSlide(nextIndex);
    }, initialSlideDelayMs);

    sliderTimer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % heroSlides.length;
      goToSlide(nextIndex);
    }, slideDurationMs);
  };

  heroDots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const nextIndex = Number(dot.getAttribute("data-slide"));
      goToSlide(nextIndex);
      startAutoSlider();
    });
  });

  if (heroSlider) {
    heroSlider.addEventListener("mouseenter", () => {
      clearTimeout(initialSlideTimeout);
      clearInterval(sliderTimer);
    });

    heroSlider.addEventListener("mouseleave", () => {
      startAutoSlider();
    });
  }

  updateDots(currentIndex);
  startAutoSlider();
}
