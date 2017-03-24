import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';

import apiKey from './apiKey';

const getModalMessage = emotion => {
  switch (emotion) {
    case 'anger':
      return 'You look very angry!';    
    case 'contempt':
      return 'You look contempted';    
    case 'disgust':
      return 'You look very disgusted!';    
    case 'fear':
      return 'You look like you just saw a ghost!';    
    case 'happiness':
      return 'You are happiest person I know';    
    case 'neutral':
      return 'You face is so neutral';    
    case 'sadness':
      return 'Cheer up! Don\'t be sad';    
    case 'surprise':
      return 'You look suprised';    
    default:
      return 'Try to make more expressive look';
  }
}

export default class emotions extends Component {
  takePicture = () => {
    this.camera.capture()
      .then(({data}) => {
        RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/octet-stream',
        }, data)
        .then(response => {
          const faces = JSON.parse(response.data);

          if (faces.length) {
            const emotions = faces[0].scores;
            const strongestEmotion = Object.keys(emotions).reduce((acc, emotion) => {
              if (emotions[emotion] > emotions[acc]) {
                return emotion;
              }
              return acc;
            }, 'anger');
            Alert.alert(getModalMessage(strongestEmotion))
          }
        })
        .catch(error => {
          console.log('error', error);
        })
      })
      .catch(err => console.error(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Camera
          ref={camera => {this.camera = camera;}}
          style={styles.preview}
          aspect={Camera.constants.Aspect.fill}
          captureTarget={Camera.constants.CaptureTarget.memory}
          type={Camera.constants.Type.front}
        >
          <Text style={styles.capture} onPress={this.takePicture}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: '#fff',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('emotions', () => emotions);
