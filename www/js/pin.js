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

            if (inputStr == "��") {
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

                        if ((stdSignMsg.json.chain_id).indexOf("laozi") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("juno") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("bitcanna") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("axelar") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("moonbys") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("certik") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("shentu") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("irishub-1") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("injective") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("comdex") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("desmos") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("crypto-org") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("gravity-bridge") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("lum") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("cosmos") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("chihuahua") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("secret") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("kava") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("axelar") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("osmosis") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("darc") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("evmos") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("core-1") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("omniflix") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("cerberus") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("pio-mainnet") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("fetchhub") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("titan") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("sentinelhub") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("crescent") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("mantle") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("akash") != -1 ||
                           (stdSignMsg.json.chain_id).indexOf("stargaze") != -1) ||
                           (stdSignMsg.json.chain_id).indexOf("meme") != -1) {
                           // TODO: Protobuf sign
                           signTxByProto(decryptedMnemonics, hdPathResult, stdSignMsg.json.chain_id, stdSignMsg);
                        } else {
                           signTxByKeyStation(decryptedMnemonics, hdPathResult, stdSignMsg.json.chain_id, stdSignMsg);
                        }
                     }
                  }
               } catch (error) {
                  console.log(error);
                  // Error: Malformed UTF-8 data
                  showWrongPinAnimation();
               }
            } else if (window.pinType == "recovery" || window.pinType == "recoveryPrivateKey") {
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

                     // init keypad and close
                     $(".wrapper-number").css("display", "grid");
                     $(".wrapper-alphabet").css("display", "none");
                     correct = "";
                     $(".pin-wrap").removeClass("open");

                     // �붾㈃ �꾪솚
                     $(".keystation-form").hide();
                     $(".subTitleOnAccountSetting").hide();
                     $(".subTitleRecoveryOnAccountSetting").show();
                     $(".backBtnOnAccountSetting").show();
                     $(".recoveryOnAccountSetting").show();

                     if (window.pinType == "recovery") {
                        $(".recoverySubTitle").show();
                        $(".recoveryPrivateKeySubTitle").hide();

                        $(".recoveryText").text(decryptedMnemonics);
                     } else if (window.pinType == "recoveryPrivateKey") {
                        $(".recoverySubTitle").hide();
                        $(".recoveryPrivateKeySubTitle").show();

                        let pathOnAccountSetting = $(".hdPathInputOnAccountSetting").val();
                        let privateKey = getPrivateKey(pathOnAccountSetting, decryptedMnemonics);
                        $(".recoveryText").text(privateKey);
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
