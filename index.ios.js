import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Alert,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Camera from 'react-native-camera';
import RNFetchBlob from 'react-native-fetch-blob';
import nodeEmoji from 'node-emoji';

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
const getMatchingEmoji = emotion => {
  switch (emotion) {
    case 'anger':
      return 'angry';    
    case 'contempt':
      return 'triumph';    
    case 'disgust':
      return 'persevere';    
    case 'fear':
      return 'cold_sweat';    
    case 'happiness':
      return 'blush';    
    case 'neutral':
      return 'neutral_face';    
    case 'sadness':
      return 'sob';    
    case 'surprise':
      return 'open_mouth';    
    default:
      return 'no_mouth';
  }
}

const random = array => array[Math.floor(Math.random() * array.length)];
const randomIntegerBetween = (from, to) => Math.floor(Math.random() * to) + from;

const emotions = [
  'anger',
  'happiness',
  'neutral',
  'surprise',
];

const {width: deviceWidth, height: deviceHeight} = Dimensions.get('window');

const createEmoji = () => {
  return {
    emotion: random(emotions), 
    position: new Animated.Value(0),
    xRange: Array.from({length: 11}).map(() => randomIntegerBetween(0, deviceWidth - 50)),
  };
};

export default class App extends Component {
  state = {
    points: 0,
    pointScale: new Animated.Value(0),
    emojiPosition: new Animated.Value(0),
    emojis: [createEmoji()],
    isLoading: false,
  }

  componentDidMount() {
    this.animateEmojiToBottom();
  }
  
  animateEmojiToBottom = () => {
    Animated.timing(this.state.emojiPosition, {toValue: 1, duration: 15000}).start();
  }

  takePicture = () => {
    this.setState({isLoading: true});
    this.camera.capture()
      .then(({data}) => {
        RNFetchBlob.fetch('POST', 'https://westus.api.cognitive.microsoft.com/emotion/v1.0/recognize', {
          'Ocp-Apim-Subscription-Key': apiKey,
          'Content-Type': 'application/octet-stream',
        }, data)
        .then(response => {
          this.setState({isLoading: false});
          const faces = JSON.parse(response.data);

          if (faces.length) {
            const playerEmotions = faces[0].scores;
            const strongestEmotion = Object.keys(playerEmotions).reduce((acc, emotion) => {
              if (playerEmotions[emotion] > playerEmotions[acc]) {
                return emotion;
              }
              return acc;
            }, 'anger');

            const hasMatchingEmoji = this.state.emojis.some(emoji =>
              emoji.emotion === strongestEmotion
            );

            if (hasMatchingEmoji) {
              this.state.emojiPosition.stopAnimation(() => {
                this.state.emojiPosition.setValue(-0.05);
                this.animateEmojiToBottom();
              });
              this.setState({
                points: this.state.points + 1,
                emojis: [createEmoji()],
              }, () => {
                Animated.spring(this.state.pointScale, {toValue: 1})
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
          {this.state.emojis.map((emoji, index) => {
            return (
              <Animated.Text 
                key={index}
                style={[
                  styles.emoji,
                  {
                    transform: [
                      {
                        translateX: this.state.emojiPosition.interpolate({
                          inputRange: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                          outputRange: emoji.xRange,
                        })
                      }, 
                      {
                        translateY: this.state.emojiPosition.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, deviceHeight - 50],
                        })
                      }
                    ]
                  }
                ]}>
                {nodeEmoji.get(getMatchingEmoji(emoji.emotion))}
              </Animated.Text>
            );
          })}
          <View style={styles.actions}>
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
            <TouchableOpacity 
              style={styles.capture} 
              onPress={this.takePicture} 
              disabled={this.state.isLoading} 
            />
          </View>
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
    justifyContent: 'space-between',
  },
  actions: {
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
  points: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontSize: 32,
    marginBottom: 15,
  },
  emoji: {
    backgroundColor: 'transparent',
    fontSize: 60,
  },
});

AppRegistry.registerComponent('emotions', () => App);
