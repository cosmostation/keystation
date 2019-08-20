(function() {

   $("#importBtn").on('click', function(){
     submitForm();
   })

})();


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

   var address = getKeyStationMainAddress($.trim(password));
   $("input[name=payload]").val(address);

   $('.keystation-form').submit();
}
