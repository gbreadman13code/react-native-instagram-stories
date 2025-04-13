import React, { FC, memo } from 'react';
import { Platform } from 'react-native';
import Animated, { Extrapolation, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import { HEIGHT, WIDTH } from '../../core/constants';
import { AnimationProps } from '../../core/dto/componentsDTO';
import AnimationStyles from './Animation.styles';

const StoryAnimation: FC<AnimationProps> = ({
  children,
  x,
  index,
  animationType = 'page-flip', // По умолчанию используем новую анимацию
  perspectiveValue = WIDTH * 2,
  angleMultiplier = 0.1,
  scaleEffect = 0.95,
  zTranslation = -50,
}) => {
  const offset = WIDTH * index;
  const inputRange = [offset - WIDTH, offset, offset + WIDTH];
  const maskInputRange = [offset - WIDTH, offset, offset + WIDTH];

  // Анимация в стиле вращающегося куба (оригинальная анимация)
  const cubeAnimatedStyle = useAnimatedStyle(() => {
    const angle = Math.PI / 3;
    const ratio = Platform.OS === 'ios' ? 2 : 1.2;

    const translateX = interpolate(
      x.value,
      [offset - WIDTH, offset + WIDTH],
      [WIDTH / ratio, -WIDTH / ratio],
      Extrapolation.CLAMP,
    );

    const rotateY = interpolate(
      x.value,
      [offset - WIDTH, offset + WIDTH],
      [angle, -angle],
      Extrapolation.CLAMP,
    );

    const alpha = Math.abs(rotateY);
    const gamma = angle - alpha;
    const beta = Math.PI - alpha - gamma;
    const w = WIDTH / 2 - (WIDTH / 2 * (Math.sin(gamma) / Math.sin(beta)));
    const translateX1 = rotateY > 0 ? w : -w;
    const left = Platform.OS === 'android' ? interpolate(
      rotateY,
      [-angle, -angle + 0.1, 0, angle - 0.1, angle],
      [0, 20, 0, -20, 0],
      Extrapolation.CLAMP,
    ) : 0;

    return {
      transform: [
        { perspective: WIDTH },
        { translateX },
        { rotateY: `${rotateY}rad` },
        { translateX: translateX1 },
      ],
      left,
    };
  });

  // Анимация "перелистывания страницы" (новая анимация)
  const pageFlipAnimatedStyle = useAnimatedStyle(() => {
    // Текущее положение относительно центра этой карточки
    const position = x.value - offset;
    
    // Масштаб трансформации для создания эффекта глубины
    const scale = interpolate(
      Math.abs(position),
      [0, WIDTH],
      [1, scaleEffect],
      Extrapolation.CLAMP
    );
    
    // Базовое горизонтальное смещение
    const translateX = interpolate(
      x.value,
      inputRange,
      [-WIDTH, 0, WIDTH],
      Extrapolation.CLAMP,
    );
    
    // Эффект поворота, который создает впечатление "перелистывания"
    const rotateY = `${interpolate(
      position,
      [-WIDTH, 0, WIDTH],
      [angleMultiplier, 0, -angleMultiplier],
      Extrapolation.CLAMP,
    )}rad`;
    
    // Добавляем небольшую тень для усиления эффекта глубины
    const opacity = interpolate(
      Math.abs(position),
      [0, WIDTH],
      [1, 0.85],
      Extrapolation.CLAMP,
    );
    
    // Вычисляем дополнительное смещение по оси Z для создания эффекта приближения/отдаления краев
    const translateZ = interpolate(
      Math.abs(position),
      [0, WIDTH],
      [0, zTranslation],
      Extrapolation.CLAMP,
    );
    
    return {
      opacity,
      transform: [
        { perspective: perspectiveValue },
        { translateX },
        { scale },
        { rotateY },
        { translateZ },
      ],
    };
  });

  // Выбираем анимацию в зависимости от типа
  const animatedStyle = animationType === 'cube' ? cubeAnimatedStyle : pageFlipAnimatedStyle;

  // Маска для создания эффекта тени при переходе
  const maskAnimatedStyles = useAnimatedStyle(() => {
    const position = x.value - offset;
    
    // Для куба или перелистывания используем разные стили маски
    if (animationType === 'cube') {
      return {
        opacity: interpolate(
          x.value,
          maskInputRange,
          [0.5, 0, 0.5],
          Extrapolation.CLAMP,
        ),
        backgroundColor: 'black',
      };
    }
    
    // Для перелистывания
    return {
      opacity: interpolate(
        Math.abs(position),
        [0, WIDTH],
        [0, 0.35],
        Extrapolation.CLAMP,
      ),
      backgroundColor: 'black',
    };
  });

  return (
    <Animated.View style={[
      animatedStyle,
      AnimationStyles.container,
      AnimationStyles.pageAnimation,
    ]}>
      {children}
      <Animated.View
        style={[
          maskAnimatedStyles,
          AnimationStyles.absolute,
          { width: WIDTH, height: HEIGHT },
        ]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

export default memo(StoryAnimation);
