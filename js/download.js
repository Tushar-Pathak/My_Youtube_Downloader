const $started = $('.started');
const { clipboard } = require('electron');
const validUrl = require('valid-url');
const $text = document.getElementById('text');
const copied = clipboard.readText();
const { ipcRenderer } = require('electron');

if (validUrl.isUri(copied)) {
  $text.value = copied;
}

//File Encryptor Credentials.
const encryptor = require('file-encryptor');
const key = 'a';

let completed = false;

const appRoot = require('app-root-path');

$started.hide();
$('.btn').click(function () {
  const link = $text.value;
  var fs = require('fs');
  var youtubedl = require('youtube-dl');
  $('.form').hide();
  console.log('started');
  $started.show();
  var video = youtubedl(link,
    // Optional arguments passed to youtube-dl.
    ['--format=18'],
    // Additional options can be given for calling `child_process.execFile()`.
    { cwd: __dirname });

  let name = '';

  video.on('end', () => {
    $started.hide();

    encryptor.encryptFile(`./src/${name}.mp4`, `./src/${name}.dat`, key, function (error) {

      if (error)
        console.log(error);

      // Encryption complete.
      fs.unlink(appRoot + `/src/${name}.mp4`, (err) => {
        if (err) {
          console.log(err);
        }
      });
      console.log('encryption completed');
    });

    completed = true;

    $('.root').html('<h3>Your Downoad is Completed</h3><button class="btn btn-waves" id="close">Close</button>');

    $('#close').click(function() {
        ipcRenderer.send('close');
    });
  });


  // Will be called when the download starts.
  video.on('info', function (info) {
    console.log('Download started');
    
    name = info._filename;
    $('.kids').html(`
          <table class="bordered">
            <tr>
             <td>
                <span class="chip">filename:</span>   
             </td>
             <td> ${info._filename} </td>
            </tr>
            <tr>
              <td>
                <span class="chip">size:</span>                         
              </td>
              <td>
                ${info.size / 1000000} MB
              </td>
            </tr>
            <tr>
              <td>
                <span class="chip">status: </span>
              </td>
              <td>
                <span id="connection"></span>
              </td>
            </tr>
            <tr>
              <td><span class="chip">Downloaded</span></td>
              <td><span id="downloaded"></span></td>
            </tr>
          </table>
        `);

    $conn = $('#connection');
    $downloaded = $('#downloaded');
    
    $conn.html('connected');
    const interval = setInterval(function() {
        var stats = fs.statSync(appRoot + `/src/${name}.mp4`)
    
        if (fileSizeInBytes > info.size || stats == null || completed == true) {
          clearInterval(interval);
        }

        var fileSizeInBytes = stats["size"]
        
        $downloaded.html(fileSizeInBytes/1000000 + ' MB');
          
    });

    video.pipe(fs.createWriteStream(`./src/${info._filename}.mp4`));

    $.getJSON(appRoot + '/download/download.json')
      .then(data => {
        console.log('writing');
        const options = {
          name: info._filename,
          location: appRoot + `/src/${info._filename}.dat`
        }
        data.push(JSON.stringify(options));

        // const removeDuplicates = require('./removeDuplicates');
        // data = removeDuplicates(data);

        fs.writeFile(appRoot + "/download/download.json", JSON.stringify(data), function (err) {
          if (err) {
            return console.log(err);
          }

          console.log("The file was saved!");
        });
      });
  });

  //Listen for online and offline events from ipcMain.
  ipcRenderer.on('online', function(){
    $conn.html('online');
  });

  ipcRenderer.on('offline', function(){
    $conn.html('online');
  })
  /************************************************* */

});
