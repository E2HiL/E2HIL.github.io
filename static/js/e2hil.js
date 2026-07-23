/* ============================================================
   E2HiL — project page interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
    navLinks.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => navLinks.classList.remove("open"))
    );
  }

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => ro.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* ---- Robust play helper: waits for data before calling play() ---- */
  function safePlay(v) {
    if (!v) return;
    if (v.readyState >= 2) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.addEventListener(
        "canplay",
        () => {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        },
        { once: true }
      );
    }
  }

  /* ---- Lazy autoplay videos only when visible (saves bandwidth) ---- */
  const lazyVideos = document.querySelectorAll("video[data-lazy]");
  if ("IntersectionObserver" in window) {
    const vo = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          const v = e.target;
          if (e.isIntersecting) {
            if (v.dataset.init !== "1") {
              v.dataset.init = "1";
              v.preload = "auto";
              v.load();
            }
            safePlay(v);
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.2 }
    );
    lazyVideos.forEach((v) => vo.observe(v));
  } else {
    lazyVideos.forEach((v) => {
      v.preload = "auto";
      v.load();
      safePlay(v);
    });
  }

  /* ---- BibTeX copy ---- */
  const copyBtn = document.getElementById("copyBib");
  const bibText = document.getElementById("bibText");
  if (copyBtn && bibText) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(bibText.innerText.trim());
      } catch (e) {
        const r = document.createRange();
        r.selectNode(bibText);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        document.execCommand("copy");
        sel.removeAllRanges();
      }
      copyBtn.textContent = "Copied!";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copy";
        copyBtn.classList.remove("copied");
      }, 1800);
    });
  }

  /* ---- Shrink nav shadow on scroll ---- */
  const nav = document.getElementById("nav");
  if (nav) {
    const onScroll = () => {
      nav.style.boxShadow = window.scrollY > 8 ? "0 6px 24px rgba(30,58,138,.08)" : "none";
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
})();
