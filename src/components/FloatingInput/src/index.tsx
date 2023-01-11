/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/require-default-props */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/function-component-definition */
import React, {useState, useRef, useEffect, forwardRef, useImperativeHandle} from 'react';
import {
  View,
  Animated as ReactAnimated,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
  TextProps,
  TextInputProps,
  TextStyle,
  ViewStyle,
  ImageStyle,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
} from 'react-native';
import Animated, {EasingNode, timing, interpolateColors} from 'react-native-reanimated';
import {theme, useTheme} from 'native-base';
import {styles} from './styles';

import makeVisibleWhite from './assets/make_visible_white.png';

import makeInvisibleWhite from './assets/make_invisible_white.png';

import makeVisibleBlack from './assets/make_visible_black.png';
import makeInvisibleBlack from './assets/make_invisible_black.png';
import {getValueWithCurrencyMask, getValueWithNonCurrencyMask} from './utils';
import {SubTitle} from '../../Typography';

export interface Props extends Omit<TextInputProps, 'secureTextEntry'> {
  /** Style to the container of whole component */
  containerStyles?: ViewStyle;
  /** Changes the color for hide/show password image */
  darkTheme?: true | false;
  /** Set this to true if you want the label to be always at a set position. Commonly used with hint for displaying both label and hint for your input. Default false. */
  staticLabel?: boolean;
  /** Hint displays only when staticLabel prop is set to true. This prop is used to show a preview of the input to the user */
  hint?: string;
  /** Set the color to the hint */
  hintTextColor?: string;
  isMandatory?: boolean;
  /** Value for the label, same as placeholder */
  label: string;
  /** Style to the label */
  labelStyles?: TextStyle;
  /** Set this to true if is password to have a show/hide input and secureTextEntry automatically */
  isPassword?: true | false;
  /** Callback for action submit on the keyboard */
  onSubmit?: () => void;
  /** Style to the show/hide password container */
  showPasswordContainerStyles?: ViewStyle;
  /** Style to the show/hide password image */
  showPasswordImageStyles?: ImageStyle;
  /** Style to the input */
  inputStyles?: TextStyle;
  /** Path to your custom image for show input */
  customShowPasswordImage?: string;
  /** Path to your custom image for hide input */
  customHidePasswordImage?: string;
  /** Custom Style for position, size and color for label, when it's focused or blurred */
  customLabelStyles?: CustomLabelProps;
  /** Required if onFocus or onBlur is overrided */
  isFocused?: boolean;
  /** Set a mask to your input */
  mask?: string;
  /** Set mask type */
  maskType?: 'currency' | 'phone' | 'date' | 'card';
  /** Set currency thousand dividers */
  currencyDivider?: ',' | '.';
  /** Maxinum number of decimal places allowed for currency mask. */
  maxDecimalPlaces?: number;
  /** Set currency on input value */
  currency?: string;
  /** Changes the input from single line input to multiline input */
  multiline?: true | false;
  /** Maxinum number of characters allowed. Overriden by mask if present */
  maxLength?: number;
  /** Shows the remaining number of characters allowed to be typed if maxLength or mask are present */
  showCountdown?: true | false;
  /** Style to the countdown text */
  showCountdownStyles?: TextStyle;
  /** Label for the remaining number of characters allowed shown after the number */
  countdownLabel?: string;
  /** Set your custom show password component */
  customShowPasswordComponent?: JSX.Element;
  /** Set your custom hide password component */
  customHidePasswordComponent?: JSX.Element;
  /** Callback for show/hide password */
  onTogglePassword?: (show: boolean) => void;
  /** Prop for force toggling show/hide password. If set to true, shows the password, and when set to false hides it. */
  togglePassword?: boolean;
  /** Add left component to your input. Usually used for displaying icon */
  leftComponent?: JSX.Element;
  /** Add right component to your input. Be aware if using the input as password this component is positioned before the show/hide component */
  rightComponent?: JSX.Element;
  /** Set custom animation duration. Default 300 ms */
  animationDuration?: number;
  /** Label Props */
  labelProps?: TextProps;
}

export interface SetGlobalStyles {
  /** Set global styles to all floating-label-inputs container */
  containerStyles?: ViewStyle;
  /** Set global custom styles to all floating-label-inputs labels */
  customLabelStyles?: CustomLabelProps;
  /** Set global styles to all floating-label-inputs input */
  inputStyles?: TextStyle;
  /** Set global styles to all floating-label-inputs label */
  labelStyles?: TextStyle;
  /** Set global styles to all floating-label-inputs show password container */
  showPasswordContainerStyles?: ViewStyle;
  /** Set global styles to all floating-label-inputs show password image */
  showPasswordImageStyles?: ImageStyle;
  /** Set global style to the countdown text */
  showCountdownStyles?: TextStyle;
}

export interface CustomLabelProps {
  /** Absolute distance from left-most side of the input when focused */
  leftFocused?: number;
  /** Absolute distance from left-most side of the input when blurred */
  leftBlurred?: number;
  /** Absolute distance from center of the input when focused */
  topFocused?: number;
  /** Absolute distance from center of the input when blurred */
  topBlurred?: number;
  /** Font size of label the when focused */
  fontSizeFocused?: number;
  /** Font size of label the when blurred */
  fontSizeBlurred?: number;
  /** Font color of label the when blurred */
  colorFocused?: string;
  /** Font color of label the when blurred */
  colorBlurred?: string;
}

/** Set global styles for all your floating-label-inputs */
const setGlobalStyles: SetGlobalStyles = {
  /** Set global styles to all floating-label-inputs container */
  containerStyles: undefined as ViewStyle | undefined,
  /** Set global custom styles to all floating-label-inputs labels */
  customLabelStyles: undefined as CustomLabelProps | undefined,
  /** Set global styles to all floating-label-inputs input */
  inputStyles: undefined as TextStyle | undefined,
  /** Set global styles to all floating-label-inputs label */
  labelStyles: undefined as TextStyle | undefined,
  /** Set global styles to all floating-label-inputs show password container */
  showPasswordContainerStyles: undefined as ViewStyle | undefined,
  /** Set global styles to all floating-label-inputs show password image */
  showPasswordImageStyles: undefined as ImageStyle | undefined,
  /** Set global style to the countdown text */
  showCountdownStyles: undefined as TextStyle | undefined,
};

interface InputRef {
  focus(): void;
  blur(): void;
}

const AnimatedText = Animated.createAnimatedComponent(Text);

const FloatingLabelInput: React.ForwardRefRenderFunction<InputRef, Props> = (
  {
    label,
    labelProps,
    mask,
    isPassword,
    maxLength,
    inputStyles,
    showCountdown,
    showCountdownStyles,
    labelStyles,
    darkTheme,
    countdownLabel,
    currencyDivider,
    currency,
    maskType,
    onChangeText,
    customHidePasswordComponent,
    customShowPasswordComponent,
    isFocused,
    onBlur,
    onFocus,
    onTogglePassword,
    togglePassword,
    leftComponent,
    rightComponent,
    customHidePasswordImage,
    customLabelStyles = {},
    staticLabel = false,
    hint,
    hintTextColor,
    onSubmit,
    containerStyles,
    customShowPasswordImage,
    showPasswordContainerStyles,
    maxDecimalPlaces,
    multiline,
    showPasswordImageStyles,
    value = '',
    animationDuration,
    isMandatory,
    ...rest
  }: Props,
  ref: any,
) => {
  const [halfTop, setHalfTop] = useState(0);
  const [isFocusedState, setIsFocused] = useState(false);
  const [secureText, setSecureText] = useState(true);
  const inputRef = useRef<any>(null);
  const {colors} = useTheme();

  customLabelStyles = {
    fontSizeFocused: 10,
    fontSizeBlurred: 14,
    colorFocused: '#49658c',
    colorBlurred: '#49658c',
    ...setGlobalStyles?.customLabelStyles,
    ...customLabelStyles,
  };

  const [fontColorAnimated] = useState(new Animated.Value(0));

  const [fontSizeAnimated] = useState(
    new Animated.Value(
      isFocused
        ? customLabelStyles.fontSizeFocused
          ? customLabelStyles.fontSizeFocused
          : 10
        : customLabelStyles.fontSizeBlurred
        ? customLabelStyles.fontSizeBlurred
        : 14,
    ),
  );

  const [leftAnimated] = useState(
    new Animated.Value(
      staticLabel
        ? customLabelStyles?.leftFocused !== undefined
          ? customLabelStyles.leftFocused
          : 15
        : customLabelStyles !== undefined && customLabelStyles.leftBlurred !== undefined
        ? customLabelStyles.leftBlurred
        : 0,
    ),
  );

  const [topAnimated] = useState(
    new Animated.Value(
      staticLabel
        ? customLabelStyles?.topFocused !== undefined
          ? customLabelStyles.topFocused
          : 0
        : customLabelStyles.topBlurred
        ? customLabelStyles.topBlurred
        : 0,
    ),
  );

  useEffect(() => {
    if (isFocused === undefined) {
      if (value !== '' || isFocusedState) {
        setIsFocused(true);
      } else if (value === '' || value === null) {
        setIsFocused(false);
      }
    }
  }, [value]);

  useEffect(() => {
    if (isFocused !== undefined) {
      if (value !== '' || isFocused) {
        setIsFocused(true);
      } else {
        setIsFocused(false);
      }
    }
  }, [isFocused, value]);

  useEffect(() => {
    if (togglePassword !== undefined) {
      toggleVisibility(togglePassword);
    }
  }, [togglePassword]);

  useEffect(() => {
    if (isFocusedState || value !== '') {
      if (halfTop !== 0) {
        animateFocus();
      }
    } else {
      animateBlur();
    }
  }, [isFocusedState, halfTop]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
    blur() {
      inputRef.current.blur();
    },
  }));

  useEffect(() => {
    if (!staticLabel && customLabelStyles.topFocused === undefined && isFocusedState) {
      ReactAnimated.parallel([
        timing(leftAnimated, {
          duration: animationDuration || 300,
          easing: EasingNode.linear,
          toValue: customLabelStyles.leftFocused ? customLabelStyles.leftFocused : 0,
        }),
        timing(fontSizeAnimated, {
          toValue: customLabelStyles.fontSizeFocused ? customLabelStyles.fontSizeFocused : 10,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),
        timing(topAnimated, {
          toValue: customLabelStyles.topFocused
            ? customLabelStyles.topFocused
            : -halfTop +
              (isFocusedState
                ? customLabelStyles.fontSizeFocused
                  ? customLabelStyles.fontSizeFocused
                  : 10
                : customLabelStyles.fontSizeBlurred
                ? customLabelStyles.fontSizeBlurred
                : 14),
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),

        timing(fontColorAnimated, {
          toValue: 1,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),
      ]).start();
    } else if (staticLabel && isFocusedState) {
      Animated.timing(fontColorAnimated, {
        toValue: 1,
        duration: animationDuration || 300,
        easing: EasingNode.linear,
      }).start();
    }
  }, [halfTop]);

  function animateFocus() {
    if (!staticLabel) {
      ReactAnimated.parallel([
        timing(leftAnimated, {
          duration: animationDuration || 300,
          easing: EasingNode.linear,
          toValue: customLabelStyles.leftFocused ? customLabelStyles.leftFocused : 0,
        }),
        timing(fontSizeAnimated, {
          toValue: customLabelStyles.fontSizeFocused ? customLabelStyles.fontSizeFocused : 10,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),
        timing(topAnimated, {
          toValue: customLabelStyles.topFocused
            ? customLabelStyles.topFocused
            : -halfTop +
              (isFocusedState
                ? customLabelStyles.fontSizeFocused
                  ? customLabelStyles.fontSizeFocused
                  : 10
                : customLabelStyles.fontSizeBlurred
                ? customLabelStyles.fontSizeBlurred
                : 14),
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),

        timing(fontColorAnimated, {
          toValue: 1,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),
      ]).start();
    } else {
      Animated.timing(fontColorAnimated, {
        toValue: 1,
        duration: animationDuration || 300,
        easing: EasingNode.linear,
      }).start();
    }
  }

  function animateBlur() {
    if (!staticLabel) {
      ReactAnimated.parallel([
        timing(leftAnimated, {
          duration: animationDuration || 300,
          easing: EasingNode.linear,
          toValue: customLabelStyles.leftBlurred ? customLabelStyles.leftBlurred : 0,
        }),
        timing(fontSizeAnimated, {
          toValue: customLabelStyles.fontSizeBlurred ? customLabelStyles.fontSizeBlurred : 14,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),
        timing(topAnimated, {
          toValue: customLabelStyles.topBlurred ? customLabelStyles.topBlurred : 0,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),

        timing(fontColorAnimated, {
          toValue: 0,
          duration: animationDuration || 300,
          easing: EasingNode.linear,
        }),
      ]).start();
    } else {
      Animated.timing(fontColorAnimated, {
        toValue: 0,
        duration: animationDuration || 300,
        easing: EasingNode.linear,
      }).start();
    }
  }

  function handleFocus() {
    setIsFocused(true);
  }

  function handleBlur() {
    if (value === '') {
      setIsFocused(false);
    }
  }

  const setFocus = () => {
    inputRef.current?.focus();
  };

  function setBlur() {
    inputRef.current?.blur();
  }

  function toggleVisibility(toggle?: boolean) {
    if (toggle === undefined) {
      if (onTogglePassword) {
        onTogglePassword(!secureText);
      }
      setSecureText(!secureText);
      secureText ? setFocus() : setBlur();
    } else if (!((secureText && !toggle) || (!secureText && toggle))) {
      if (onTogglePassword) {
        onTogglePassword(!toggle);
      }
      setSecureText(!toggle);
      toggle ? setFocus() : setBlur();
    }
  }

  const onSubmitEditing=()=> {
    if (onSubmit !== undefined) {
      onSubmit();
    }
  }

  const imgSource = darkTheme
    ? secureText
      ? customShowPasswordImage || makeVisibleBlack
      : customHidePasswordImage || makeInvisibleBlack
    : secureText
    ? customShowPasswordImage || makeVisibleWhite
    : customHidePasswordImage || makeInvisibleWhite;

  const style: TextStyle = {
    ...setGlobalStyles?.labelStyles,
    ...labelStyles,
    left: labelStyles?.left !== undefined ? labelStyles?.left : 5,
    fontSize: staticLabel
      ? customLabelStyles?.fontSizeFocused !== undefined
        ? customLabelStyles.fontSizeFocused
        : 10
      : !isFocusedState
      ? customLabelStyles.fontSizeBlurred
      : customLabelStyles.fontSizeFocused,

    color: interpolateColors(fontColorAnimated, {
      inputRange: [0, 1],
      outputColorRange: [customLabelStyles.colorBlurred, customLabelStyles.colorFocused],
    }),
    alignSelf: 'center',
    position: 'absolute',
    flex: 1,
    zIndex: 999,
  };

  let input: TextStyle =
    inputStyles !== undefined
      ? inputStyles
      : setGlobalStyles?.inputStyles !== undefined
      ? setGlobalStyles.inputStyles
      : styles.input;

  input = {
    ...input,
    flex: 1,
    color: input.color !== undefined ? input.color : customLabelStyles.colorFocused,
    zIndex: style?.zIndex !== undefined ? style.zIndex - 2 : 0,
  };

  containerStyles =
    containerStyles !== undefined
      ? containerStyles
      : setGlobalStyles?.containerStyles !== undefined
      ? setGlobalStyles?.containerStyles
      : styles.container;

  containerStyles = {
    ...containerStyles,
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    zIndex: style?.zIndex !== undefined ? style.zIndex - 6 : 0,
  };

  let toggleButton =
    showPasswordContainerStyles !== undefined
      ? showPasswordContainerStyles
      : setGlobalStyles?.showPasswordContainerStyles !== undefined
      ? setGlobalStyles.showPasswordContainerStyles
      : styles.toggleButton;

  toggleButton = {
    ...toggleButton,
    alignSelf: 'center',
  };

  let img =
    showPasswordImageStyles !== undefined
      ? showPasswordImageStyles
      : setGlobalStyles?.showPasswordImageStyles !== undefined
      ? setGlobalStyles.showPasswordImageStyles
      : styles.img;

  img = {
    height: 25,
    width: 25,
    ...img,
  };

  const countdown = {
    ...styles.countdown,
    ...setGlobalStyles?.showCountdownStyles,
    ...showCountdownStyles,
  };

  const onChangeTextCallback = (val: string) => {
    if (onChangeText === undefined) return undefined;

    if (maskType === undefined && mask === undefined) return onChangeText(val);

    let newValue: string | undefined;

    if (maskType !== 'currency' && mask !== undefined) {
      newValue = getValueWithNonCurrencyMask({value: val, mask});
    }

    if (maskType === 'currency') {
      if (
        currency !== undefined &&
        !/^[0-9]+$/g.test(val.replace(/[.,]/g, '').replace(currency, '')) &&
        val.replace(/[.,]/g, '').replace(currency, '') !== ''
      ) {
        return undefined;
      }
      if (
        currency === undefined &&
        !/^[0-9]+$/g.test(val.replace(/[.,]/g, '')) &&
        val.replace(/[.,]/g, '') !== ''
      ) {
        return undefined;
      }

      newValue = getValueWithCurrencyMask({
        value: currency !== undefined ? value.replace(currency, '') : value,
        newValue: currency !== undefined ? val.replace(currency, '') : val,
        currencyDivider,
        maxDecimalPlaces,
      });
    }

    if (newValue !== undefined) {
      return onChangeText((currency !== undefined ? currency : '') + newValue);
    }
    return true;
  };

  const onLayout = (event: LayoutChangeEvent) => {
    const {height} = event.nativeEvent.layout;
    setHalfTop(height / 2);
  };

  return (
    <TouchableWithoutFeedback onLayout={onLayout} onPress={setFocus}>
      <View style={{flexDirection: 'row'}}>
        {staticLabel && (
          <AnimatedText
            {...labelProps}
            style={[
              style,
              {
                left: labelStyles?.left
                  ? labelStyles?.left
                  : customLabelStyles.leftFocused
                  ? customLabelStyles.leftFocused
                  : 20,
                top: -(style?.fontSize ? style?.fontSize : 10) / 2,
              },
            ]}
            onPress={setFocus}>
            {label}
          </AnimatedText>
        )}
        <View style={containerStyles}>
          {leftComponent && leftComponent}
          <View style={{flex: 1, flexDirection: 'row'}}>
            {!staticLabel && (
              <View>
                <AnimatedText
                  {...labelProps}
                  style={[
                    style,
                    {
                      fontSize: fontSizeAnimated,
                      transform: [{translateX: leftAnimated}, {translateY: topAnimated}],
                    },
                  ]}
                  onPress={setFocus}>
                  <Text>
                    {label}{' '}
                    {isMandatory && <SubTitle style={{color: colors.red['900']}}>*</SubTitle>}
                  </Text>
                </AnimatedText>
              </View>
            )}
            <TextInput
              ref={inputRef}
              secureTextEntry={isPassword !== undefined ? isPassword && secureText : false}
              value={value}
              onBlur={onBlur !== undefined ? onBlur : handleBlur}
              onFocus={onFocus !== undefined ? onFocus : handleFocus}
              onSubmitEditing={onSubmitEditing}
              {...rest}
              maxLength={
                mask !== undefined ? mask.length : maxLength !== undefined ? maxLength : undefined
              }
              multiline={multiline}
              placeholder={(staticLabel || isFocusedState) && hint ? hint : ''}
              placeholderTextColor={hintTextColor}
              style={input}
              onChangeText={onChangeTextCallback}
            />
            {rightComponent && rightComponent}
            {isPassword && (
              <TouchableOpacity style={toggleButton} onPress={() => toggleVisibility()}>
                {secureText && customShowPasswordComponent !== undefined ? (
                  customShowPasswordComponent
                ) : !secureText && customHidePasswordComponent !== undefined ? (
                  customHidePasswordComponent
                ) : (
                  <Image resizeMode="contain" source={imgSource} style={img} />
                )}
              </TouchableOpacity>
            )}
          </View>
          {showCountdown && maxLength && (
            <Text style={countdown}>
              {maxLength - (value ? value.length : 0)} {countdownLabel}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export {setGlobalStyles};
export default forwardRef(FloatingLabelInput);
