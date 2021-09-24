testHandler();


function countWords(str) {
   return str.trim().split(/\s+/).length;
}

function cleanMnemonics(mnemonics) {
   mnemonics = mnemonics.replace(/\n/g, " ");   // Replace line break to one space
   mnemonics = mnemonics.split(",").join(" ");
   mnemonics = mnemonics.replace(/ +/g, " ");   // Replace connected spaces with one space
   return mnemonics;
}

function isMnemonicsValid(mnemonics) {
   var validFlag = true;
   // To check the checksum, it is a process to check whether there is an error in creating an address, so you can input any path and prefix.
   try {
      window.lcd = getParameterByName('lcd');
      if (window.option == "disablechecksum") {
         getKeyStationMainAddress(mnemonics, "44/118/0/0/0", "cosmos", false);
      } else {
         getKeyStationMainAddress(cleanMnemonics(mnemonics), "44/118/0/0/0", "cosmos");
      }
   } catch (e) {
      validFlag = false;
   }
   return validFlag;
}

(function() {
   window.pinType = "import";

   $("#importBtn").on('click', function() {
      var account = $("#account").val();
      var mnemonics = $("#mnemonics").val();

      if ($.trim(account) == "") {
         $("#formInfoMessage").hide();
         $("#errorOnImport").show().find('span').text("Invalid account.");
         return;
      }

      if ($.trim(mnemonics) == "") {
         $("#formInfoMessage").hide();
         $("#errorOnImport").show().find('span').text("Mnemonics is not valid.");
         return;
      }

      if (countWords($.trim(mnemonics)) != 12 &&
          countWords($.trim(mnemonics)) != 16 &&
          countWords($.trim(mnemonics)) != 24) {
         $("#formInfoMessage").hide();
         $("#errorOnImport").show().find('span').text("Mnemonics is not valid.");
         // TODO: Check validation of mnemonics
         return;
      }

      if (!isMnemonicsValid(mnemonics)) {
         $("#formInfoMessage").hide();
         $("#errorOnImport").show().find('span').text("Invalid mnemonics checksum error.");
         // TODO: Check validation of mnemonics
         return;
      }

      if (window.option == "disablechecksum") {
         $("#mnemonics").val(mnemonics);
      } else {
         $("#mnemonics").val(cleanMnemonics(mnemonics));
      }

      $(".pin-wrap").addClass("open");
   })

   $("#importBtn2").on('click', function(){
      submitForm();
   })

})();

function copyAddress() {
   var copyText = document.getElementById("encrypted-mnemonics-for-copy");
   copyText.select();
   document.execCommand("copy");
   $(".notification-modal").text("Encrypted mnemonic phrase is copied.");
   $(".notification-modal").show();
   setTimeout(function() {
      $(".notification-modal").hide();
   }, 2000);
}

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
   var account       = $.trim($("#hidden-account").val());
   var mnemonics     = $.trim($("#mnemonics").val());

   if (account == "") {
      $("#formInfoMessage").hide();
      $("#errorOnImport").show().find('span').text("Invalid account.");
      return;
   }

   if (mnemonics == "") {
      $("#formInfoMessage").hide();
      $("#errorOnImport").show().find('span').text("Invalid mnemonics.");
      return;
   }

   // Check encrypted mnemonic phrase and pasted value
   if (document.getElementById("encrypted-mnemonics").innerText != $("input[type=password]").val() ) {
      $(".notification-modal").text("Encrypted mnemonic phrase does not match.");
      $(".notification-modal").show();
      setTimeout(function() {
         $(".notification-modal").hide();
      }, 2000);
      return;
   }

   // loader
   $("#importBtn").html('<i class="fa fa-spinner fa-spin"></i>');

   window.lcd = getParameterByName('lcd');
   var hdPath = getParameterByName('path');

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

   var prefix = getParameterByName('payload');

   var address = "";
   if (window.option == "disablechecksum") {
      address = getKeyStationMainAddress(mnemonics, hdPathResult, prefix, false);
   } else {
      address = getKeyStationMainAddress(cleanMnemonics(mnemonics), hdPathResult, prefix);
   }

   console.log("[test] address: ", address);

   $("input[name=payload]").val(address);

   $('.keystation-form').submit();
}
