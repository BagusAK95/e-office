$( document ).ready(function() {
    cek_session_ada();
});
function cek_session_ada()
 {
     $(".loader").show();
     $.ajax({ 
     type: 'GET', 
     url: '/cek_session_admin', 
     success: function (data) 
     { 
         $(".loader").hide();
         if(data)
         {
            window.location.href='/admin/home';    
         }
         else
         {
            return false;
         }
         
     },
     error : function(data)
     {
         $(".loader").hide();
         return false;
     }
  });
 }
$( ".form-signin" ).submit(function( event ) {
 $(".loader").show();
 $.ajax({ 
         type: 'POST', 
         url: '/api-sys/getToken', 
         data: $( ".form-signin" ).serialize(),
         dataType: 'json',
         success: function (data) 
         { 
             if(data.success==true)
             {
                 puttoken(data.data.token);    
             }
             else if(data.success==false)
             {
                 swal({title: "Login Failed!", text: "Invalid Username and Password.", type: "error"},
                 function(){ 
                     return false;
                 }
                 );
                 $(".loader").hide();
             }
             
         },
         error : function(data)
         {
            swal({title: "Login Failed!", text: "Invalid Username and Password.", type: "error"},
                 function(){ 
                     return false;
                 }
                 );
             $(".loader").hide();
         }
  });
 event.preventDefault();
 });
 
 function puttoken(token)
 {
     $.ajax({ 
     type: 'GET', 
     url: '/puttokenadmin/'+token, 
     success: function (data) 
     { 
        window.location.href='/admin/home'
     },
     error : function(data)
     {
         swal({title: "Login Failed!", text: "Invalid Username and Password.", type: "error"},
         function(){ 
             return false;
         }
         );
     }
  });
 }
