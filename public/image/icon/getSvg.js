const testFolder = './public/image/icon/';
const fs = require('fs');

const arr = [];(async () => {
   fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      arr.push('/image/icon/' + file);
    });
    console.log(arr);
  });
})();
