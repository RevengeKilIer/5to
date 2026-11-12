/**
 * BIA LAKTEAL - Script Principal
 * Funcionalidades interactivas, catálogo con filtros, visor modal y enlaces a WhatsApp
 * Sin dependencias externas - 100% Vanilla JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // =========================================================================
  // 1. Constantes y Teléfonos Oficiales de Contacto (Bolivia +591)
  // =========================================================================
  const PHONE_1 = "59169881633"; // +591 69881633
  const PHONE_2 = "59162821786"; // +591 62821786

  // =========================================================================
  // 2. Cabecera fija y cambio de estilo al hacer scroll
  // =========================================================================
  const header = document.querySelector(".header");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  const handleScroll = () => {
    const scrollY = window.scrollY;

    if (scrollY > 40) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }

    if (scrollY > 400) {
      scrollTopBtn?.classList.add("visible");
    } else {
      scrollTopBtn?.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // =========================================================================
  // 3. Menú Móvil (Hamburguesa / Drawer)
  // =========================================================================
  const mobileToggle = document.getElementById("mobileToggle");
  const mobileNav = document.getElementById("mobileNav");
  const mobileBackdrop = document.getElementById("mobileBackdrop");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  const openMobileMenu = () => {
    mobileToggle?.classList.add("active");
    mobileNav?.classList.add("open");
    mobileBackdrop?.classList.add("active");
    mobileToggle?.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMobileMenu = () => {
    mobileToggle?.classList.remove("active");
    mobileNav?.classList.remove("open");
    mobileBackdrop?.classList.remove("active");
    mobileToggle?.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileNav?.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileBackdrop) {
    mobileBackdrop.addEventListener("click", closeMobileMenu);
  }

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMobileMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav?.classList.contains("open")) {
      closeMobileMenu();
    }
  });

  // =========================================================================
  // 4. Navegación Activa según la Sección Visible (Scrollspy)
  // =========================================================================
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset + 140;

    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });

  // =========================================================================
  // 5. Filtros del Catálogo de Productos
  // =========================================================================
  const filterBtns = document.querySelectorAll(".filter-btn");
  const catalogCards = document.querySelectorAll(".catalog-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      catalogCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category === filter || (filter === "leche" && category.includes("leche"))) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 20);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 200);
        }
      });
    });
  });

  // =========================================================================
  // 6. Modal / Visor de Imagen en Alta Definición para el Catálogo
  // =========================================================================
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalClose = document.getElementById("modalClose");
  const modalWhatsAppBtn = document.getElementById("modalWhatsAppBtn");
  const clickableImages = document.querySelectorAll(".catalog-img-wrap");

  clickableImages.forEach((wrap) => {
    wrap.addEventListener("click", () => {
      const img = wrap.querySelector("img");
      const card = wrap.closest(".catalog-card");
      const title = card ? card.querySelector(".catalog-title")?.textContent : "Producto Bia Lakteal";
      const src = img?.getAttribute("src");
      const waBtn = card?.querySelector(".btn-whatsapp");
      const waHref = waBtn?.getAttribute("href") || `https://wa.me/${PHONE_1}?text=${encodeURIComponent("Hola Bia Lakteal, quisiera consultar sobre el producto: " + title)}`;

      if (imageModal && modalImage && modalTitle && src) {
        modalImage.setAttribute("src", src);
        modalImage.setAttribute("alt", title);
        modalTitle.textContent = title;
        if (modalWhatsAppBtn) {
          modalWhatsAppBtn.setAttribute("href", waHref);
        }
        imageModal.classList.add("active");
        document.body.style.overflow = "hidden";
      }
    });
  });

  const closeModal = () => {
    if (imageModal) {
      imageModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  };

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (imageModal) {
    imageModal.addEventListener("click", (e) => {
      if (e.target === imageModal) closeModal();
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && imageModal?.classList.contains("active")) {
      closeModal();
    }
  });

  // =========================================================================
  // 7. Acordeón Interactivo de Preguntas Frecuentes (FAQ)
  // =========================================================================
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const btn = item.querySelector(".faq-question-btn");
    const panel = item.querySelector(".faq-answer-panel");

    if (btn && panel) {
      btn.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        faqItems.forEach((otherItem) => {
          if (otherItem !== item) {
            otherItem.classList.remove("active");
            const otherBtn = otherItem.querySelector(".faq-question-btn");
            const otherPanel = otherItem.querySelector(".faq-answer-panel");
            if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
            if (otherPanel) otherPanel.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove("active");
          btn.setAttribute("aria-expanded", "false");
          panel.style.maxHeight = null;
        } else {
          item.classList.add("active");
          btn.setAttribute("aria-expanded", "true");
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });
    }
  });

  // =========================================================================
  // 8. Asistente de Consulta y Pedidos por WhatsApp (Multi-producto)
  // =========================================================================
  const productSelect = document.getElementById("orderProduct");
  const phoneSelect = document.getElementById("orderPhone");
  const noteInput = document.getElementById("orderNotes");
  const btnSendWhatsApp = document.getElementById("btnSendWhatsApp");

  const updateWhatsAppOrderUrl = () => {
    if (!btnSendWhatsApp) return;

    const selectedProduct = productSelect ? productSelect.value : "Productos del Catálogo";
    const selectedPhone = phoneSelect ? phoneSelect.value : PHONE_1;
    const note = noteInput && noteInput.value.trim() ? ` Detalle adicional: ${noteInput.value.trim()}` : "";

    const text = `Hola Bia Lakteal, quisiera consultar disponibilidad y precio sobre: *${selectedProduct}*.${note}`;
    const encodedText = encodeURIComponent(text);
    btnSendWhatsApp.setAttribute("href", `https://wa.me/${selectedPhone}?text=${encodedText}`);
  };

  if (productSelect) productSelect.addEventListener("change", updateWhatsAppOrderUrl);
  if (phoneSelect) phoneSelect.addEventListener("change", updateWhatsAppOrderUrl);
  if (noteInput) noteInput.addEventListener("input", updateWhatsAppOrderUrl);

  updateWhatsAppOrderUrl();

  // =========================================================================
  // 9. Año Dinámico en Footer
  // =========================================================================
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});
