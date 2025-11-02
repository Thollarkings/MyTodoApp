import React, { useState } from 'react';
import { TextInput, TouchableOpacity, Text, View } from 'react-native';
import styled from 'styled-components/native';

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  background-color: ${(props) => props.theme.colors.card};
  border-radius: 12px; /* Set to 12px */
  padding: 8px;
`;

const StyledTextInput = styled.TextInput`
  flex: 1;
  padding: 10px;
  font-size: 16px;
  color: ${(props) => props.theme.colors.text};
  text-align: center; /* Centralize placeholder text */
`;

const AddButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.colors.primary};
  width: 50px; /* Set width */
  height: 50px; /* Set height */
  border-radius: 12px; /* Set to 12px */
  margin-left: 10px;
  justify-content: center;
  align-items: center;
`;

const AddButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 16px;
`;

interface TodoInputProps {
  onAddTask: (title: string) => void;
}

export const TodoInput = ({ onAddTask }: TodoInputProps) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim());
      setTaskTitle('');
    }
  };

  return (
    <InputContainer>
      <StyledTextInput
        placeholder="Create a new todo..." /* Placeholder */
        placeholderTextColor="${(props) => props.theme.colors.textSecondary}" /* Lighter placeholder */
        value={taskTitle}
        onChangeText={setTaskTitle}
        onSubmitEditing={handleAddTask}
      />
      <AddButton onPress={handleAddTask}>
        <AddButtonText>Add</AddButtonText>
      </AddButton>
    </InputContainer>
  );
};
