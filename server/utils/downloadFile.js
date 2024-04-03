const { default: axios } = require("axios");
const fs = require('fs')

const downloadFile = async (fileUrl,localFilePath) => {

  try {
    const response = await axios({
      method: 'GET',
      url: fileUrl,
      responseType: 'stream',
    });

    await response.data.pipe(fs.createWriteStream(localFilePath));
  } catch (err) { 
    throw new Error(err);
  }
}; 
module.exports={downloadFile}