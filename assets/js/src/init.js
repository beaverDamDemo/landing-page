(function () {
  "use strict";

  let currentStep = 0;
  let sectionHiTimeline = null;
  document.body.classList.remove("loading");

  const now = Date.now();
  const pageLoadTime = now - performance.timing.navigationStart;
  console.warn(`User-perceived page loading time: ${pageLoadTime}ms`);

  const perfData = performance.timing;
  const estimatedTime = perfData.loadEventEnd - perfData.navigationStart;
  const animationTime = Math.min(estimatedTime, 5000);

  $(".loadbar").animate({ width: "100%" }, animationTime);

  $.getJSON("assets/json/data.json")
    .done((json) => {
      $(".preloader-wrapper").removeClass("active");

      json.skills.forEach((skill) => {
        const $wrapper = $("<div>").addClass("skill-wrapper");
        $wrapper.append(
          $("<div>").addClass("skill skill__label").text(skill.label)
        );
        // $wrapper.append(
        //   $("<div>").addClass("skill skill__value").text(skill.value)
        // );

        const $bar = $("<div>").addClass("skill skill__bar");
        const $background = $("<div>").addClass("skill__bar__background");
        const $fixed = $("<div>").addClass("skill__bar__fixed");
        const $dynamic = $("<div>")
          .addClass("skill__bar__dynamic")
          .css("width", "100%")
          .data("targetWidth", `${100 * (1 - skill.value)}%`)
          .attr("data-targetwidth", `${100 * (1 - skill.value)}%`);

        $fixed.append($dynamic);
        $background.append($fixed);
        $bar.append($background);
        $wrapper.append($bar);

        $("section#section-skills .wrapper").append($wrapper);
      });
    })
    .fail((jqxhr, textStatus, error) => {
      console.error("Failed to load skills JSON:", error);
    });

  $("#header__icon").on("click", (e) => {
    e.preventDefault();
    $("body").toggleClass("with--sidebar");
  });

  $("#site-cache").on("click", () => {
    $("body").removeClass("with--sidebar");
  });

  $("header a").on("click", function () {
    $("header a").removeClass("active");
    $(this).addClass("active");
  });

  $("main, .navigation-wrapper").addClass("active");

  function animateSectionHi() {
    sectionHiTimeline = gsap.timeline();

    sectionHiTimeline
      .to("#section-hi h1", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.3,
        ease: "power2.out",
      })
      .to("#section-hi h2", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: -1.0,
        ease: "power2.out",
      })
      .to("#section-hi p", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: -1.0,
        stagger: 0.4,
        ease: "power2.out",
      });
  }

  function resetSectionHi() {
    gsap.set("#section-hi h1, #section-hi h2, #section-hi p", {
      opacity: 0,
      y: 150,
    });
  }

  function animateSectionSkills() {
    const bars = gsap.utils.toArray("#section-skills .skill__bar__dynamic");

    gsap.set(bars, { width: "100%" });

    const tl = gsap.timeline();

    tl.to(bars, {
      width: (i, target) => target.dataset.targetwidth || "0%",
      duration: 1,
      ease: "power2.out",
      stagger: 0.075,
    });
  }

  function resetSectionSkills() {
    const bars = gsap.utils.toArray("#section-skills .skill__bar__dynamic");
    gsap.set(bars, { width: "100%" });
  }

  resetSectionHi();
  animateSectionHi();

  $("#playButton").one("click", () => {
    $("#playButton").addClass("hidden");
    if (createjs.WebAudioPlugin.isSupported()) {
      createjs.WebAudioPlugin.context.resume();
    }
  });

  $("nav a").on("click", function () {
    const step = parseInt(this.id.split("-")[2]);
    const diff = Math.abs(currentStep - step);
    currentStep = step;

    $("main").css({
      transform: `translateX(-${step * 16.66}%)`,
      transition: `transform ${diff * 0.8}s`,
    });

    const sectionId = $(this).data("section");

    $("main section").removeClass("active");
    $("#container").toggleClass(
      "scrollable",
      sectionId === "section-animated-cv"
    );
    $(`main section#${sectionId}`).addClass("active");

    if (sectionId === "section-hi") {
      const delay = diff * 800;
      setTimeout(() => {
        animateSectionHi();
      }, delay);
    } else {
      if (sectionHiTimeline) {
        sectionHiTimeline.kill();
        sectionHiTimeline = null;
      }
      resetSectionHi();
    }

    if (sectionId === "section-animated-cv") {
      const iframe = document.querySelector("iframe");
      iframe.contentWindow.postMessage(
        { type: "restart" },
        "https://beaverdamdemo.github.io"
      );
    } else if (sectionId === "section-skills") {
      const delay = diff * 800;
      resetSectionSkills();
      setTimeout(() => {
        animateSectionSkills();
      }, delay);
    }
  });
})();
