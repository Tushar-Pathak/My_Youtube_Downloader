function removeDuplicates(array) {
  var seenNames = {};

  array = array.filter(function (currentObject) {
    if (currentObject.name in seenNames) {
      return false;
    } else {
      seenNames[currentObject.name] = true;
      return true;
    }
  });

  return array;
}