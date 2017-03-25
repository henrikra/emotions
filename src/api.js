import RNFetchBlob from 'react-native-fetch-blob';

import apiKey from '../apiKey';

const analyzeEmotions = data => {
  return RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
    'Ocp-Apim-Subscription-Key': apiKey,
    'Content-Type': 'application/octet-stream',
  }, data)
}

export default {
  analyzeEmotions,
};