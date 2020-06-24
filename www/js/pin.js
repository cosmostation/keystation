(function () {
   var input = '';
   var correct = '';
   var dots = document.querySelectorAll('.dot'), numbers = document.querySelectorAll('.grid-number');
   dots = Array.prototype.slice.call(dots);
   numbers = Array.prototype.slice.call(numbers);

   // pin close
   $(".pin-wrap > button").on('click', function(){
      // Init PIN
      for (var i = 0; i < 5; i++) {
         dots[i].className = 'dot';
         input = input.substr(0, input.length - 1);
      }

      $("#pin-title").text("Please enter your PIN.");

      // Init Keypad
      $(".wrapper-number").css("display", "grid");
      $(".wrapper-alphabet").css("display", "none");

      correct = "";

      $(".pin-wrap").removeClass("open");
   })

   function showCorrectPinAnimation() {
      dots.forEach(function (dot, index) {
         dot.className += ' correct';
      });
   }

   function showWrongPinAnimation() {
      dots.forEach(function (dot, index) {
         dot.className += ' wrong';
      });
      $(".wrapper-number").css("display", "grid");
      $(".wrapper-alphabet").css("display", "none");
   }

   function cleanMnemonics(mnemonics) {
      mnemonics = mnemonics.split(",").join(" ");
      mnemonics = mnemonics.replace(/ +/g, " ");   // Replace connected spaces with one space
      return mnemonics;
   }

   numbers.forEach(function (number, index) {
      number.addEventListener('click', function () {
         var inputStr = number.outerHTML;

         if (inputStr.indexOf('<div class="finger grid-number">') != -1) {
            inputStr = inputStr.replace('<div class="finger grid-number">', '');
            inputStr = inputStr.replace('</div>', '');

            if (inputStr == "←") {
               if (input.length > 0) {
                  dots[input.length - 1].className = 'dot';
                  input = input.substr(0, input.length - 1);

                  if (input.length < 4) {
                     $(".wrapper-number").css("display", "grid");
                     $(".wrapper-alphabet").css("display", "none");
                  }
               }

            } else {
               input += inputStr;
               dots[input.length - 1].className += ' active';
            }
         }

         if (input.length == 4) {
            $(".wrapper-number").css("display", "none");
            $(".wrapper-alphabet").css("display", "grid");
         }

         if (input.length >= 5) {
            if (window.pinType == "import" && correct == "") {
               correct = input;
               // Please confirm your PIN.
               setTimeout(function () {
                  // Change title
                  $("#pin-title").text("Please confirm your PIN.");

                  // Init Keypad
                  $(".wrapper-number").css("display", "grid");
                  $(".wrapper-alphabet").css("display", "none");

                  // Init PIN
                  for (var i = 0; i < 5; i++) {
                     dots[input.length - 1].className = 'dot';
                     input = input.substr(0, input.length - 1);
                  }
               }, 200);

            } else if (window.pinType == "import" && correct.length == 5) {
               if (input !== correct) {
                  showWrongPinAnimation();
               } else {
                  showCorrectPinAnimation();

                  // INIT
                  var mnemonics = "";
                  if (window.option == "disablechecksum") {
                     mnemonics = $.trim($('.input-mnemonics').val());
                  } else {
                     mnemonics = cleanMnemonics($.trim($('.input-mnemonics').val()));
                  }
                  var pinCode = input;

                  var encrypted = CryptoJS.AES.encrypt(mnemonics, pinCode);

                  setTimeout(function () {
                     $("#encrypted-mnemonics").text(encrypted);
                     $("#encrypted-mnemonics-for-copy").val(encrypted);
                     $(".pin-wrap").removeClass("open");
                     // import page2
                     $("#import-form1").hide();
                     $("#import-form2").show();
                     $("#hidden-account").val($("#account").val());
                  }, 500);
               }
            } else if (window.pinType == "signin" || window.pinType == "tx") {
               // decrypt input value
               var encryptedMnemonics = $.trim($("input[type=password]").val());
               var pinCode = input;

               try {
                  var decrypted = CryptoJS.AES.decrypt(encryptedMnemonics, pinCode);
                  var decryptedMnemonics = decrypted.toString(CryptoJS.enc.Utf8);

                  if (decryptedMnemonics == "") {
                     // wrong
                     showWrongPinAnimation();
                  } else {
                     // correct
                     showCorrectPinAnimation();

                     if (window.pinType == "signin") {
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
                        var address = getKeyStationMainAddress(decryptedMnemonics, hdPathResult, prefix, false);

                        var msgObj = {
                           "address": address,
                           "account": $(".input-account").val()
                        }

                        setTimeout(function () {
                           try {
                              window.opener.postMessage(msgObj, "*");
                           } catch(event) {
                              console.log(event);
                           }
                           window.close();
                        }, 500);
                     } else if (window.pinType == "tx") {
                        var password = $("input[type=password]").val();

                        if ($.trim(password) == "") {
                           alert("Could not retrieve account stored in Keychain.");
                           return;
                        }

                        var decrypted = CryptoJS.AES.decrypt($.trim(password), pinCode);
                        var decryptedMnemonics = decrypted.toString(CryptoJS.enc.Utf8);

                        // // loader
                        // $("#allowBtn").html('<i class="fa fa-spinner fa-spin"></i>');

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

                        var stdSignMsg = new Object;
                        stdSignMsg.json = JSON.parse(window.stdSignMsgByPayload);

                        // IRIS exception handling
                        if (stdSignMsg.json.msgs[0].type == "irishub/bank/Send" ||
                            stdSignMsg.json.msgs[0].type == "irishub/stake/BeginUnbonding" ||
                            stdSignMsg.json.msgs[0].type == "irishub/stake/BeginRedelegate") {
                           stdSignMsg.jsonForSigningIrisTx = JSON.parse(window.stdSignMsgByPayload);
                           delete stdSignMsg.jsonForSigningIrisTx.msgs[0].type;
                           var tempJsonObj = stdSignMsg.jsonForSigningIrisTx.msgs[0].value;
                           stdSignMsg.jsonForSigningIrisTx.msgs[0] = tempJsonObj;
                           signTxByKeyStation(decryptedMnemonics, hdPathResult, stdSignMsg.json.chain_id, stdSignMsg);
                           return;
                        }

                        signTxByKeyStation(decryptedMnemonics, hdPathResult, stdSignMsg.json.chain_id, stdSignMsg);
                     }
                  }
               } catch (error) {
                  console.log(error);
                  // Error: Malformed UTF-8 data
                  showWrongPinAnimation();
               }
            }

            setTimeout(function () {
               dots.forEach(function (dot, index) {
                  dot.className = 'dot';
               });
               input = '';
            }, 900);
         }
         setTimeout(function () {
            number.className = 'finger grid-number';
         }, 1000);
      });
   });
}());