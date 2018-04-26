const $root = $('.root');
const appRoot = require('app-root-path');
const videojs = require('video.js');
const decryptor = require('file-encryptor');

const key = 'a';

$.getJSON(appRoot + '/download/download.json')

  .then(function (data) {

    let card = ' ';
    data.forEach((value, index) => {
      value = JSON.parse(value);

      console.log(value.location);
      decryptor.decryptFile(value.location, `${appRoot}/download/${value.name}.mp4`, 'a', function (err) {
        if (err)
          console.log(err);
        console.log('decrypted');
        value.location = `${appRoot}/download/${value.name}.mp4`;
        card += `
            <div class="card col s10">
              <div class="card-content">
                <div class="card-title">${value.name}</div>
                <div style="position:absolute; top:20; left:20; z-index: 12">
                  <button class="btn red" id="${value.location}"><i class="ion-play"></i></button>
                </div>
                <video id="video-${index}" class="video-js">
                  <source src="${value.location}" type="video/mp4">
              </div>
            </div>
          `;
        $root.html(card);

        //Click on Video Elements.
        $('.btn').click(function (e) {
          setTimeout(function() {
            const options = {
              src: e.target.id,
              type: 'video/mp4'
            };
  
            localStorage.setItem('player', JSON.stringify(options));
            window.location = './video_play.html';
          }, 1000);      
        });

        data.forEach((value, index) => {
          const newplayer = videojs(`video-${index}`, {
            height: 150,
          });
        });
      });

    });
  });
