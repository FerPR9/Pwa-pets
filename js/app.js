if (navigator.serviceWorker) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then((registration) => {
      console.log('Service Worker registrado con éxito:', registration);
    }).catch((error) => {
      console.error('Error al registrar el Service Worker:', error);
    });
  });
}


const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const btnVideo = document.getElementById("btnVideo");

btnVideo.addEventListener("click", () => {
  canvas.height = video.videoHeight / (video.videoWidth / canvas.width);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  console.log("URL:",ctx.canvas.toDataURL()); //base64

});

navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  console.log(stream);
  video.srcObject = stream;
  video.play();
});


// Solicitar permiso para las notificaciones
/*Notification.requestPermission().then(function(permission) {
  if (permission === 'granted') {
    console.log('Notificaciones activadas');
  } else {
    console.log('Notificaciones desactivadas');
  }
});*/

  
  