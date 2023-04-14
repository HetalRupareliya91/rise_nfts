$(document).ready(function () {
   function IsEmail(email) {
      var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test(email)) {
          return false;
      }
      else {
          return true;
      }
  }

   $("#submit").click(function () {
      var name  = $('#name').val();
      var email  = $('#email').val();
      if (name == null || name == "") {
         $('#response_text').text('Please enter name');
         return false;
       }

       if (email == null || email == "") {
         $('#response_text').text('Please enter email');
         return false;
       }

       if (IsEmail(email) == false) {
         $('#response_text').text('Please enter valid email');
         return false;
      }

      $(".loader").css("display","inline-block");
      $.post("/user_form",
         {
            name: $('#name').val(),
            email:  $('#email').val()
         },
         function (data, status) {
            $(".loader").css("display","none");
            console.log(status);
            if(status=='success')
            {
               $('#response_text').text(data[0].message);
               $('#name').val('');
               $('#email').val('');
               setTimeout(function() {
                  $('#response_text').text('');
              }, 5000);
            }
            else if(status=='error')
            {
               $('#response_text').text(data[0].message);              
            }
         });
   });
 });