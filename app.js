// Little Lemon showcase — scroll reveals + guided phone tour
(function () {
  "use strict";

  var frame = document.getElementById("app-frame");
  var loader = document.getElementById("phone-loader");
  var toast = document.getElementById("phone-toast");
  var toastDetail = document.getElementById("toast-detail");
  var tourBtn = document.getElementById("tour-btn");
  var ctaTour = document.getElementById("cta-tour");
  var caption = document.getElementById("tour-caption");
  var progress = document.getElementById("tour-progress").children;
  var stepEls = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var touring = false;

  /* ---------- scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });

  /* ---------- iframe helpers (same origin) ---------- */
  function frameReady() {
    return new Promise(function (resolve) {
      try {
        if (frame.contentDocument && frame.contentDocument.readyState === "complete") return resolve();
      } catch (e) { /* cross-origin guard */ }
      frame.addEventListener("load", function onLoad() {
        frame.removeEventListener("load", onLoad);
        setTimeout(resolve, 600); // let React hydrate
      });
    });
  }
  function doc() { return frame.contentDocument; }
  function q(sel) { return doc().querySelector(sel); }
  function go(path) {
    return new Promise(function (resolve) {
      frame.addEventListener("load", function onLoad() {
        frame.removeEventListener("load", onLoad);
        setTimeout(resolve, 700);
      });
      frame.src = path;
    });
  }
  function scrollToEl(sel) {
    var el = q(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function typeInto(input, text) {
    return new Promise(function (resolve) {
      input.focus();
      var i = 0;
      (function tick() {
        if (i <= text.length) {
          input.value = text.slice(0, i);
          input.dispatchEvent(new Event("input", { bubbles: true }));
          i++;
          setTimeout(tick, 55 + Math.random() * 60);
        } else resolve();
      })();
    });
  }

  function setCaption(text) {
    caption.classList.add("typing");
    caption.textContent = text;
    setTimeout(function () { caption.classList.remove("typing"); }, 1200);
  }

  function markStep(i) {
    stepEls.forEach(function (el, j) {
      el.classList.toggle("active", j === i);
      el.classList.toggle("done", j < i);
    });
    for (var k = 0; k < progress.length; k++) {
      progress[k].classList.toggle("on", k <= i);
    }
  }

  function resetTour() {
    toast.hidden = true;
    stepEls.forEach(function (el) { el.classList.remove("active", "done"); });
    for (var k = 0; k < progress.length; k++) progress[k].classList.remove("on");
  }

  /* ---------- the tour ---------- */
  async function playTour() {
    if (touring) return;
    touring = true;
    tourBtn.disabled = true;
    tourBtn.innerHTML = "⏳&nbsp; Playing…";
    resetTour();
    toast.hidden = true;

    await frameReady();
    loader.classList.add("done");

    // Step 1 — specials
    markStep(0);
    setCaption("Browsing this week's specials — Greek salad, bruschetta, lemon dessert…");
    if (!q(".specials-intro")) await go("app/");
    await sleep(300);
    scrollToEl(".specials-intro");
    await sleep(2600);

    // Step 2 — testimonials
    markStep(1);
    setCaption("Guests love it — let's check the reviews.");
    scrollToEl(".testimonials-intro");
    await sleep(2600);

    // Step 3 — booking page
    markStep(2);
    setCaption("Time to reserve — heading to the booking page.");
    await go("app/booking");
    scrollToEl(".booking-form");
    await sleep(1800);

    // Step 4 — fill the form
    markStep(3);
    setCaption("Filling in the reservation…");
    var d = doc();
    await typeInto(d.getElementById("name"), "Julio");
    await typeInto(d.getElementById("email"), "julio@example.com");
    var tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
    var dateEl = d.getElementById("date");
    dateEl.value = tomorrow;
    dateEl.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(350);
    var timeEl = d.getElementById("time");
    timeEl.value = "19:30";
    timeEl.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(350);
    var guestsEl = d.getElementById("guests");
    guestsEl.value = "2";
    guestsEl.dispatchEvent(new Event("input", { bubbles: true }));
    await sleep(350);
    var occ = d.getElementById("occasion");
    occ.value = "date-night";
    occ.dispatchEvent(new Event("change", { bubbles: true }));
    await sleep(900);

    // Confirmation animation
    toastDetail.textContent = "Julio · 2 guests · " + tomorrow + " at 19:30 🍋";
    toast.hidden = false;
    setCaption("Done — table for 2, tomorrow at 19:30. Enjoy! 🍋");
    await sleep(3200);
    toast.hidden = true;

    stepEls.forEach(function (el) { el.classList.remove("active"); el.classList.add("done"); });
    tourBtn.disabled = false;
    tourBtn.innerHTML = "↻&nbsp; Replay the tour";
    touring = false;
  }

  tourBtn.addEventListener("click", playTour);
  ctaTour.addEventListener("click", function () {
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
    setTimeout(playTour, 800);
  });

  // hide loader once the app first renders
  frameReady().then(function () { loader.classList.add("done"); });
})();
