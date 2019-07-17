// chrome.runtime.onMessage.addListener(
	// function(request, sender, sendResponse) {
		// localStorage['close'] = request.greeting;
		// sendResponse({farewell: "bye"});
	// }
// );
console.log('background opened');
if(!localStorage['close']) localStorage['close'] = 'false';
if(localStorage['close'] !== 'false'){
	console.log('reloading extension');
	//setTimeout(
		//function(){
			var num = 0;
			num = parseInt(localStorage['close']);
			console.log('about to create');
			chrome.tabs.create({url: "ev.html"});
			console.log('about to remove');
			console.log(num);
			console.log(localStorage['close']);
			chrome.tabs.remove(num);
			localStorage['close'] = 'false';	
		//}
	//, 1000);
	console.log('almost done');
}else{
	console.log('dang! ' + localStorage['close']);
}


