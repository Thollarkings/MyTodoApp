import React from 'react';
import { Text, TouchableOpacity, TextInput, View, ImageBackground, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styled, { useTheme } from 'styled-components/native';
import { useTheme as useAppTheme } from '../contexts/ThemeContext';

const HeaderContainer = styled(ImageBackground)`
  height: 325px; /* Increased height by 30% */
  width: 100%; /* Ensure full width */
  flex-direction: column; /* Changed to column for stacking elements */
  justify-content: space-between;
  align-items: center;
`;

const GradientOverlay = styled(LinearGradient)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 50px 20px 20px 20px;
`;

const screenWidth = Dimensions.get('window').width;

const TopRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: ${screenWidth < 768 ? '90%' : '50%'};
  margin: 0 auto;
  padding-horizontal: 20px; /* Align with MainContentContainer */
`;

const HeaderTitle = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 4px;
`;

const ThemeToggle = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.2);
`;

const ThemeToggleText = styled.Text`
  color: #fff;
  font-weight: 600;
`;

interface HeaderProps {
}

export const Header = ({ }: HeaderProps) => {
  const { toggleTheme } = useAppTheme();
  const theme = useTheme();

  return (
    <HeaderContainer source={require('../../assets/images/mountain.jpg')} resizeMode="cover">
      <GradientOverlay colors={['rgba(55, 16, 189, 0.7)', 'rgba(164, 35, 149, 0.7)']}>
        <TopRow>
          <HeaderTitle>T O D O</HeaderTitle>
          <ThemeToggle onPress={toggleTheme}>
<ThemeToggleText style={{ fontSize: 20 }}>{theme.name === 'dark' ? '🌙' : '☀️'}</ThemeToggleText></ThemeToggle>
        </TopRow>
      </GradientOverlay>
    </HeaderContainer>
  );
};
