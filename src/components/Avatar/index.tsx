import React, { FC, memo, useRef, useCallback } from 'react';
import {
  View, Image, Text, TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, useDerivedValue, withTiming,
} from 'react-native-reanimated';
import { StoryAvatarProps } from '../../core/dto/componentsDTO';
import AvatarStyles from './Avatar.styles';
import Loader from '../Loader';
import Gradient from './images/Gradient';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const StoryAvatar: FC<StoryAvatarProps> = ({
  id,
  avatarSource,
  name,
  stories,
  loadingStory,
  seenStories,
  onPress,
  colors,
  seenColors,
  size,
  showName,
  nameTextStyle,
  nameTextProps,
  renderAvatar,
  avatarBorderRadius,
  style,
}) => {
  const loaded = useSharedValue(false);
  const isLoading = useDerivedValue(() => loadingStory.value === id || !loaded.value);
  const seen = useDerivedValue(
    () => seenStories.value[id] === stories[stories.length - 1]?.id,
  );
  const loaderColor = useDerivedValue(() => (seen.value ? seenColors : colors));
  const avatarRef = useRef<View>(null);

  const onLoad = () => {
    loaded.value = true;
  };

  const handlePress = useCallback(() => {
    if (avatarRef.current) {
      avatarRef.current.measure((x, y, width, height, pageX, pageY) => {
        onPress({
          id,
          position: {
            x: pageX,
            y: pageY,
            scale: size / (width > height ? width : height) * 0.5
          }
        });
      });
    } else {
      onPress({ id });
    }
  }, [id, onPress, size]);

  const imageAnimatedStyles = useAnimatedStyle(() => (
    { opacity: withTiming(isLoading.value ? 0.5 : 1) }
  ));

  if (renderAvatar) {
    return renderAvatar(seen.value);
  }

  if (!avatarSource) {
    return null;
  }

  // Используем стиль по новому дизайну - квадратные аватары с градиентом и текстом
  const containerSize = size * 1.7; // Примерно 102px при стандартном size=60
  const imageSize = containerSize - 6; // Примерно 96px (чтобы оставить место для бордера)
  const borderRadius = avatarBorderRadius ?? 24; // Используем квадратные аватары с закругленными углами
  const innerBorderRadius = borderRadius - 2;

  return (
    <View style={[AvatarStyles.name, style]}>
      <View style={AvatarStyles.container} ref={avatarRef}>
        <TouchableOpacity 
          activeOpacity={0.6} 
          onPress={handlePress} 
          testID={`${id}StoryAvatar${stories.length}Story`}
          style={[
            AvatarStyles.imageWrapper,
            { 
              height: containerSize, 
              width: containerSize,
              borderRadius: borderRadius,
              borderColor: seen.value ? undefined : '#4169E1',
            }
          ]}
        >
          <AnimatedImage
            source={avatarSource}
            style={[
              AvatarStyles.image,
              imageAnimatedStyles,
              { 
                width: imageSize, 
                height: imageSize, 
                borderRadius: innerBorderRadius,
              },
            ]}
            testID="storyAvatarImage"
            onLoad={onLoad}
          />
          <View style={[
            AvatarStyles.gradientWrapper,
            { 
              height: imageSize, 
              width: imageSize, 
              borderRadius: innerBorderRadius,
            }
          ]}>
            <Gradient style={AvatarStyles.gradient} width={imageSize} height={imageSize} />
          </View>
          {name && (
            <View style={[
              AvatarStyles.textWrapper,
              { 
                borderRadius: innerBorderRadius,
              }
            ]}>
              <Text 
                ellipsizeMode='tail' 
                numberOfLines={4} 
                style={[
                  AvatarStyles.text,
                  nameTextStyle,
                ]}
              >
                {name}
              </Text>
            </View>
          )}
          {isLoading.value && (
            <Loader loading={isLoading} color={loaderColor} size={containerSize} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default memo(StoryAvatar);
