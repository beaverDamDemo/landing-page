"use strict";!function(){var n=0;$("body").removeClass("loading");(new Date).getTime(),performance.timing.navigationStart;var i=window.performance.timing,a=-(i.loadEventEnd-i.navigationStart),s=100*parseInt(a/1e3%60);$(".loadbar").animate({width:"100%"},s),$.getJSON("assets/json/data.json",function(i){$(".preloader-wrapper").removeClass("active");for(var a=0;a<i.skills.length;a++){var n="";n+="<div class='skill-wrapper'>",n+="<div class='skill skill__label'>"+i.skills[a].label+"</div>",n+="<div class='skill skill__value'>"+i.skills[a].value+"</div>",n+="<div class='skill skill__bar' style='max-width: "+100*i.skills[a].value+"%'>",n+="<div class='inner'></div></div>",n+="</div>",$("section#section-skills .wrapper").append(n)}}),$("#header__icon").click(function(i){i.preventDefault(),$("body").toggleClass("with--sidebar")}),$("#site-cache").click(function(i){$("body").removeClass("with--sidebar")}),$("header a").on("click",function(){$("header a").removeClass("active"),$(this).addClass("active")}),$("main").addClass("active"),$(".navigation-wrapper").addClass("active"),$("#playButton").one("click",function(i){$("#playButton").addClass("hidden"),createjs.WebAudioPlugin.isSupported()&&createjs.WebAudioPlugin.context.resume()}),$("nav a").on("click",function(i){var a=Math.abs(n-parseInt($(this).attr("id").split("-")[2]));n=parseInt($(this).attr("id").split("-")[2]),$("main").css({transform:"translateX(-"+100*parseInt($(this).attr("id").split("-")[2])+"%)",transition:"transform "+.8*a+"s"})}),$("#a-link-0").on("click",function(){}),$("#a-link-1").on("click",function(){}),$("#a-link-2").on("click",function(){}),$("#a-link-3").on("click",function(){}),$("#a-link-4").on("click",function(){})}();