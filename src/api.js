import RNFetchBlob from 'react-native-fetch-blob';

import apiKey from '../apiKey';

const analyzeEmotions = data => {
  return new Promise((resolve, reject) => {
    RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
      'Ocp-Apim-Subscription-Key': apiKey,
      'Content-Type': 'application/octet-stream',
    }, data)
      .then(response => {
        resolve(JSON.parse(response.data))
      })
      .catch(error => {
        reject(error);
      })
  })
}

export default {
  analyzeEmotions,
};