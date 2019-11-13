'use strict'
const fs = require('fs');

const read = (filePath) => {
  let TEXTdata = fs.readFileSync(filePath);
  let JSONdata = JSON.parse(TEXTdata);
  return JSONdata;
}

const write = (filePath, data) => {
  let TEXTdata = JSON.stringify(data);
  fs.writeFileSync(TEXTdata);
}

const writeAsync = async (filePath, data) => {
  let TEXTdata = JSON.stringify(data);
  fs.writeFile(filePath, TEXTdata, (err) => {
    if (err) {
      console.log('Error at writing data to file! ', err);
    } else {
      console.log(`New person added succesfully to ${filePath}`);
    }
  });
}


module.exports = {
  read: read,
  write: write,
  writeAsync: writeAsync
}