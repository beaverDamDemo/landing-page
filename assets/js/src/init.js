(function () {
  "use strict";

  let currentStep = 0;
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
      console.log(json);
      $(".preloader-wrapper").removeClass("active");

      json.skills.forEach((skill) => {
        const $wrapper = $("<div>").addClass("skill-wrapper");
        $wrapper.append(
          $("<div>").addClass("skill skill__label").text(skill.label)
        );
        $wrapper.append(
          $("<div>").addClass("skill skill__value").text(skill.value)
        );

        const $bar = $("<div>").addClass("skill skill__bar");
        const $background = $("<div>").addClass("skill__bar__background");
        const $fixed = $("<div>").addClass("skill__bar__fixed");
        const $dynamic = $("<div>")
          .addClass("skill__bar__dynamic")
          .css("max-width", `${100 * (1 - skill.value)}%`);

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
      transform: `translateX(-${step * 20}%)`,
      transition: `transform ${diff * 0.8}s`,
    });
  });

  const sectionMap = {
    "#a-link-0": "section-skills",
    "#a-link-1": "fri-subjects",
    "#a-link-2": "showroom",
    "#a-link-3": "animated-cv",
  };

  Object.entries(sectionMap).forEach(([linkId, sectionId]) => {
    $(linkId).on("click", () => {
      $("main section").removeClass("active");
      $("#container").toggleClass("scrollable", sectionId === "animated-cv");
      $(`main section#${sectionId}`).addClass("active");
    });
  });
})();
