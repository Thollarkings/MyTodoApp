import styled from 'styled-components/native';
import { Dimensions, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  justify-content: space-between;
`;

export const MainContentContainer = styled.View`
  flex: 1;
  padding-horizontal: 20px;
  max-width: ${screenWidth > 768 ? '50%' : '90%'};
  width: 100%;
  align-self: center;
`;

export const InputSectionContainer = styled.View`
  margin-top: -150px;
  margin-bottom: 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.card};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const TodoListSectionContainer = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 5px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
  margin-bottom: 20px;
  min-height: 200px;
`;

export const FilterContainer = styled.View`
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 5px;
  margin-bottom: 20px;
`;

export const ItemsCounter = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

export const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  padding: 8px 12px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => (props.active ? props.theme.colors.primary : props.theme.colors.border)};
  background-color: ${(props) => (props.active ? props.theme.colors.primary : 'transparent')};
  margin-horizontal: 4px;
`;

export const FilterButtonText = styled.Text<{ active: boolean }>`
  color: ${(props) => (props.active ? '#fff' : props.theme.colors.text)};
  font-weight: bold;
  font-size: 12px;
`;

export const ClearCompletedButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.secondary};
  margin-left: 8px;
`;

export const ClearCompletedButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 12px;
`;

export const Placeholder = styled.Text`
  text-align: center;
  margin-top: 60px;
  font-size: 16px;
  color: ${(props) => props.theme.colors.textSecondary};
`;