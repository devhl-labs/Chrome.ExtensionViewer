chrome.management.getAll(function(items){
	var arr = [];
	var arrC = [];
console.log(items);
	for (var i = 0; i < items.length; i++) {
		if(items[i].enabled == true && 
		items[i].installType == 'development' && 
		items[i].name != 'Extension Viewer ALPHA'){
			var str = items[i].id;
			reloadExtension(items[i].id);
		}
	}
});

chrome.management.getAll(function(items) {
	var arr = [];
	for (var i = 0; i < items.length; i++) {
		var str = items[i].name + '::' + 
				  items[i].version + '::' + 
				  items[i].enabled + '::' + 
				  items[i].installType + '::' + 
				  items[i].id;
		
		if(items[i].homepageUrl){
			str += '::' + items[i].homepageUrl;
		}else{
			str += '::none';
		}

		var booFound = false;
		var strImage = '';
		try{
			for(var x = 0; x < items[i].icons.length; x++){
				if(items[i].icons[x].size == 16){
					strImage = '::' + items[i].icons[x].url;
					booFound = true;
				}				
				if(items[i].icons[x].size == 48){
					strImage = '::' + items[i].icons[x].url;
					booFound = true;
				}
				if(items[i].icons[x].size == 128){
					strImage = '::' + items[i].icons[x].url;
					booFound = true;
				}
			}
			if(!booFound) strImage = '::none';
		}catch(ex){
			strImage = '::none';
		}
		str += strImage;
		arr.push(str);
		
	}
	arr.sort(
		function (a, b) {
			return a.toLowerCase().localeCompare(b.toLowerCase());
		}
	);
	var arr2;
	for(i = 0; i < arr.length; ++i){
		arr2 = arr[i].split('::');
		if($('.' + arr2[0].replace(/[^a-zA-Z0-9]/g,'_')).length == 0){
			createRow(arr[i]);
		}
		//tr = check(arr[i]);
		//if(tr == $('#body')[0]) createRow(arr[i]);
		createSubRow(arr[i]);
	}
});

$('#reload').click(function(e) {
	chrome.tabs.create({url: "chrome://extensions/"}, function(tab){
		localStorage['close'] = tab.id;
		//chrome.runtime.sendMessage({greeting: tab.id}, function(farewell){
			var boo = false;
			chrome.tabs.onUpdated.addListener(
				function(tabId, status, newTab){
					if(tabId == tab.id && status.status == 'complete' && !boo){
						console.log('tab.id: ' + tab.id + ' tabId: ' + tabId + ' status: ' + status.status + ' ' + boo);
						chrome.tabs.reload(tabId, function(){
							chrome.extension.getBackgroundPage().window.location.reload()
						});
						console.log('reloading ' + tabId);
						boo = true;
						chrome.tabs.getCurrent(function(tab) {
							chrome.tabs.remove(tab.id, function() { });
						});
					}
				}
			);
		//});
	});
});

/* 	chrome.tabs.getAllInWindow(null, 
			function(tabs){
				for (var i = 0; i < tabs.length; i++) {
					if(tabs[i].url == 'chrome://extensions/'){
						//console.log(tabs[i].id);
						chrome.tabs.reload(tabs[i].id);
					}	
				}
			}
		);
} */

$('#defaultEV').click(function(e) {
	chrome.tabs.create({
		url: 'chrome://extensions/'
	});
});

$('#moreFromDev').click(function(e) {
	chrome.tabs.update({
		url: 'appsFromDeveloper/appsFromDeveloper.html'
	});
});

$('#cws').click(function(e) {
	chrome.tabs.create({
		url: 'https://chrome.google.com/webstore/developer/dashboard'
	});
});

$('#custom').click(function(e) {
	switch($(this).text()){
		case 'My Extensions':	
			$('.listing:not(.custom)').hide();
			$(this).text('Third Party Extensions');
			break;
		case 'Third Party Extensions':
			$('.listing:not(.custom)').show();
			$('.listing.custom').hide();
			$(this).text('View All Extensions');
			break;
		default:
			$('.listing').show();
			$(this).text('My Extensions');	
			break;
	}
});

function check(ex){
	var booFound = false;
	var $tr;
	var arr = ex.split('::');
	$('.title').each(
		function(i){
			if(arr[0] == $(this).text()){
				$tr = $(this);
				booFound = true;
			}
		}
	);
	if(booFound){
		$tr = $tr.parent().next();
		$tr = $tr[0];
		return $tr;
	}else{
		return $('#body')[0];
	}
	
}

function reloadExtension(id) {
    chrome.management.setEnabled(
		id, false, function() {
			chrome.management.setEnabled(id, true);

		}
	);
}

function createDetail(tr, value, i, id){
	var td = document.createElement('td');
	if(i == 2){
		tr.appendChild(td);
		var input = document.createElement('input');
		input.type = 'checkbox';
		if(value == 'true'){
			input.checked = true;
		}
		$(input).change(
			function(){
				var boo = false;
				if($(this).is(':checked')) boo = true;
				chrome.management.setEnabled(id, boo)
			}
		);
		td.appendChild(input);
	}else{
		td.innerText = value;
		if(value != 'normal') tr.appendChild(td);
	}
}

function createRow(obj){
	var $listings = $('#listings');
	var listing = document.createElement('div');
	//listing.className = 'listing';
	$listings.append(listing);
	var arr = obj.split('::');
		
	//create image field
	var div = document.createElement('div');
	div.className = 'listingImage';
	listing.appendChild(div);
	var img = document.createElement('img');
	if(arr[6] != 'none'){
		img.src = arr[6];
		img.setAttribute('style', 'height: 48px;');
		img.setAttribute('style', 'width: 48px;');
		div.appendChild(img);
	}
	
	div = document.createElement('div');
	div.className = 'listingTitle ';
	div.innerText = arr[0];
	listing.appendChild(div);
	div.parentNode.className = 'listing ' + arr[0].replace(/[^a-zA-Z0-9]/g,'_'); 	
/* 	td.appendChild(img);
	listing.appendChild(td);
	listing.innerText = arr[0]; */
	//tr.appendChild(td);
	
	//create name field
/* 	td = document.createElement('td');
	td.innerText = arr[0];
	td.className = 'title';
	tr.appendChild(td); */

	//createField(tr, td, arr[0], 'title', arr[4]);
	var tbl = document.createElement('table');
	tbl.className = 'collection';
	listing.appendChild(tbl);
}

function createSubRow(obj){
	var arr = obj.split('::');
try{
	var $tbl = $('.' + arr[0].replace(/[^a-zA-Z0-9]/g,'_')).children('table');
	var tr = document.createElement('tr');
	$tbl.append(tr);
	// var td = document.createElement('td');
	// td.innerText = 'test';
	// tr.appendChild(td);
	
	
	
	
	/////////////////////////////////////////////

	//create enabled field
	var td = document.createElement('td');
	tr.appendChild(td);
	createEnabled(arr[4], tr, td, arr[2]);
	
	//create version field
	td = document.createElement('td');
	var str = isDev(arr[3]);
	td.innerText = 'v' + arr[1] + ' ' + str;
	var boo = false;
	if(str != ''){
		td.className = 'dev';
		boo = true;
	}
	tr.appendChild(td);
	if(boo) td.parentNode.parentNode.parentNode.parentNode.classList.add('custom');
	
	//create website link
	var a;
	td = document.createElement('td');
	td.innerText = 'website';
	tr.appendChild(td);
	if(arr[5] != 'none'){
		a = document.createElement('a');
		a.href = arr[5];
		a.target = '_blank';
		a.innerText = 'website';
		td.innerText = '';
		td.appendChild(a);
	}
	
	
	//create uninstall
	td = document.createElement('td');
	a = document.createElement('a');
	a.innerText = 'trash';
	a.href = '';
	tr.appendChild(td);
	td.appendChild(a);
	a.onclick =	function(){
		//alert(arr[4]);
		chrome.management.uninstall(arr[4], {showConfirmDialog: false}, function(){
			alert('unin');
/* 			chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
				console.log(response.farewell);
			}); */
		});
		//location.reload;
	}
	
	//add id to table
	td = document.createElement('td');
	a = document.createElement('a')
	a.innerText = arr[4];
	a.href = '';
	td.appendChild(a);
	a.onclick = function(){
		chrome.tabs.create({
			url: 'chrome://extensions/#' + arr[4]
		});
	}
	//td.HTML = 'ID: <a href="chrome://extensions/#' + arr[4] + '">"' & arr[4] + "</a>" ;
	tr.appendChild(td);
	/////////////////////////////////////////////
	
}catch(ex){
	console.log(ex);
}
	

}

function isDev(value){
	if(value == 'development'){
		return 'DEV';
	}else if(value != 'normal'){
		return value;
	}else{
		return '';
	}	
}

function createField(tr, td, value, cls, id){
	var label = document.createElement('label');
	td.appendChild(label);
	label.setAttribute('for', id);
	label.innerText = value;
	label.className = cls;
	td.appendChild(label);
}

function createEnabled(id, tr, td, value){
		var input = document.createElement('input');
		input.type = 'checkbox';
		input.id = id;
		input.name = id;
		if(value == 'true'){
			input.checked = true;
		}
		$(input).change(
			function(){
				var boo = false;
				if($(this).is(':checked')) boo = true;
				chrome.management.setEnabled(id, boo)
			}
		);
		td.appendChild(input);
}







	

/* 
	

	
	create some blank rows
	tr = document.createElement('tr');
	$tbl.append(tr);	
	tr = document.createElement('tr');
	$tbl.append(tr);	
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);	
	tr = document.createElement('tr');
	$tbl.append(tr);	
	tr = document.createElement('tr');
	$tbl.append(tr);	
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr);
	tr = document.createElement('tr');
	$tbl.append(tr); */