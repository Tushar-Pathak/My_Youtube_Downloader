const videojs = require('video.js');
const encryptor = require('file-encryptor');
const appRoot = require('app-root-path');

$.getJSON(appRoot + '/static/video2.json')

  .then(function (data) {
    $root = $('.root');
    let card = ' ';
    data.forEach((value, index) => {
      card += `
        <div class="card col s12">
          <div class="card-content">
            <div class="card-title">${value.name}</div>
            <div style="position:absolute; top:20; left:20; z-index: 12">
              <button class="btn red" id="${value.location}"><i class="ion-play"></i></button>
            </div>
            <video id="video-${index}" class="video-js">
              <source src="${value.location}" type="${value.type}">
          </div>
        </div>
      `;
    });
    $root.html(card);

    data.forEach((value, index) => {
      const newplayer = videojs(`video-${index}`, {
        height: 150,
      });
    });


    //Click on Video Elements.
    $('.btn').click(function (e) {
      setTimeout(function(){
        const options = {
          src: e.target.id,
          type: 'video/mp4'
        };
        const recently_played = localStorage.getItem('player');
        localStorage.setItem('recently_played', recently_played);
        localStorage.setItem('player', JSON.stringify(options));
        window.location = './video_play.html';
      }, 1000);
      
    });
  });

