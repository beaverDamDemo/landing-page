(function () {
  "use strict";
  var currentStep = 0;
  $("body").removeClass("loading");

  /* preloader */
  var now = new Date().getTime();
  var page_load_time = now - performance.timing.navigationStart;
  console.warn("User-perceived page loading time: " + page_load_time);
  var width = 100,
    perfData = window.performance.timing,
    EstimatedTime = -(perfData.loadEventEnd - perfData.navigationStart),
    time = parseInt((EstimatedTime / 1000) % 60) * 100;
  console.log("estimated time: ", time);
  $(".loadbar").animate(
    {
      width: width + "%",
    },
    time
  );

  /* load json with skills */
  $.getJSON("assets/json/data.json", function (json) {
    console.log(json); // this will show the info it in firebug console
    $(".preloader-wrapper").removeClass("active");

    for (var i = 0; i < json.skills.length; i++) {
      var appendString = "";
      appendString += "<div class='skill-wrapper'>";
      appendString +=
        "<div class='skill skill__label'>" + json.skills[i].label + "</div>";
      appendString +=
        "<div class='skill skill__value'>" + json.skills[i].value + "</div>";
      appendString += "<div class='skill skill__bar'>";
      appendString += "<div class='skill__bar__background'>";
      appendString += "<div class='skill__bar__fixed' >";
      appendString +=
        "<div class='skill__bar__dynamic' style='max-width: " +
        100 * (1 - json.skills[i].value) +
        "%'></div></div></div>";
      appendString += "</div></div>";
      $("section#section-skills .wrapper").append(appendString);
    }
  });

  $("#header__icon").click(function (e) {
    e.preventDefault();
    $("body").toggleClass("with--sidebar");
  });

  $("#site-cache").click(function (e) {
    $("body").removeClass("with--sidebar");
  });

  $("header a").on("click", function () {
    $("header a").removeClass("active");
    $(this).addClass("active");
  });

  $("main").addClass("active");
  $(".navigation-wrapper").addClass("active");

  $("#playButton").one("click", function (e) {
    $("#playButton").addClass("hidden");
    if (createjs.WebAudioPlugin.isSupported()) {
      createjs.WebAudioPlugin.context.resume();
    }
  });

  $("nav a").on("click", function (e) {
    var diff = Math.abs(
      currentStep - parseInt($(this).attr("id").split("-")[2])
    );
    currentStep = parseInt($(this).attr("id").split("-")[2]);
    $("main").css({
      transform:
        "translateX(-" + parseInt($(this).attr("id").split("-")[2]) * 20 + "%)",
      transition: "transform " + diff * 0.8 + "s",
    });
  });

  $("#a-link-0").on("click", function () {
    $("main section").removeClass("active");
    $("#container").removeClass("scrollable");
    $("main section#section-skills").addClass("active");
  });
  $("#a-link-1").on("click", function () {
    $("main section").removeClass("active");
    $("#container").removeClass("scrollable");
    $("main section#fri-subjects").addClass("active");
  });
  $("#a-link-2").on("click", function () {
    $("main section").removeClass("active");
    $("#container").removeClass("scrollable");
    $("main section#showroom").addClass("active");
  });
  $("#a-link-3").on("click", function () {
    $("main section").removeClass("active");
    $("#container").addClass("scrollable");
    $("main section#animated-cv").addClass("active");
  });
})();
