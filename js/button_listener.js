$('#btn').click(function () {
  const { ipcRenderer } = require('electron');
  ipcRenderer.send('open');

  ipcRenderer.on('file', (e, data) => {
    const appRoot = require('app-root-path');
    
    $.getJSON(appRoot + '/static/video2.json')
      .then((data2) => {
        console.log(data2);
        
        console.log(data[0]);
        
        
        const name = data[0].substring(data[0].lastIndexOf('\\') + 1, data[0].length);

        data2.push({
          name,
          location: data[0],
          type: 'video/mp4'
        });

        const recently = localStorage.getItem('played');
        localStorage.setItem('recently_played', recently);

        const options = {
          src: data[0],
          type: 'video/mp4'
        }

        localStorage.setItem('player', JSON.stringify(options));

        
        // const removeDuplicates = require('./removeDuplicates');
        // data2 = removeDuplicates(data2);
        
        var fs = require('fs');
        fs.writeFile(appRoot + "/static/video2.json", JSON.stringify(data2), function (err) {
          if (err) {
            return console.log(err);
          }

          console.log("The file was saved!");
        });

        console.log('12');
        
        window.location = '../renderer/video_play.html';
      });
  });
});
