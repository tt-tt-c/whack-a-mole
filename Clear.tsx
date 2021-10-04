import React from 'react';
import { View, Text, TouchableWithoutFeedback, Image, GestureResponderEvent } from 'react-native';
import styles from './PopupStyles';
import Images from './assets/Images';

type Props = {
  level: number;
  score: number;
  onReset: ((event: GestureResponderEvent) => void) | undefined;
  onNextLevel: ((event: GestureResponderEvent) => void) | undefined;
};

class Clear extends React.Component<Props> {
  render() {
    return (
      <View style={styles.clearScreen}>
        <View style={styles.clearedLevelContainer}>
          <Text style={styles.clearedLevelText}>Level</Text>
          <Text style={styles.clearedLevelText}>{this.props.level}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Cleared</Text>
          <Text style={styles.panelText}>Score:{this.props.score}</Text>

          <View style={styles.panelButtonsContainer}>
            <TouchableWithoutFeedback onPress={this.props.onReset}>
              <View style={styles.panelButton}>
                <Image
                  style={styles.panelButtonIcon}
                  resizeMode="contain"
                  source={Images.restartIcon}
                />
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={this.props.onNextLevel}>
              <View style={styles.panelButton}>
                <Image
                  style={styles.panelButtonIcon}
                  resizeMode="contain"
                  source={Images.playIcon}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}
export default Clear;
