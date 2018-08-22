$( document ).ready(function() {
    cek_session_ada();
});
function cek_session_ada()
 {
     $(".loader").show();
     $.ajax({ 
     type: 'GET', 
     url: '/cek_session', 
     success: function (data) 
     { 
         $(".loader").hide();
         if(data)
         {
            window.location.href='/home';    
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
         url: '/api/getToken', 
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
     url: '/puttoken/'+token, 
     success: function (data) 
     { 
        $.ajax({ 
            type: 'GET', 
            url: '/api/profile', 
            headers: {
                'Authorization': 'Bearer ' + token
            },
            success: function (data) { 
                putsession(data.data.level,data.data.akses);
            }
        });
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
 
 function putsession(sesi,akses)
 {
     $.ajax({ 
     type: 'GET', 
     url: '/putsession/'+sesi+'/'+akses, 
     success: function (data) 
     { 
         $(".loader").hide();
         window.location.href='/home'
     },
     error : function(data)
     {
         swal({title: "Login Failed!", text: "Ulangi login.", type: "error"},
         function(){ 
             return false;
         }
         );
     }
  });
 }