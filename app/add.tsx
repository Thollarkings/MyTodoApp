
// app/add.tsx
import { useMutation } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import DateTimePicker from '@react-native-community/datetimepicker';

const Container = styled.KeyboardAvoidingView`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
`;

const InnerContainer = styled.View`
  flex: 1;
  padding: 20px;
  padding-top: 60px;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 30px;
  text-align: center;
  color: ${(props) => props.theme.colors.text};
`;

const Input = styled.TextInput`
  border-width: 1px;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
  font-size: 16px;
  background-color: ${(props) => props.theme.colors.surface};
  color: ${(props) => props.theme.colors.text};
  border-color: ${(props) => props.theme.colors.border};
`;

const TextArea = styled(Input)`
  text-align-vertical: top;
`;

const Button = styled.TouchableOpacity`
  padding: 16px;
  border-radius: 12px;
  align-items: center;
  margin-top: 20px;
  ${(props) => {
    console.log("Button background color (inside function):", props.theme.colors.background);
    console.log("Button primary color (inside function):", props.theme.colors.primary);
    let styles = `background-color: ${props.theme.colors.background};`;
    if (props.theme.colors.background === '#FFFFFF') {
      styles += `
        border-width: 1px;
        border-color: ${props.theme.colors.primary};
      `;
    }
    return styles;
  }}
`;

const ButtonText = styled.Text`
  color: ${(props) => props.theme.colors.text};
  font-size: 18px;
  font-weight: 600;
`;

const DatePickerButton = styled.TouchableOpacity`
  border-width: 1px;
  border-radius: 12px;
  padding: 14px;
  margin-bottom: 20px;
  font-size: 16px;
  background-color: ${(props) => props.theme.colors.surface};
  border-color: ${(props) => props.theme.colors.border};
  justify-content: center;
`;

const DatePickerText = styled.Text`
  color: ${(props) => props.theme.colors.text};
`;

export default function AddTaskScreen() {
  const createTodo = useMutation(api.todos.createTodo);
  const router = useRouter();

  const [text, setText] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) {
      Alert.alert("Validation Error", "Task title is required.");
      return;
    }

    try {
      await createTodo({
        title: text.trim(),
        description: description.trim() || undefined,
        dueDate: date.toISOString().split('T')[0],
        userId: "anonymous", // Placeholder for now
      });
      Alert.alert("Success", "Task added successfully!");
      router.back(); // Navigate back to home screen
    } catch (error) {
      console.error("Failed to create task:", error);
      Alert.alert("Error", "Failed to add task. Please try again.");
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <Container behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <InnerContainer>
        <Title>Add New Task</Title>

        <Input
          placeholder="Task title *"
          placeholderTextColor={(props) => props.theme.colors.textSecondary}
          value={text}
          onChangeText={setText}
        />

        <TextArea
          placeholder="Description (optional)"
          placeholderTextColor={(props) => props.theme.colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
        />

        <DatePickerButton onPress={() => setShowDatePicker(true)}>
          <DatePickerText>{date.toDateString()}</DatePickerText>
        </DatePickerButton>

        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            is24Hour={true}
            display="default"
            onChange={onDateChange}
          />
        )}

        <Button onPress={handleAdd}>
          <ButtonText>Add Task</ButtonText>
        </Button>
      </InnerContainer>
    </Container>
  );
}