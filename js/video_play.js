const videojs = require('video.js');
const encryptor = require('file-encryptor');
const appRoot = require('app-root-path');

const player_ = JSON.parse(localStorage.getItem('player'));

const player = videojs('my-video', {
  controls: true,
  autoplay: true,
  height: 400,
  sources: [
    {
      src: player_.src,
      type: player_.type
    }
  ]
});

CenterPlayBT();

$.getJSON(appRoot + '/static/video2.json')
  .then(function (data) {
    $root = $('.root');
    let card = ' ';
    data.forEach((value, index) => {
      card += `
              <div class="card col s6 l12">
                <div class="card-content" style="">
                  <div class="card-title chip">${value.name.substring(0, 30)}</div>
                  <div style="position:absolute; top:20; left:20; z-index: 12">
                    <button class="btn red" id="${value.location}"><i class="ion-play"></i></button>
                  </div>
                  <video id="video-${index}" class="video-js">
                    <source src="${value.location}" type="${value.type}">
                </div>
              </div>
            `;
    });
    $root.append(card);

    data.forEach((value, index) => {
      const newplayer = videojs(`video-${index}`, {
        height: 150,
      });
    });

    //Listen for pause event.
    player.on('pause', function () {
      CenterPlayBT();
    });

    player.on('play', function () {
      let playBT = $(".vjs-big-play-button");
      playBT.hide();
    });

    //Click on Video Elements.
    $('.btn').click(function (e) {
      const options = {
        src: e.target.id,
        type: 'video/mp4'
      };
      const recently_played = localStorage.getItem('player');
      localStorage.setItem('recently_played', recently_played);
      localStorage.setItem('player', JSON.stringify(options));
      window.location = './video_play.html';
    });

  });
