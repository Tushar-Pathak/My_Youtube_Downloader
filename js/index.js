if (window.module)
  window.module = prev;

const videojs = require('video.js');
const encryptor = require('file-encryptor');

//Render Root contents.
const __player = JSON.parse(localStorage.getItem('player'));

//Generate new Player from data from localStorage.
if (__player !== null) {

  const newPlayer = videojs('my_video', {
    height: 600,
    width: 840,
    controls: true,
    sources: [
      {
        src: __player.src,
        type: __player.type
      }
    ]
  });

  CenterPlayBT();

  //Listen for pause event.
  newPlayer.on('pause', function () {
    CenterPlayBT();
  });

  newPlayer.on('play', function () {
    let playBT = $(".vjs-big-play-button");
    playBT.hide();
  });
  /********End of Listeners.*************/

} else {
  $root = $('.root');
  $root.append('No Videos Yet');
}
