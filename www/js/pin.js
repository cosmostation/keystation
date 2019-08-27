(function () {

   var input = '';
   var correct = '';
   var dots = document.querySelectorAll('.dot'), numbers = document.querySelectorAll('.grid-number');
   dots = Array.prototype.slice.call(dots);
   numbers = Array.prototype.slice.call(numbers);

   // pin close
   $(".pin-wrap > button").on('click', function(){
      // $(".pin-wrap").removeClass("open");
      // pin reset

      // Init PIN
      for (var i = 0; i < 5; i++) {
         dots[i].className = 'dot';
         input = input.substr(0, input.length - 1);
      }

      $(".pin-title").text("Please enter your PIN.");

      // Init Keypad
      $(".wrapper-number").css("display", "grid");
      $(".wrapper-alphabet").css("display", "none");

      correct = "";

      $(".pin-wrap").removeClass("open");
   })

   numbers.forEach(function (number, index) {
      number.addEventListener('click', function () {
         // <div class="grid-number">2</div> 에서 숫자를 제외한 나머지 제거
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

            console.log("inputStr: ", inputStr);
            console.log("input: ", input);
         }

         if (input.length == 4) {
            $(".wrapper-number").css("display", "none");
            $(".wrapper-alphabet").css("display", "grid");
         }

         if (input.length >= 5) {
            if (window.pinType == "import" && correct == "") {
               correct = input;
               // Please enter your PIN again.
               setTimeout(function () {
                  // Change title
                  $(".pin-title").text("Please enter your PIN again.");

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
                  dots.forEach(function (dot, index) {
                     dot.className += ' wrong';
                  });
                  $(".wrapper-number").css("display", "grid");
                  $(".wrapper-alphabet").css("display", "none");
               } else {
                  dots.forEach(function (dot, index) {
                     dot.className += ' correct';
                  });

                  // next step

                  // PIN으로 니모닉 암호화

                  // input[type=password] 값을 암호화된 값으로 변경

                  // INIT
                  var mnemonics = $('input[type="password"]').val();
                  var pinCode = input;

                  // PROCESS
                  var encrypted = CryptoJS.AES.encrypt(mnemonics, pinCode);
                  var decrypted = CryptoJS.AES.decrypt(encrypted, pinCode);
                  // document.getElementById("demo0").innerHTML = mnemonics;
                  // document.getElementById("demo1").innerHTML = encrypted;
                  // document.getElementById("demo2").innerHTML = decrypted;
                  // document.getElementById("demo3").innerHTML = decrypted.toString(CryptoJS.enc.Utf8);

                  console.log("encrypted: ", encrypted);
                  console.log("decrypted: ", decrypted.toString(CryptoJS.enc.Utf8));

                  //$(input[type="password"]).value = encrypted;

                  // $('input[type="password"]').val(encrypted);
                  // console.log("pw input value: ", $('input[type="password"]').val());

                  $(".input-password").val(encrypted);
                  console.log("pw input value: ", $(".input-password").val());

                  // submit
                  setTimeout(function () {
                     $('.keystation-form').submit();
                  }, 300);

               }
            } else if (window.pinType == "signin") {
               
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