/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableWithoutFeedback,
} from 'react-native';
import Images from './assets/Images';
import Constants from './Global';
import Mole from './Mole';
import GameOver from './GameOver';
import Clear from './Clear';
import Pause from './Pause';

const DEFAULT_TIME = 5; //1ステージ5秒に設定

type Props = {
  pause: Function;
};

type StateAlias = {
  level: number;
  score: number;
  time: number;
  cleared: boolean;
  paused: boolean;
  gameOver: boolean;
  health: number;
};

const DEFAULT_STATE: StateAlias = {
  level: 1,
  score: 0,
  time: DEFAULT_TIME,
  cleared: false,
  paused: false,
  gameOver: false,
  health: 100,
};

export default class MainScreen extends React.Component<Props, StateAlias> {
  private moles: Mole[];
  private molesPopping: number;
  private interval: null | NodeJS.Timeout;
  private timeInterval: null | NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = DEFAULT_STATE;
    this.moles = [];
    this.molesPopping = 0;
    this.interval = null;
    this.timeInterval = null;
  }

  componentDidMount = () => {
    //setStateで状態更新、第2引数はcallback関数
    this.setState(DEFAULT_STATE, this.setupTicks);
  };

  setupTicks = () => {
    //もぐらの更新スピード決定
    let speed = 750 - this.state.level * 50;
    if (speed < 350) {
      speed = 350;
    }

    //もぐら更新スタート
    this.interval = setInterval(this.popRanndomMole, speed);

    //時間カウントスタート
    this.timeInterval = setInterval(this.timerTick, 1000);
  };

  //もぐら位置抽選
  randomBetween = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  //もぐらアクション終了で表示もぐらカウントをマイナス
  onFinishPopping = (index: number) => {
    this.molesPopping -= 1;
  };

  //表示するもぐら抽選して表示
  popRanndomMole = () => {
    //12匹の準備ができているかチェック
    if (this.moles.length != 12) {
      return;
    }

    let randomIndex = this.randomBetween(0, 11); //表示もぐら抽選
    //当選したもぐら位置が非表示かつ、表示中のもぐらが3匹以下なら表示する
    if (!this.moles[randomIndex].getIsPopping && this.molesPopping < 3) {
      this.molesPopping += 1;
      this.moles[randomIndex].pop();
    }
  };

  //時間更新
  timerTick = () => {
    if (this.state.time === 0) {
      if (this.interval) clearInterval(this.interval);
      if (this.timeInterval) clearInterval(this.timeInterval);
      this.setState({
        cleared: true,
      });
    } else {
      this.setState({
        time: this.state.time - 1,
      });
    }
  };

  reset = () => {
    this.molesPopping = 0;

    this.setState(DEFAULT_STATE, this.setupTicks);
  };

  pause = () => {
    console.log('pause1');
    if (this.interval) clearInterval(this.interval);
    if (this.timeInterval) clearInterval(this.timeInterval);

    console.log('pause2');

    this.setState({
      paused: true,
    });
  };

  resume = () => {
    this.molesPopping = 0;
    this.setState(
      {
        paused: false,
      },
      this.setupTicks
    );
  };

  nextLevel = () => {
    this.molesPopping = 0;

    this.setState(
      {
        level: this.state.level + 1,
        cleared: false,
        gameOver: false,
        time: DEFAULT_TIME,
      },
      this.setupTicks
    );
  };

  onScore = () => {
    this.setState({
      score: this.state.score + 1,
    });
  };

  onDamage = () => {
    if (this.state.cleared || this.state.gameOver || this.state.paused) {
      return;
    }

    let targetHealth = this.state.health - 10 < 0 ? 0 : this.state.health - 10;

    this.setState({
      health: targetHealth,
    });

    if (targetHealth <= 0) {
      this.gameOver();
    }
  };

  gameOver = () => {
    if (this.interval) clearInterval(this.interval);
    if (this.timeInterval) clearInterval(this.timeInterval);

    this.setState({
      gameOver: true,
    });
  };

  onHeal = () => {
    let targetHealth = this.state.health + 10 > 50 ? 50 : this.state.health + 10;
    this.setState({
      health: targetHealth,
    });
  };

  render() {
    let healthBarWidth =
      ((Constants.MAX_WIDTH - Constants.XR * 100 - Constants.XR * 60 - Constants.XR * 6) *
        this.state.health) /
      100;
    return (
      <View style={styles.container}>
        <Image style={styles.backgroundImage} resizeMode="stretch" source={Images.background} />
        <View style={styles.topPanel}>
          <SafeAreaView>
            <View style={styles.statsContainer}>
              <View style={styles.stats}>
                <View style={styles.levelContainer}>
                  <Text style={styles.levelTitle}>Level</Text>
                  <Text style={styles.levelNumber}>{this.state.level}</Text>
                </View>
              </View>
              <View style={styles.stats}>
                <View style={styles.timeBar}>
                  <Text style={styles.timeNumber}>{this.state.time}</Text>
                </View>
                <Image style={styles.timeIcon} resizeMode="stretch" source={Images.timeIcon} />
              </View>
              <View style={styles.stats}>
                <View style={styles.scoreBar}>
                  <Text style={styles.scoreNumber}>{this.state.score}</Text>
                </View>
                <Image style={styles.scoreIcon} resizeMode="stretch" source={Images.scoreIcon} />
              </View>
              <View style={styles.stats}>
                <TouchableWithoutFeedback onPress={this.pause}>
                  <View style={styles.pauseButton}>
                    <Image
                      style={styles.pauseButtonIcon}
                      resizeMode="stretch"
                      source={Images.pauseIcon}
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
            <View style={styles.healthBarContainer}>
              <View style={styles.healthBar}>
                <View style={[styles.healthBarInner, { width: healthBarWidth }]} />
              </View>
              <Image style={styles.healthIcon} resizeMode="stretch" source={Images.healthIcon} />
            </View>
          </SafeAreaView>
        </View>
        <View style={styles.playArea}>
          {
            //縦に4段
            Array.apply(null, Array(4)).map((el, rowIdx) => {
              return (
                <View style={styles.playRow} key={rowIdx}>
                  {
                    //横に3列
                    Array.apply(null, Array(3)).map((el, colIdx) => {
                      let moleIdx = rowIdx * 3 + colIdx;

                      return (
                        <View style={styles.playCell} key={colIdx}>
                          <Mole
                            index={moleIdx}
                            ref={(ref) => {
                              if (ref) this.moles[moleIdx] = ref;
                            }}
                            onFinishPopping={this.onFinishPopping}
                            onDamage={this.onDamage}
                            onHeal={this.onHeal}
                            onScore={this.onScore}
                          />
                        </View>
                      );
                    })
                  }
                </View>
              );
            })
          }
        </View>
        {this.state.cleared && (
          <Clear
            onReset={this.reset}
            onNextLevel={this.nextLevel}
            level={this.state.level}
            score={this.state.score}
          />
        )}
        {this.state.gameOver && (
          <GameOver
            onNextLevel={this.nextLevel}
            onReset={this.reset}
            level={this.state.level}
            score={this.state.score}
          />
        )}
        {this.state.paused && <Pause onReset={this.reset} onResume={this.resume} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column', //縦並びに
  },
  backgroundImage: {
    width: Constants.MAX_WIDTH,
    height: Constants.MAX_HEIGHT,
    position: 'absolute',
  },
  topPanel: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Constants.YR * 250,
    flexDirection: 'column',
  },
  statsContainer: {
    width: Constants.MAX_WIDTH,
    height: Constants.YR * 120,
    flexDirection: 'row',
  },
  stats: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainer: {
    width: Constants.YR * 80,
    height: Constants.YR * 80,
    backgroundColor: '#ff1a1a',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelTitle: {
    fontSize: Constants.YR * 25,
    color: 'white',
    fontFamily: Constants.FONT_LITITAONE_REGULAR,
  },
  levelNumber: {
    fontSize: Constants.YR * 21,
    color: 'white',
    fontFamily: Constants.FONT_LITITAONE_REGULAR,
  },
  timeIcon: {
    position: 'absolute',
    left: 0,
    width: Constants.YR * 40,
    height: Constants.YR * 40,
  },
  timeBar: {
    height: Constants.YR * 25,
    position: 'absolute',
    left: 20,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeNumber: {
    fontSize: Constants.YR * 22,
    color: 'black',
    fontFamily: Constants.FONT_LITITAONE_REGULAR,
  },
  scoreIcon: {
    position: 'absolute',
    left: 0,
    width: Constants.YR * 40,
    height: Constants.YR * 40,
  },
  scoreBar: {
    height: Constants.YR * 25,
    position: 'absolute',
    left: 20,
    right: 5,
    backgroundColor: 'white',
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scoreNumber: {
    fontSize: Constants.YR * 21,
    color: 'black',
    fontFamily: Constants.FONT_LITITAONE_REGULAR,
  },
  pauseButton: {
    width: Constants.YR * 50,
    height: Constants.YR * 50,
    backgroundColor: 'blue',
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pauseButtonIcon: {
    width: Constants.YR * 25,
    height: Constants.YR * 25,
  },
  healthBarContainer: {
    height: Constants.YR * 40,
    width: Constants.MAX_WIDTH - Constants.XR * 120,
    marginLeft: Constants.XR * 60,
  },
  healthIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Constants.YR * 40,
    height: Constants.YR * 40,
  },
  healthBar: {
    height: Constants.YR * 20,
    width: Constants.MAX_WIDTH - Constants.XR * 100 - Constants.XR * 60,
    marginLeft: Constants.XR * 40,
    marginTop: Constants.YR * 10,
    backgroundColor: 'white',
    borderRadius: Constants.YR * 10,
  },
  healthBarInner: {
    position: 'absolute',
    backgroundColor: '#ff1a1a',
    left: Constants.XR * 3,
    top: Constants.XR * 3,
    bottom: Constants.YR * 3,
    borderRadius: Constants.YR * 8,
  },
  playArea: {
    width: Constants.MAX_WIDTH,
    marginTop: Constants.YR * 250,
    height: Constants.MAX_HEIGHT - Constants.YR * 250 - Constants.YR * 112,
    flexDirection: 'column',
  },
  playRow: {
    height: (Constants.MAX_HEIGHT - Constants.YR * 250 - Constants.YR * 112) / 4,
    width: Constants.MAX_WIDTH,
    flexDirection: 'row',
  },
  playCell: {
    width: Constants.MAX_WIDTH / 3,
    height: (Constants.MAX_HEIGHT - Constants.YR * 250 - Constants.YR * 112) / 4,
    alignItems: 'center',
  },
});
