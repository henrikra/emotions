export const getModalMessage = emotion => {
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
export const getMatchingEmoji = emotion => {
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

export const random = array => array[Math.floor(Math.random() * array.length)];
export const randomIntegerBetween = (from, to) => Math.floor(Math.random() * to) + from;