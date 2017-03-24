import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
  TouchableOpacity,
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

const random = array => array[Math.floor(Math.random() * array.length)];

const emotions = [
  'anger',
  'happiness',
  'neutral',
  'surprise',
];

export default class App extends Component {
  state = {
    emotion: random(emotions),
    points: 0,
    pointScale: new Animated.Value(0),
  }

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
            const playerEmotions = faces[0].scores;
            const strongestEmotion = Object.keys(playerEmotions).reduce((acc, emotion) => {
              if (playerEmotions[emotion] > playerEmotions[acc]) {
                return emotion;
              }
              return acc;
            }, 'anger');

            if (strongestEmotion === this.state.emotion) {
              this.setState({
                points: this.state.points + 1,
                emotion: random(emotions),
              }, () => {
                Animated.timing(this.state.pointScale, {toValue: 1})
                  .start(() => this.state.pointScale.setValue(0));
              });
            }
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
          <Animated.Text 
            style={[
              styles.points,
              {
                transform: [{
                  scale: this.state.pointScale.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [1, 2, 1]
                  }),
                }]
              }
            ]}
          >
            {this.state.points}
          </Animated.Text>
          <Text style={styles.mission}>Next emotion: {this.state.emotion}</Text>
          <TouchableOpacity style={styles.capture} onPress={this.takePicture} />
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
    backgroundColor: 'transparent',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#ffffff',
    marginTop: 30,
    marginBottom: 40,
  },
  mission: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 24,
  },
  points: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 32,
    marginBottom: 15,
  }
});

AppRegistry.registerComponent('emotions', () => App);
