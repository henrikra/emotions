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

export default class emotions extends Component {
  takePicture() {
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
            Alert.alert(`${strongestEmotion} is the emotion that suits you`)
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
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  }
});

AppRegistry.registerComponent('emotions', () => emotions);
