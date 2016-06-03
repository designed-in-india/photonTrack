var analyticsModifierForLocal = false;
var dimensionValue = 'user';
//removeIf(production) 
analyticsModifierForLocal = true;
dimensionValue = 'local';
//endRemoveIf(production) 

// Standard Google Universal Analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here
if(analyticsModifierForLocal){
	ga('create', 'UA-75254050-1', 'auto');
}else{
	ga('create', 'UA-75254050-2', 'auto');
}

ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('set', 'dimension1', dimensionValue);
ga('send', 'pageview', '/options.html');


var today = new Date();
var myTime = {
	d : today.getDate(),
	//removeIf(production) 
	d : today.getDate(),
	//endRemoveIf(production)
	m : today.getMonth() + 1,
	y : today.getFullYear(),
	fromDay : today.getDate() - today.getDay() + 1,
	inTime: null,
	calculatedTotalMs : null,
	convertedTotalTime : null,
	expectedExitTime: null,
	crossedNineHours: false,
};
myTime['dt-'] = myTime.y  +'-'+ myTime.m +'-'+ myTime.d;
myTime['dt/'] = myTime.y  +'/'+ myTime.m +'/'+ myTime.d;
myTime.wholeM = myTime.y  +'/'+ myTime.m +'/01';
myTime.wholeW = myTime.y  +'/'+ myTime.m +'/' + myTime.fromDay;


var user = {
	tempECode : null,
	eCode : null,
	name : null,
	weekData: null,
	monthData: null,
};

var app = {
	pulseUrl: 'https://pulse.photoninfotech.com/',
	pulseTabId: null,
	pulseActive: false,
	reviewUrl : 'https://chrome.google.com/webstore/detail/photon-track/abkcmkmcbdhidgiapklpnbiblehjigka/reviews',
	dataUrl : 'https://accessreporting.photoninfotech.com/getReporteesData',
	swipeDataUrl : 'https://accessreporting.photoninfotech.com/getSwipedetails',
	weekAndMonthData: {week:null, month:null},
	urlRegex : /^https?:\/\/(?:[^./?#]+\.)?photoninfotech\.com/,
	localServiceMode : false,
	settingsMode: false,
	feedbackUrl:'https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=vikram.menon@photoninfotech.net&su=Comments/Feedback for Photon track plus extension&body=Hi Vikram\,',
	resetGCalUrl:'https://security.google.com/settings/security/permissions?pli=1',
	showCalEvents:1,
	calenderData: null,
	calenderShown : false,
	version:null,
}

app.version = chrome.runtime.getManifest().version;
