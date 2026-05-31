/* =========================================================
   NORTEM CONSULTORIA — LP
   Scripts: navegação, animações, formulário
   ========================================================= */

(() => {
  "use strict";

  /* ---------- CONFIG -------------------------------------- */
  // Cole aqui a URL do "App da Web" gerada pelo Google Apps Script.
  // Tutorial completo passo a passo:
  //   integracao-google-sheets/COMO-CONFIGURAR.md
  // Formato esperado: https://script.google.com/macros/s/AKfyc.../exec
  const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbxEnn9EtNuZZTMg07zmz9gx84N-tv8xrEa9SuyfBxsrLCeCnYQ2MbzZCyKUeeFkNXG9/exec";

  // Número do WhatsApp para o botão flutuante e links (formato internacional, sem '+').
  const WHATSAPP_NUMBER = "5587996050090";

  /* ---------- HEADER scroll ------------------------------- */
  const header = document.getElementById("siteHeader");
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- MENU MOBILE --------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMobile = document.getElementById("navMobile");
  navToggle.addEventListener("click", () => {
    const isOpen = navMobile.classList.toggle("open");
    navToggle.classList.toggle("open", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navMobile.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      navMobile.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    })
  );

  /* ---------- ANO RODAPÉ ---------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- REVEAL ON SCROLL ---------------------------- */
  const revealTargets = [
    ".section-head",
    ".problem-card",
    ".solution-item",
    ".timeline-step",
    ".fit-col",
    ".consultant-card",
    ".metric-card",
    ".video-frame",
    ".form-intro",
    ".lead-form"
  ];
  revealTargets.forEach((sel) =>
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      el.style.transitionDelay = `${Math.min(i * 60, 320)}ms`;
    })
  );

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

  /* ---------- CONTADORES ANIMADOS ------------------------- */
  const counters = document.querySelectorAll("[data-counter]");
  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
          el.textContent = Math.round(target * eased);
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        counterIO.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => counterIO.observe(c));

  /* ---------- VÍDEO HTML5 PLAYER CONTROL ------------------- */
  const nortemVideo = document.getElementById("nortemVideo");

  if (nortemVideo) {
    // Inicia vídeo com som apenas ao clicar em botões com href="#video"
    document.querySelectorAll('a[href="#video"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        nortemVideo.muted = false;
        nortemVideo.play().catch(() => {
          nortemVideo.muted = true;
          nortemVideo.play().catch(() => {});
        });
        // Desktop: rola direto ao vídeo com offset (pula o cabeçalho da seção)
        // Mobile: rola ao início da seção normalmente
        if (window.innerWidth > 960) {
          const SCROLL_OFFSET = 160; // px do topo do viewport — ajuste aqui se necessário
          const frame = document.querySelector(".video-frame");
          window.scrollTo({
            top: frame.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET,
            behavior: "smooth"
          });
        } else {
          document.getElementById("video").scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // ---------- BOTÃO DE DESBLOQUEIO PROGRESSIVO ----------
    const btnAgendar   = document.getElementById("btnAgendar");
    const unlockFill   = document.getElementById("unlockFill");
    const unlockPct    = document.getElementById("unlockPct");
    const labelLocked  = btnAgendar ? btnAgendar.querySelector(".label-locked")   : null;
    const iconLocked   = btnAgendar ? btnAgendar.querySelector(".icon-locked")    : null;
    const labelUnlocked = btnAgendar ? btnAgendar.querySelector(".label-unlocked") : null;
    const UNLOCK_AT    = 120; // segundos (2 min)
    let isUnlocked     = false;

    if (btnAgendar) {
      nortemVideo.addEventListener("timeupdate", () => {
        if (isUnlocked) return;
        const pct = Math.min(nortemVideo.currentTime / UNLOCK_AT, 1);
        const pctInt = Math.floor(pct * 100);

        // Atualiza barra e porcentagem
        unlockFill.style.width = (pct * 100).toFixed(1) + "%";
        unlockPct.textContent  = pctInt + "%";

        if (pct >= 1) {
          isUnlocked = true;

          // Barra completa
          unlockFill.style.width = "100%";
          unlockPct.textContent  = "100%";

          // Troca conteúdo do botão
          if (iconLocked)    iconLocked.hidden    = true;
          if (labelLocked)   labelLocked.hidden   = true;
          if (labelUnlocked) labelUnlocked.hidden = false;

          // Desbloqueia e anima
          btnAgendar.classList.remove("locked");
          btnAgendar.classList.add("unlocked");
        }
      });
    }
  }

  /* ---------- WHATSAPP DINÂMICO --------------------------- */
  document.querySelectorAll(`a[href^="https://wa.me/"]`).forEach((a) => {
    a.href = `https://wa.me/${WHATSAPP_NUMBER}`;
  });

  /* ---------- MÁSCARA DE TELEFONE ------------------------- */
  const phoneInput = document.querySelector('input[name="whatsapp"]');
  if (phoneInput) {
    phoneInput.addEventListener("input", (e) => {
      let v = e.target.value.replace(/\D/g, "").slice(0, 11);
      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
      } else if (v.length > 0) {
        v = v.replace(/^(\d*)/, "($1");
      }
      e.target.value = v;
    });
  }

  /* ---------- FORMULÁRIO ---------------------------------- */
  const form = document.getElementById("leadForm");
  const msgSuccess = document.getElementById("formSuccess");
  const msgWarning = document.getElementById("formWarning");
  const msgError = document.getElementById("formError");
  const phoneErrorEl = document.getElementById("phoneError");

  const hideMessages = () => {
    msgSuccess.hidden = true;
    msgWarning.hidden = true;
    msgError.hidden = true;
    if (phoneErrorEl) phoneErrorEl.hidden = true;
  };

  // Valida o telefone e exibe mensagem específica
  const validatePhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 11) {
      phoneErrorEl.hidden = true;
      return true;
    }
    if (digits.length === 10) {
      phoneErrorEl.innerHTML = "Número incompleto — esqueceu o <strong>9</strong> na frente? Ex: (XX) <strong>9</strong>XXXX-XXXX";
    } else {
      phoneErrorEl.innerHTML = "Informe o WhatsApp com DDD + 9 dígitos (11 no total).";
    }
    phoneErrorEl.hidden = false;
    return false;
  };

  // Valida ao sair do campo
  if (phoneInput) {
    phoneInput.addEventListener("blur", () => validatePhone(phoneInput.value));
    phoneInput.addEventListener("input", () => {
      if (!phoneErrorEl.hidden) validatePhone(phoneInput.value);
    });
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideMessages();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Validação explícita do telefone (11 dígitos)
    if (phoneInput && !validatePhone(phoneInput.value)) {
      phoneInput.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    data._origem = "Landing Page Nortem";
    data._pagina = window.location.href;
    data._enviado_em = new Date().toISOString();

    // Identifica leads abaixo de R$ 100 mil para mostrar mensagem específica.
    // OBS: TODOS os leads são enviados à planilha — esta variável serve só
    // para customizar a mensagem na tela.
    const underQualifiedRanges = ["ate_30k", "31k_50k", "51k_70k", "71k_100k"];
    const isUnderQualified = underQualifiedRanges.includes(data.faturamento);

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalLabel = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = "Enviando...";

    try {
      const isConfigured = SHEETS_ENDPOINT && !SHEETS_ENDPOINT.startsWith("COLE_AQUI");

      if (isConfigured) {
        // O Apps Script não retorna cabeçalhos CORS padrão; usamos
        // text/plain para que o navegador trate como "simple request"
        // e não dispare preflight (que seria bloqueado).
        const response = await fetch(SHEETS_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(data),
          redirect: "follow"
        });
        if (!response.ok) throw new Error("HTTP " + response.status);
      } else {
        // Modo demo: sem endpoint configurado, simula sucesso
        console.warn(
          "[Nortem] SHEETS_ENDPOINT não configurado. Edite assets/js/script.js."
        );
        await new Promise((r) => setTimeout(r, 600));
      }

      // Exibe mensagem apropriada
      if (isUnderQualified) msgWarning.hidden = false;
      else msgSuccess.hidden = false;

      form.reset();

      const visibleMsg = isUnderQualified ? msgWarning : msgSuccess;
      visibleMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error("[Nortem] Erro ao enviar formulário:", err);
      msgError.hidden = false;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
    }
  });
})();
