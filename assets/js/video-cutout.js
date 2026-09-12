/**
 * Recorta o Carlos do fundo preto do vídeo com alpha real (por luminância),
 * em vez de mix-blend-mode: screen — que deixaria qualquer coisa atrás
 * vazando por trás de sombras escuras na roupa/cabelo. Aqui só o fundo
 * realmente preto vira transparente; o resto fica opaco.
 *
 * Mesma técnica usada no Site-Criações (VideoCutout.tsx), portada para JS puro.
 * Toca uma vez e congela no último frame.
 */
(function () {
  "use strict";

  const LOW = 24;
  const HIGH = 68;
  const FLOOR = 0;
  const SPAN = 255 - FLOOR;
  // O vídeo-fonte já é só 1280x720 — processar no tamanho nativo em vez de
  // reduzir evita que o canvas fique borrado ao ser exibido maior que o
  // buffer interno (esticar um bitmap pequeno num box CSS grande borra).
  const MAX_EDGE = 1280;
  // Some parado no primeiro frame por 1s antes de começar a tocar.
  const START_DELAY_MS = 1000;

  function initCutout(canvas) {
    const src = canvas.dataset.heroCutout;
    if (!src) return;

    const video = document.createElement("video");
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.style.cssText = "position:absolute;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;";
    canvas.parentNode.insertBefore(video, canvas);

    const visibleCtx = canvas.getContext("2d");
    if (!visibleCtx) return;
    visibleCtx.imageSmoothingEnabled = true;
    visibleCtx.imageSmoothingQuality = "high";

    // A leitura/escrita de pixels (getImageData/putImageData) precisa
    // acontecer fora do canvas visível — direto nele intermitentemente
    // deixava a tela em branco em alguns navegadores.
    const work = document.createElement("canvas");
    const workCtx = work.getContext("2d", { willReadFrequently: true });
    if (!workCtx) return;
    workCtx.imageSmoothingEnabled = true;
    workCtx.imageSmoothingQuality = "high";

    let raf = 0;
    let finished = false;
    let onScreen = false;
    let sized = false;
    let revealed = false;
    let startAllowed = false;
    let startArmed = false;

    const draw = () => {
      if (!sized) return;
      const w = work.width;
      const h = work.height;
      workCtx.drawImage(video, 0, 0, w, h);
      const frame = workCtx.getImageData(0, 0, w, h);
      const d = frame.data;
      for (let i = 0; i < d.length; i += 4) {
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        d[i + 3] =
          lum <= LOW
            ? FLOOR
            : lum >= HIGH
              ? 255
              : FLOOR + ((lum - LOW) / (HIGH - LOW)) * SPAN;
      }
      workCtx.putImageData(frame, 0, 0);
      visibleCtx.clearRect(0, 0, canvas.width, canvas.height);
      visibleCtx.drawImage(work, 0, 0);
      if (!revealed) {
        revealed = true;
        canvas.style.opacity = "1";
      }
    };

    const runLoop = () => {
      draw();
      raf = requestAnimationFrame(runLoop);
    };

    const play = () => {
      if (raf || finished || !sized || !onScreen || !startAllowed) return;
      if (document.visibilityState === "hidden") return;
      raf = requestAnimationFrame(runLoop);
      video.play().catch(() => {});
    };

    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (!video.paused) video.pause();
    };

    const size = () => {
      if (sized) return;
      const vw = video.videoWidth || 1280;
      const vh = video.videoHeight || 720;
      const scale = Math.min(1, MAX_EDGE / Math.max(vw, vh));
      const w = Math.max(1, Math.round(vw * scale));
      const h = Math.max(1, Math.round(vh * scale));
      canvas.width = w;
      canvas.height = h;
      work.width = w;
      work.height = h;
      sized = true;
    };

    // Revela o primeiro frame parado assim que há dados de fato decodificados
    // (readyState >= 2 — antes disso drawImage desenharia um frame em branco),
    // e só então arma o atraso de 1s antes de deixar o vídeo tocar de verdade.
    const armStart = () => {
      if (!sized || startArmed || video.readyState < 2) return;
      startArmed = true;
      draw();
      window.setTimeout(() => {
        startAllowed = true;
        play();
      }, START_DELAY_MS);
    };

    const onLoadedMetadata = () => {
      size();
      armStart();
    };

    const onLoadedData = () => {
      armStart();
    };

    // Rede de segurança: se o navegador jogar o rAF pra um ritmo muito baixo
    // com a aba ainda "visível" (janela ocupada por outra), o timeupdate
    // ainda dispara porque segue o relógio da mídia, não o de pintura.
    const onTimeUpdate = () => {
      if (raf || finished || !onScreen) return;
      if (document.visibilityState === "hidden") return;
      draw();
    };

    const onEnded = () => {
      finished = true;
      pause();
      draw();
    };

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    if (video.readyState >= 1) onLoadedMetadata();
    if (video.readyState >= 2) onLoadedData();

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting;
        if (onScreen) play();
        else pause();
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") pause();
      else play();
    });
  }

  function init() {
    document.querySelectorAll("canvas[data-hero-cutout]").forEach(initCutout);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
