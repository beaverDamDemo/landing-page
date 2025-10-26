(function () {
  "use strict";

  let currentStep = 0;
  let sectionHiTimeline = null;
  let sectionSkillsTimeline = null;
  let sectionUniTimeline = null;
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

      json.skills.forEach((category) => {
        // Optional: Add category heading
        const $categoryHeading = $("<h2>")
          .addClass("skill-category")
          .text(category.type);
        $("section#section-2-skills .wrapper").append($categoryHeading);

        category.technologies.forEach((tech) => {
          const $wrapper = $("<div>").addClass("skill-wrapper");

          $wrapper.append(
            $("<div>").addClass("skill skill__label").text(tech.label)
          );
          // Optional: show value
          // $wrapper.append(
          //   $("<div>").addClass("skill skill__value").text(tech.value)
          // );

          const $bar = $("<div>").addClass("skill skill__bar");
          const $background = $("<div>").addClass("skill__bar__background");
          const $fixed = $("<div>").addClass("skill__bar__fixed");
          const $dynamic = $("<div>")
            .addClass("skill__bar__dynamic")
            .css("width", "100%")
            .attr("data-targetwidth", `${100 * (1 - tech.value)}%`);

          $fixed.append($dynamic);
          $background.append($fixed);
          $bar.append($background);
          $wrapper.append($bar);

          $("section#section-2-skills .wrapper").append($wrapper);
        });
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
      .to("#section-1-hi h1", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: 0.3,
        ease: "power2.out",
      })
      .to("#section-1-hi h2", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: -1.0,
        ease: "power2.out",
      })
      .to("#section-1-hi p", {
        opacity: 1,
        y: 0,
        duration: 1.5,
        delay: -1.0,
        stagger: 0.4,
        ease: "power2.out",
      });
  }

  function resetSectionHi() {
    gsap.set("#section-1-hi h1, #section-1-hi h2, #section-1-hi p", {
      opacity: 0,
      y: 150,
    });
  }

  function animateSectionSkills() {
    const bars = gsap.utils.toArray("#section-2-skills .skill__bar__dynamic");
    const labels = gsap.utils.toArray("#section-2-skills .skill__label");

    gsap.set(bars, { width: "100%" });
    gsap.set(labels, { opacity: 0, x: -30 });

    sectionSkillsTimeline = gsap.timeline();

    labels.forEach((label, i) => {
      const bar = bars[i];
      const targetWidth = bar.dataset.targetwidth || "0%";

      const tl = gsap.timeline();
      tl.to(label, {
        opacity: 1,
        x: 0,
        duration: 0.2,
        ease: "power2.out",
      }).to(
        bar,
        {
          width: targetWidth,
          duration: 0.4,
          ease: "power2.out",
        },
        "-=0.1"
      );

      sectionSkillsTimeline.add(tl, i * 0.15);
    });
  }

  function resetSectionSkills() {
    const bars = gsap.utils.toArray("#section-2-skills .skill__bar__dynamic");
    const labels = gsap.utils.toArray("#section-2-skills .skill__label");

    gsap.set(bars, { width: "100%" });
    gsap.set(labels, { opacity: 0, x: -30 });
  }

  function animateSectionUniSubjects() {
    const items = gsap.utils.toArray(
      "#section-3-uni-subjects .subject-list li"
    );

    gsap.set(items, { opacity: 0, x: -30 });

    sectionUniTimeline = gsap.timeline();

    sectionUniTimeline.to(items, {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: "power2.out",
      stagger: 0.1,
    });
  }

  function resetSectionUniSubjects() {
    const items = gsap.utils.toArray(
      "#section-3-uni-subjects .subject-list li"
    );
    gsap.set(items, { opacity: 0, x: -30 });
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

    if (sectionId === "section-1-hi") {
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
    } else if (sectionId === "section-2-skills") {
      const delay = diff * 800;
      resetSectionSkills();
      setTimeout(() => {
        animateSectionSkills();
      }, delay);
    } else if (sectionId === "section-3-uni-subjects") {
      const delay = diff * 800;
      resetSectionUniSubjects();
      setTimeout(() => {
        animateSectionUniSubjects();
      }, delay);
    } else {
      if (sectionUniTimeline) {
        sectionUniTimeline.kill();
        sectionUniTimeline = null;
      }
      resetSectionUniSubjects();
      if (sectionSkillsTimeline) {
        sectionSkillsTimeline.kill();
        sectionSkillsTimeline = null;
      }
      resetSectionSkills();
    }
  });
})();
