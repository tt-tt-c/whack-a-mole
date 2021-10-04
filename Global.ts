import { Dimensions, Platform } from 'react-native';

type ConstantsAlias = {
  MAX_WIDTH: number;
  MAX_HEIGHT: number;
  XR: number;
  YR: number;
  FONT_LITITAONE_REGULAR: string;
};

const Constants: ConstantsAlias = {
  MAX_WIDTH: Dimensions.get('screen').width,
  MAX_HEIGHT: Dimensions.get('screen').height,
  XR: Dimensions.get('screen').width / 650,
  YR: Dimensions.get('screen').height / 1024,
  FONT_LITITAONE_REGULAR: Platform.OS === 'ios' ? 'LilitaOne' : 'LilitaOne-Regular',
};

export default Constants;
