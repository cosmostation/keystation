// Find Left Boundry of the Screen/Monitor
function FindLeftScreenBoundry()
{
	// Check if the window is off the primary monitor in a positive axis
	// X,Y                  X,Y                    S = Screen, W = Window
	// 0,0  ----------   1280,0  ----------
	//     |          |         |  ---     |
	//     |          |         | | W |    |
	//     |        S |         |  ---   S |
	//      ----------           ----------
	if (window.leftWindowBoundry() > window.screen.width)
	{
		return window.leftWindowBoundry() - (window.leftWindowBoundry() - window.screen.width);
	}

	// Check if the window is off the primary monitor in a negative axis
	// X,Y                  X,Y                    S = Screen, W = Window
	// 0,0  ----------  -1280,0  ----------
	//     |          |         |  ---     |
	//     |          |         | | W |    |
	//     |        S |         |  ---   S |
	//      ----------           ----------
	// This only works in Firefox at the moment due to a bug in Internet Explorer opening new windows into a negative axis
	// However, you can move opened windows into a negative axis as a workaround
	if (window.leftWindowBoundry() < 0 && window.leftWindowBoundry() > (window.screen.width * -1))
	{
		return (window.screen.width * -1);
	}

	// If neither of the above, the monitor is on the primary monitor whose's screen X should be 0
	return 0;
}

window.leftScreenBoundry = FindLeftScreenBoundry;

function PopupCenter(url, title, w, h) {
	var newWindow = window.open(url, title, 'resizable=1, scrollbars=1, fullscreen=0, height=' + h + ', width=' + w + ', screenX=' + window.leftScreenBoundry + ' , left=' + window.leftScreenBoundry + ', toolbar=0, menubar=0, status=1');
	return newWindow;
}

function Keystation(client, lcd, path) {
	this.client 	= client;
	this.lcd		= lcd;
	this.path 		= path;

	this.keystationUrl = "http://localhost:8080";
	// this.keystationUrl = "https://keystation.cosmostation.io";
}

Keystation.prototype.openWindow = function(type, payload, account = "") {
	// The account parameter is required for users having multiple keychain accounts.
	var apiUrl = "";
	switch (type) {
		case "signin":
			apiUrl = "signin";
			break;
		case "transaction":
			apiUrl = "tx";
			break;
	}

	return PopupCenter(this.keystationUrl + '/' + apiUrl + '?account=' + encodeURIComponent(account) + '&client=' + encodeURIComponent(this.client) + '&lcd=' + encodeURIComponent(this.lcd) + '&path=' + encodeURIComponent(this.path) + '&payload=' + encodeURIComponent(payload),'','400','705');
}