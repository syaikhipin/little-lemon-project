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
        setTimeout(resolve, 800);
      });
      if (frame.getAttribute("src") === path) {
        frame.contentWindow.location.reload(); // same src: force a real reload
      } else {
        frame.src = path;
      }
    });
  }
  function scrollToEl(sel) {
    var el = q(sel);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function setNativeValue(input, text) {
    // React controlled inputs ignore a plain `input.value = x`: bypass
    // React's value tracker via the native setter from the element's own
    // realm, then dispatch input so onChange fires.
    var setter = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(input), "value").set;
    setter.call(input, text);
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }

  function typeInto(input, text) {
    return new Promise(function (resolve) {
      input.focus();
      var i = 0;
      (function tick() {
        if (i <= text.length) {
          setNativeValue(input, text.slice(0, i));
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

  function goProfile() {
    var d = doc();
    var deskLink = d.querySelector('.menu-desktop #nav-profile');
    if (deskLink && deskLink.getClientRects().length > 0) {
      deskLink.click();
      return sleep(400);
    }
    // mobile layout: open the hamburger menu first
    d.querySelector('nav button').click();
    return sleep(600).then(function () {
      d.querySelector('#nav-profile-mobile').click();
      return sleep(400);
    });
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

  /* ---------- the tour: the rubric flow, driven live ---------- */
  async function onboard(d) {
    await typeInto(d.getElementById("ob-firstname"), "Julio");
    await typeInto(d.getElementById("ob-lastname"), "Akbar");
    await typeInto(d.getElementById("ob-email"), "julio@example.com");
    await sleep(400);
    d.getElementById("ob-submit").click();
    // wait until we actually land on home; throw if onboarding didn't complete
    var ok = false;
    for (var i = 0; i < 20 && !ok; i++) {
      await sleep(300);
      try { ok = !!d.getElementById("menu-search"); } catch (e) { ok = false; }
    }
    if (!ok) throw new Error("onboarding did not complete");
  }

  function tourFailed(msg) {
    setCaption("The tour hit a snag — scroll the phone and try the app live instead. 🍋");
    stepEls.forEach(function (el) { el.classList.remove("active"); });
    tourBtn.disabled = false;
    tourBtn.innerHTML = "↻&nbsp; Replay the tour";
    touring = false;
    if (window.console) console.warn("[tour]", msg);
  }

  async function playTour() {
    if (touring) return;
    touring = true;
    tourBtn.disabled = true;
    tourBtn.innerHTML = "⏳&nbsp; Playing…";
    resetTour();
    toast.hidden = true;

    try {
      await playTourSteps();
    } catch (e) {
      tourFailed(e && e.message);
      return;
    }

    stepEls.forEach(function (el) { el.classList.remove("active"); el.classList.add("done"); });
    tourBtn.disabled = false;
    tourBtn.innerHTML = "↻&nbsp; Replay the tour";
    touring = false;
  }

  async function playTourSteps() {

    await frameReady();
    loader.classList.add("done");

    // start from a clean slate: forget any previous onboarding
    try { frame.contentWindow.localStorage.removeItem("littlelemon_user"); } catch (e) {}
    await go("app/");

    // Step 1 — onboarding
    markStep(0);
    setCaption("First launch? The app asks for your first name, last name and email — and won't let you in without them.");
    await sleep(600);
    await onboard(doc());
    await sleep(800);

    // Step 2 — search the menu
    markStep(1);
    setCaption("Hungry for salad? The hero search bar filters the menu live.");
    scrollToEl("#menu-search");
    await sleep(600);
    await typeInto(q("#menu-search"), "salad");
    await sleep(2400);

    // Step 3 — profile (pre-populated from onboarding)
    markStep(2);
    setCaption("Your profile is pre-filled with the onboarding details.");
    await goProfile();
    await sleep(1400);
    scrollToEl(".profile-form");
    await sleep(1600);

    // Step 4 — log out, then relaunch straight into Home
    markStep(3);
    setCaption("Log out… and you're back at onboarding.");
    q("#pf-logout").click();
    await sleep(1500);

    setCaption("Onboarding again — quick refill, then we relaunch the app.");
    await onboard(doc());

    setCaption("Relaunching…");
    await new Promise(function (resolve) {
      frame.addEventListener("load", function onLoad() {
        frame.removeEventListener("load", onLoad);
        setTimeout(resolve, 1200);
      });
      frame.contentWindow.location.reload();
    });
    var landedHome = !!(function () { try { return q("#menu-search"); } catch (e) { return null; } })();
    setCaption(landedHome
      ? "Straight to Home — no onboarding needed. Persistence works! 🍋"
      : "Relaunched. 🍋");
  }

  tourBtn.addEventListener("click", playTour);
  ctaTour.addEventListener("click", function () {
    document.getElementById("demo").scrollIntoView({ behavior: "smooth" });
    setTimeout(playTour, 800);
  });

  // hide loader once the app first renders
  frameReady().then(function () { loader.classList.add("done"); });
})();
