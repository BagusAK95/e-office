importScripts('https://www.gstatic.com/firebasejs/5.1.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.1.0/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': '1050031306341'
});

var messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  var notificationTitle = 'Background Message Title';
  var notificationOptions = {
    body: 'Background Message body.',
    icon: 'firebase/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});
