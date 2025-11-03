import { useWindowDimensions } from 'react-native';

export const useResponsiveProps = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width > 768;
  return { isDesktop };
};
