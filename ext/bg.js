function sendRepositoryURL(repository_url, fn, error_fn) {
	var xhr = new XMLHttpRequest();
	var params = "repository=" + encodeURIComponent(repository_url);

	xhr.onerror = error_fn;

	xhr.onreadystatechange = function(event){
		return fn(xhr, event);
	};

	xhr.open('POST', 'http://localhost:31415/api/repository', true);
	
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");


	xhr.send(params);
}



chrome.runtime.onMessage.addListener(function(request, sender, sendReponse){

	var tabId = sender.tab.id;

	function showSuccess(){
		chrome.pageAction.show(sender.tab.id);

		chrome.pageAction.setPopup({
			"tabId": tabId,
			"popup": "popups/success.html"
		});
	}

	function showError(){

		chrome.pageAction.show(tabId);

		chrome.pageAction.setIcon({
			"tabId": tabId,
			"path": "images/icon-error.png"
		});

		chrome.pageAction.setPopup({
			"tabId": tabId,
			"popup": "popups/error.html"
		});

	}


	function onSuccess(req, event){
		if (req.readyState === 4) {
			
			if (req.status === 200) {
				// Should display page action indicating success
				showSuccess();
			} else {	// Not actually sucess
				showError();
			}

		}		
	}

	var repository_url = request.repository_url;

	sendRepositoryURL(repository_url, onSuccess);

});