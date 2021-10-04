import React from 'react';
import { View, Text, TouchableWithoutFeedback, Image, GestureResponderEvent } from 'react-native';
import Images from './assets/Images';
import styles from './PopupStyles';

type Props = {
  level: number;
  score: number;
  onReset: ((event: GestureResponderEvent) => void) | undefined;
  onNextLevel: ((event: GestureResponderEvent) => void) | undefined;
};

export default class GameOver extends React.Component<Props> {
  render() {
    return (
      <View style={styles.clearScreen}>
        <View style={styles.clearedLevelContainer}>
          <Text style={styles.clearedLevelText}>Level</Text>
          <Text style={styles.clearedLevelText}>{this.props.level}</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Game Over</Text>
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
          </View>
        </View>
      </View>
    );
  }
}
