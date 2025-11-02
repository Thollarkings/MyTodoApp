// app/edit.tsx
import { useMutation } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
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
  background-color: ${(props) => props.theme.colors.primary};
`;

const ButtonText = styled.Text`
  color: #fff;
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

export default function EditTaskScreen() {
  const { task } = useLocalSearchParams();
  const [taskToEdit, setTaskToEdit] = useState(null);
  const updateTodo = useMutation(api.todos.updateTodo);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (task) {
      const parsedTask = JSON.parse(task);
      setTaskToEdit(parsedTask);
      setTitle(parsedTask.title);
      setDescription(parsedTask.description || "");
      if (parsedTask.dueDate) {
        setDate(new Date(parsedTask.dueDate));
      }
    }
  }, [task]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert("Validation Error", "Task title is required.");
      return;
    }

    if (!taskToEdit) {
      Alert.alert("Error", "Task not found.");
      return;
    }

    try {
      await updateTodo({
        id: taskToEdit._id,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: date.toISOString().split('T')[0],
      });
      Alert.alert("Success", "Task updated successfully!");
      router.back(); // Navigate back to home screen
    } catch (error) {
      console.error("Failed to update task:", error);
      Alert.alert("Error", "Failed to update task. Please try again.");
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
        <Title>Edit Task</Title>

        <Input
          placeholder="Task title *"
          placeholderTextColor={(props) => props.theme.colors.textSecondary}
          value={title}
          onChangeText={setTitle}
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

        <Button onPress={handleUpdate}>
          <ButtonText>Save Changes</ButtonText>
        </Button>
      </InnerContainer>
    </Container>
  );
}

