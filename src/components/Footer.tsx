import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

const GradientOverlay = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
`;

const HintText = styled.Text`
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #fff; /* Changed to white for better contrast on image */
`;

interface FooterProps {
}

export const Footer = () => {
  return (
    <ImageBackground source={require('../../assets/images/footer.jpeg')} style={{ width: '100%', height: 100 }} resizeMode="cover">
      <GradientOverlay colors={['rgba(55, 16, 189, 0.7)', 'rgba(164, 35, 149, 0.7)']}>
        <HintText> Copyright © 2025 Thollarkings</HintText>
      </GradientOverlay>
    </ImageBackground>
  );
};
