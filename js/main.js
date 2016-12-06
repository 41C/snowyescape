(function($) {

	// set starting values for audio channels
	var seSnowVolume = readCookie('windVolumeCookie')?readCookie('windVolumeCookie'):15;
	var seFireVolume = readCookie('fireVolumeCookie')?readCookie('fireVolumeCookie'):75;
	var textDisplay = readCookie('textCookie')?readCookie('textCookie'):1;
	var isGray = 0;

	$(document).ready(function(){
		$(".audio-wind").prop("volume", (seSnowVolume / 100));
		$(".audio-fire").prop("volume", (seFireVolume / 100));
		adjustBackground(isGray);
		setInterval(adjustBackground(isGray),10000);
		$(".value-wind").html(seSnowVolume);
		$(".value-fire").html(seFireVolume);
		if(textDisplay == 0){
			textDisplay = 1; // Prevent the value from changing
			$(".hide-text").trigger("click");
		}
	});

	// User volume adjustments
	$("a.volume-up-fire").click(volumeUpFire);
	$("a.volume-down-fire").click(volumeDownFire);
	$("a.volume-up-wind").click(volumeUpWind);
	$("a.volume-down-wind").click(volumeDownWind);

	$("a.mute").click(toggleMute);
	$(".page").click(function(){
		$("#trigger-menu").attr('checked', false);
	})

	// User volume adjustments
	function volumeUpFire(){
		var volume = $(".audio-fire").prop("volume")+0.05;
		if(volume > 1){
			volume = 1;
		}
		$(".audio-fire").prop("volume",volume);
		updateFire(volume);
	}

	function volumeDownFire(){
		var volume = $(".audio-fire").prop("volume")-0.05;
		if(volume < 0){
			volume = 0;
		}
		$(".audio-fire").prop("volume",volume);
		updateFire(volume);
	}

	function volumeUpWind(){
		var volume = $(".audio-wind").prop("volume")+0.05;
		if(volume > 1){
			volume = 1;
		}
		$(".audio-wind").prop("volume",volume);
		updateWind(volume);
	}

	function volumeDownWind(){
		var volume = $(".audio-wind").prop("volume")-0.05;
		if(volume < 0){
			volume = 0;
		}
		$(".audio-wind").prop("volume",volume);
		updateWind(volume);
	}

	function updateWind(volume){
		volume = Math.round(volume * 100);
		$(".value-wind").html(volume);
		seSnowVolume = volume;
		createCookie('windVolumeCookie',volume,100);
		watchSnowVolume();
	}

	function updateFire(volume){
		volume = Math.round(volume * 100);
		$(".value-fire").html(volume);
		seFireVolume = volume;
		createCookie('fireVolumeCookie',volume,100);
		watchFireVolume();
	}

	// report volume if no change after X amount of time.
	function watchSnowVolume() {
		var tmp_volume = seSnowVolume;
		setTimeout(function () {
			if (tmp_volume == seSnowVolume) {
				ga('send', 'event', 'Volume-Beta', 'updated', 'Snow volume at ' + seSnowVolume);
			} else {
				tmp_volume = seSnowVolume;
			}
		}, 3000);
	}

	// report volume if no change after X amount of time.
	function watchFireVolume() {
		var tmp_volume = seFireVolume;
		setTimeout(function () {
			if (tmp_volume == seFireVolume) {
				ga('send', 'event', 'Volume-Beta', 'updated', 'Fire volume at ' + seFireVolume);
			} else {
				tmp_volume = seFireVolume;
			}
		}, 3000);
	}

	watchSnowVolume();
	watchFireVolume();
	function toggleMute(){
		$(".audio-wind").prop("muted",!$(".audio-wind").prop("muted"));
		$(".audio-fire").prop("muted",!$(".audio-fire").prop("muted"));
		$(this).toggleClass("muted");
	}

	// preloader
	$(window).load(function() {
		$("#loading").fadeOut("fast");
	})

	// mobile device checks and media handling
	var isMobile = {
		Android: function() {
			return navigator.userAgent.match(/Android/i);
		},
		BlackBerry: function() {
			return navigator.userAgent.match(/BlackBerry/i);
		},
		iOS: function() {
			return navigator.userAgent.match(/iPhone|iPad|iPod/i);
		},
		Opera: function() {
			return navigator.userAgent.match(/Opera Mini/i);
		},
		Windows: function() {
			return navigator.userAgent.match(/IEMobile/i);
		},
		any: function() {
			return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
		}
	};

	if(isMobile.any()){
		$("body").addClass("mobile");
		$(".audio-wind").trigger('pause').remove();
		$(".audio-fire").trigger('pause').remove();
	} else {
		$(".audio-wind").trigger('play');
		$(".audio-fire").trigger('play');
		$(".audio-mobile").trigger('pause');
	}

	var mobileState = 2;
	$(".mobile-play").click(function(){
		if(mobileState % 2 == 0){
			$(".audio-mobile").trigger('play');
			$(this).addClass("playing");
			mobileState++;
			ga('send', 'event', 'Controls', 'play', 'mobile-audio');
		}
		else{
			$(this).removeClass("playing");
			$(".audio-mobile").trigger('pause');
			mobileState++;
			ga('send', 'event', 'Controls', 'pause', 'mobile-audio');
		}
	});

	$('.hide-text').click( function(){
		$('.title').toggleClass("hide");
		$('footer').toggleClass("hide");
		var social_share = $('.social-share');
		social_share.toggleClass("hide");
		if(social_share.hasClass("hide")){
			social_share.css("display", "none");
		}
		else{
			social_share.css("display", "block");
		}
		$('#btn-menu').toggleClass("shrink");
		$('.hide-text').html($('.hide-text').text() == 'Hide Text' ? 'Show Text' : 'Hide Text');
		ga('send', 'event', 'Controls', 'toggle', 'hide/show text');
		textDisplay = (textDisplay==1)?0:1;
		createCookie('textCookie',textDisplay,100);
	});

	// spacebar pausing
	$('body').keyup(function(e){
		// toggle mute
		if(e.keyCode == 32){
			$('.mute').trigger('click');
		}
		// toggle grayscale
		if(e.keyCode == 71){
			$('video.fire').toggleClass("grayscale");
			$('.img-main').toggleClass("grayscale");
			isGray = 1 - isGray;
			adjustBackground(isGray);
			ga('send', 'event', 'Controls', 'toggled', 'grayscale');
		}
		// toggle hide/show text
		if(e.keyCode == 72){
			$('.hide-text').trigger('click');
		}
		// toggle hide/show menu
		if(e.keyCode == 77){
			$('#trigger-menu').trigger('click');
		}
	});

	// Brightness variation throughout the day
	var brightness = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
					11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

	// Adjust image brightness and contrast according to the time of the day
	function adjustBackground(isGray){
		var vid = document.getElementById('snow');
		var date = new Date();

		var brightness_min = 20;
		var brightness_max = 120;

		var current_hour = (date.getHours())%24;
		var current_minute = (date.getMinutes())%60;
		var brightness_prev = brightness[current_hour];
		var brightness_next = brightness[(current_hour+1)%24];

		// Peak brightness at 12 hrs and peak darkness at 0 hrs
		var cur_brightness = (brightness_prev * (60-current_minute) + brightness_next * (current_minute)) / 60;
		var scale_brightness = Math.round(brightness_min + (cur_brightness / 12.0) * (brightness_max - brightness_min));

		if (!isGray) {
			vid.style["-webkit-filter"] = "brightness(" + scale_brightness.toString() + "%)";
			vid.style["filter"] = "brightness(" + scale_brightness.toString() + "%)";
		}
		else {
			vid.style["-webkit-filter"] = "grayscale(100%)";
			vid.style["filter"] = "grayscale(100%)";
		}
	}

	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var devmode = parseInt(getParameterByName('dev'));

	if (devmode==1) {
		$('body').addClass('dev');
	}

	//Creating Cookie
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	// Reading Cookie Value
	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	//Erasing Cookie
	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

})( jQuery );
