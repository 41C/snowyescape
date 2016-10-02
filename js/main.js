// set starting values for audio channels
var seSnowVolume = 15;
var seFireVolume = 75;

$(document).ready(function(){
	$(".audio-wind").prop("volume", (seSnowVolume / 100));
	$(".audio-fire").prop("volume", (seFireVolume / 100));
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
	if(volume >1){
		volume = 1;
	}
	$(".audio-fire").prop("volume",volume);
	updateFire(volume);
}

function volumeDownFire(){
	var volume = $(".audio-fire").prop("volume")-0.05;
	if(volume <0){
		volume = 0;
	}
	$(".audio-fire").prop("volume",volume);
	updateFire(volume);
}

function volumeUpWind(){
	var volume = $(".audio-wind").prop("volume")+0.05;
	if(volume >1){
		volume = 1;
	}
	$(".audio-wind").prop("volume",volume);
	updateWind(volume);
}

function volumeDownWind(){
	var volume = $(".audio-wind").prop("volume")-0.05;
	if(volume <0){
		volume = 0;
	}
	$(".audio-wind").prop("volume",volume);
	updateWind(volume);
}

function updateWind(volume){
	volume = Math.round(volume * 100);
	$(".value-wind").html(volume);
	seSnowVolume = volume;
	watchSnowVolume();
}

function updateFire(volume){
	volume = Math.round(volume * 100);
	$(".value-fire").html(volume);
	seFireVolume = volume;
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
	$('.social-share').toggleClass("hide");
	$('#btn-menu').toggleClass("shrink");
	$('.hide-text').html($('.hide-text').text() == 'Hide Text' ? 'Show Text' : 'Hide Text');
	ga('send', 'event', 'Controls', 'toggle', 'hide/show text');
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

function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
	results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var devmode = parseInt(getParameterByName('dev'));

// print year to license
if (devmode==1) {
	$('body').addClass('dev');
}
