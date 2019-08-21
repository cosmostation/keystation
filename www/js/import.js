(function() {
   window.pinType = "import";

   $("#importBtn").on('click', function(){
     submitForm();
   })

})();


// submit
function submitForm() {
   var account     = $(".input-account").val();
   var password	= $("input[type=password]").val();

   // if ($.trim(account) == "") {
   //    $("#formInfoMessage").hide();
   //    $("#errorOnImport").show().find('span').text("Invalid account.");
   //    return;
   // }
   //
   // if ($.trim(password) == "") {
   //    $("#formInfoMessage").hide();
   //    $("#errorOnImport").show().find('span').text("Invalid mnemonics.");
   //    return;
   // }
   //
   // var address = getKeyStationMainAddress($.trim(password));
   // $("input[name=payload]").val(address);

   // $('.keystation-form').submit();
   // $(".pin-wrap").addClass("open");


   // test
   // $(".input-password").val(document.getElementById('keycode').value + "9999");

   var e = jQuery.Event( "keypress", { keyCode: 13 } );
   $("#keycode").trigger(e);



   // $(".input-password").val("123412349999");
   //
   // // 키 이벤트
   // document.getElementById('keycode').value = String.fromCharCode( 65 );
   // $(".input-password").val(String.fromCharCode( 65 ));
   //
   // console.log("password: ", $("input[type=password]").val());
}
