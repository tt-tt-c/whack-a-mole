import React, { Component } from 'react';
import { View, Text, TouchableWithoutFeedback, Image, GestureResponderEvent } from 'react-native';
import Images from './assets/Images';
import styles from './PopupStyles';

type Props = {
  onReset: ((event: GestureResponderEvent) => void) | undefined;
  onResume: ((event: GestureResponderEvent) => void) | undefined;
};

class Pause extends React.Component<Props> {
  render() {
    return (
      <View style={styles.clearScreen}>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Ready?</Text>

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
            <TouchableWithoutFeedback onPress={this.props.onResume}>
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

export default Pause;
