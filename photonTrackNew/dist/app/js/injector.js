var body = document.getElementsByTagName('body')[0];
if(body && body.classList && body.classList[0] === 'login'){
	chrome.runtime.sendMessage({notLoggedIn:true});
}else{
	var arrayOfFoundTags = document.getElementsByClassName("dataValue");
	var eCode = null;
	for(var item in arrayOfFoundTags) {
		var val = arrayOfFoundTags[item].innerHTML;
		if(val && val.length === 6 && !isNaN(Number(val)) ) {
			eCode = val;
		}
	}
	chrome.runtime.sendMessage({eCode: eCode});
}
