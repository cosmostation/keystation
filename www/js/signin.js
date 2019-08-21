(function() {
   window.pinType = "signin";

   $("#sendEventToParentBtn").on('click', function(){
      sendEventToParent('booyoun test2');
   })

})();


// sendEventToParent
function sendEventToParent(data) {
   var account 	= $(".input-account").val();
   var password 	= $("input[type=password]").val();

   if ($.trim(account) == "") {
      $("#formInfoMessage").hide();
      $("#errorOnSignIn").show().find('span').text("Invalid account.");
      return;
   }

   if ($.trim(password) == "") {
      $("#formInfoMessage").hide();
      $("#errorOnSignIn").show().find('span').text("Could not retrieve account stored in Keychain.");
      return;
   }

   var address = getKeyStationMainAddress($.trim(password));

   //window.opener.postMessage(address, "*");
   //window.close();

   $(".pin-wrap").addClass("open");
}