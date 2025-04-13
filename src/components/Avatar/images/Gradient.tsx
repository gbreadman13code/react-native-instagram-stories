import React from 'react';
import { ViewProps } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

interface GradientProps extends ViewProps {
  width?: number;
  height?: number;
}

const Gradient: React.FC<GradientProps> = ({ width = 96, height = 96, style }) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 96 96" style={style}>
      <Defs>
        <LinearGradient id="paint" x1="48" y1="0" x2="48" y2="96" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="black" stopOpacity="0" />
          <Stop offset="1" stopColor="black" stopOpacity="0.5" />
        </LinearGradient>
      </Defs>
      <Rect width="96" height="96" fill="url(#paint)" />
    </Svg>
  );
};

export default Gradient; 