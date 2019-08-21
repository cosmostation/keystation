(function () {

   // pin close
   $(".pin-wrap > button").on('click', function(){
      $(".pin-wrap").removeClass("open");
      // pin reset
   })


   // booyoun
   var input = '', correct = '1234A';
   var dots = document.querySelectorAll('.dot'), numbers = document.querySelectorAll('.grid-number');
   dots = Array.prototype.slice.call(dots);
   numbers = Array.prototype.slice.call(numbers);
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