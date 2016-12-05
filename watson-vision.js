var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');
var fs = require('fs');

var visual_recognition = new VisualRecognitionV3({
  api_key: 'cafd37ff762bdd2f1ddbe674dd8f9eeee3d68111',
  version_date: '2016-05-19'
});

var params = {
  images_file: fs.createReadStream('C:\\Users\\Ken\\Documents\\IBM Watson tests\\resources\\my-photo.png')
};

// const util = require('util');
// util.inspect(params.images_file);

visual_recognition.classify(params, function(err, res) {
  if (err)
    console.log(err);
  else
    console.log(JSON.stringify(res, null, 2));
});

