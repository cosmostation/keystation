(function() {

   $("#importBtn").on('click', function(){
     submitForm();
   })

})();

function getParameterByName(name, url) {
   if (!url) url = window.location.href;
   name = name.replace(/[\[\]]/g, '\\$&');
   var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
       results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

// submit
function submitForm() {
   var account     = $(".input-account").val();
   var password	= $("input[type=password]").val();

   if ($.trim(account) == "") {
      $("#formInfoMessage").hide();
      $("#errorOnImport").show().find('span').text("Invalid account.");
      return;
   }

   if ($.trim(password) == "") {
      $("#formInfoMessage").hide();
      $("#errorOnImport").show().find('span').text("Invalid mnemonics.");
      return;
   }

   var hdPath = getParameterByName('payload'); // "lorem"
   console.log("hdPath: ", hdPath);

   var hdPathArr = hdPath.split("/");
   var hdPathResult = "";
   for (var i = 0; i < hdPathArr.length; i++) {
      hdPathResult += String(hdPathArr[i]);
      if (i < 3) {
         // 44, 118, 0
         if (hdPathArr[i].indexOf("'") == -1) {
            hdPathResult += "'";
         }
      }

      if (i < hdPathArr.length - 1) {
         hdPathResult += "/";
      }
   }

   var address = getKeyStationMainAddress($.trim(password), hdPathResult);
   $("input[name=payload]").val(address);

   $('.keystation-form').submit();
}
