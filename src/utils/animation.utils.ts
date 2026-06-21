import { withTiming, withSpring } from 'react-native-reanimated';

export const animationConfigs = {
  // Fade in animation
  fadeIn: {
    duration: 300,
    easing: 'ease-out' as const,
  },
  
  // Scale animation (button press)
  scale: {
    press: {
      from: 1,
      to: 0.96,
      duration: 100,
    },
  },
  
  // Slide up animation (cards entering)
  slideUp: {
    duration: 400,
    delay: 150,
  },
  
  // Spring animation (interactive elements)
  spring: {
    damping: 15,
    stiffness: 150,
  },
};

export const createFadeIn = (delay = 0) => ({
  0: {
    opacity: 0,
    transform: [{ translateY: 20 }],
  },
  1: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
});

export const createScalePress = () => ({
  pressIn: () => withTiming(0.96, { duration: 100 }),
  pressOut: () => withSpring(1, { damping: 15, stiffness: 150 }),
});
