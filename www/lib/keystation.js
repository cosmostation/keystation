function Keystation(client, lcd, path) {
	this.client 	= client;
	this.lcd		= lcd;
	this.path 		= path;

	// this.keystationUrl = "http://localhost:8080";
	this.keystationUrl = "https://keystation.cosmostation.io";
}

Keystation.prototype.openWindow = function(type, payload) {
	const w = 400
  	const h = 690
	var left = (screen.width/2)-(w/2);
	var top = (screen.height/2)-(h/2);

	var apiUrl = "";
	switch (type) {
		case "signin":
			apiUrl = "signin";
			break;
		case "transaction":
			apiUrl = "tx";
			break;
	}

	return window.open(this.keystationUrl + '/' + apiUrl + '?client=' + encodeURIComponent(this.client) + '&lcd=' + encodeURIComponent(this.lcd) + '&path=' + encodeURIComponent(this.path) + '&payload=' + encodeURIComponent(payload), '', "width=" + w + ", height=" + h + " , top=" + top + ", left=" + left);
}