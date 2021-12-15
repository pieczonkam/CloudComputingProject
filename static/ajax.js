/*jshint esversion: 6 */
function sendRequest(url, method, message) {
	'use strict';

	return new Promise(function(resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			resolve(this.responseText);
		};
		xhr.onerror = reject;
		xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json');
		if (message)
			xhr.send(message);
		else
			xhr.send();
	});
}