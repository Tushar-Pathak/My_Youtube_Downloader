//Center Play Button.
function CenterPlayBT() {
  var playBT = $(".vjs-big-play-button");
  playBT.css({
    left: ((playBT.parent().outerWidth() - playBT.outerWidth()) / 2) + "px",
    top: ((playBT.parent().outerHeight() - playBT.outerHeight()) / 2) + "px"
  });
  playBT.show();
}