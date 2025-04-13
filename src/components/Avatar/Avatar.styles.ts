import { StyleSheet } from 'react-native';
import { AVATAR_OFFSET } from '../../core/constants';

export default StyleSheet.create( {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    left: AVATAR_OFFSET,
    top: AVATAR_OFFSET,
    position: 'absolute',
  },
  name: {
    alignItems: 'center',
  },
  imageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    borderCurve: 'continuous',
    borderWidth: 1.5,
  },
  image: {
    borderCurve: 'continuous'
  },
  gradientWrapper: {
    position: 'absolute',
    overflow: 'hidden',
    borderCurve: 'continuous'
  },
  gradient: {
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  textWrapper: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    top: 12,
    justifyContent: 'flex-end',
  },
  text: {
    verticalAlign: 'bottom',
    color: '#FFFFFF',
    fontFamily: 'InterTight-Medium',
    fontSize: 12,
    lineHeight: 17,
  }
} );
