import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/src/convex/_generated/api';

const TaskCard = styled.View<{ isSelected: boolean; isSelectionMode: boolean; isDragging: boolean }>`
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => {
    if (props.isDragging) return props.theme.colors.primary + '20';
    if (props.isSelected) return props.theme.colors.primary + '20';
    return props.theme.colors.card;
  }};
  border-color: ${(props) => {
    if (props.isDragging) return props.theme.colors.primary;
    if (props.isSelected) return props.theme.colors.primary;
    return props.theme.colors.border;
  }};
  border-width: ${(props) => (props.isDragging || props.isSelected) ? '2px' : '1px'};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: ${(props) => props.isDragging ? 0.3 : 0.1};
  shadow-radius: ${(props) => props.isDragging ? 8 : 4};
  elevation: ${(props) => props.isDragging ? 8 : 3};
  transform: ${(props) => props.isDragging ? 'scale(1.02)' : 'scale(1)'};
`;

const DragHandle = styled.TouchableOpacity`
  padding: 12px 8px;
  margin-right: 4px;
  justify-content: center;
  align-items: center;
`;

const DragHandleIcon = styled.View`
  width: 16px;
  height: 14px;
  justify-content: space-between;
`;

const DragHandleLine = styled.View`
  width: 100%;
  height: 2px;
  background-color: ${(props) => props.theme.colors.textSecondary};
  border-radius: 1px;
`;



const LeftContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const RightContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const RadioButton = styled.TouchableOpacity<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border-width: 2px;
  border-color: ${(props) => props.selected ? props.theme.colors.primary : props.theme.colors.border};
  margin-right: 12px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.selected ? props.theme.colors.primary : 'transparent'};
`;

const RadioInner = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #fff;
`;

const Checkbox = styled.TouchableOpacity<{ completed: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: 12px;
  border-width: 2px;
  border-color: ${(props) => props.theme.colors.border};
  margin-right: 12px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.completed ? props.theme.colors.primary : 'transparent')};
`;

const CheckboxInner = styled.View`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: #fff;
`;



const TaskContent = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: center;
`;

const TaskTextContainer = styled.View`
  flex: 1;
`;

const TaskTitle = styled.Text`
  font-size: 16px;
  line-height: 24px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
`;

const TaskDescription = styled.Text`
  font-size: 14px;
  line-height: 20px;
  margin-top: 4px;
  color: ${(props) => props.theme.colors.textSecondary};
`;

const ButtonContainer = styled.View`
  flex-direction: row;
  margin-left: 12px;
`;

const Button = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 8px;
`;

const EditButton = styled(Button)`
  background-color: #3498db;
`;

const DeleteButton = styled(Button)`
  background-color: #e74c3c;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 12px;
`;

const DoneButton = styled.TouchableOpacity<{ completed: boolean }>`
  padding: 6px 10px;
  border-radius: 6px;
  background-color: ${(props) => (props.completed ? '#2ecc71' : '#cccccc')};
  margin-left: 12px;
`;



// Edit Icon (pencil icon using CSS)
const EditIconContainer = styled.TouchableOpacity`
  width: 20px;
  height: 20px;
  margin-right: 12px;
  justify-content: center;
  align-items: center;
`;

const EditIcon = styled.View`
  width: 16px;
  height: 16px;
  border-left-width: 2px;
  border-bottom-width: 2px;
  border-color: ${(props) => props.theme.colors.textSecondary};
  transform: rotate(-45deg);
  position: relative;
`;

const EditIconTip = styled.View`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  border-top-width: 2px;
  border-right-width: 2px;
  border-color: ${(props) => props.theme.colors.textSecondary};
`;

interface TodoItemProps {
  item: {
    _id: string;
    title: string;
    description?: string;
    completed: boolean;
  };
  drag: () => void;
  isActive: boolean;
  isSelectionMode: boolean;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * Represents a single todo item in the list.
 * Handles its own state for editing and provides callbacks for parent-managed actions
 * like selection, deletion, and toggling completion.
 */
export const TodoItem = ({
  item,
  drag,
  isActive, // Prop from DraggableFlatList indicating if the item is being dragged
  isSelectionMode,
  isSelected,
  onSelect,
  onToggle,
  onDelete
}: TodoItemProps) => {
  const router = useRouter();
  const updateTodo = useMutation(api.todos.updateTodo);

  // Internal state for managing the edit mode of the todo item.
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description || '');

  /**
   * Prompts the user for confirmation before deleting the task.
   */
  const handleDelete = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          onDelete(id);
        },
        style: 'destructive',
      },
    ]);
  };

  /**
   * Saves the edited title and description and exits edit mode.
   */
  const handleSave = () => {
    updateTodo({
      id: item._id,
      title: editedTitle,
      description: editedDescription,
      completed: item.completed
    });
    setIsEditing(false);
  };

  /**
   * Cancels the edit operation and reverts any changes.
   */
  const handleCancel = () => {
    setEditedTitle(item.title);
    setEditedDescription(item.description || '');
    setIsEditing(false);
  };

  /**
   * Toggles the completion status of the todo.
   * Includes a confirmation step if un-completing a task.
   */
  const handleToggleCompleted = async () => {
    if (item.completed) {
      let confirmUndo = false;
      if (Platform.OS === 'web') {
        confirmUndo = window.confirm('Are you sure you want to mark this task as undone?');
      } else {
        confirmUndo = await new Promise<boolean>((resolve) => {
          Alert.alert(
            'Undo Task',
            'Are you sure you want to mark this task as undone?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => resolve(false) },
              { text: 'Undo', style: 'default', onPress: () => resolve(true) },
            ]
          );
        });
      }

      if (confirmUndo) {
        updateTodo({
          id: item._id,
          title: item.title,
          description: item.description,
          completed: false
        });
      }
    } else {
      updateTodo({
        id: item._id,
        title: item.title,
        description: item.description,
        completed: true
      });
    }
  };

  /**
   * Handles presses on the task card itself.
   * In selection mode, it toggles the selection state.
   */
  const handleTaskPress = () => {
    if (isSelectionMode) {
      onSelect(item._id, !isSelected);
    }
  };

  /**
   * Handles presses on the radio button in selection mode.
   */
  const handleRadioPress = () => {
    onSelect(item._id, !isSelected);
  };

  /**
   * Enters edit mode when the edit icon is pressed.
   */
  const handleEditIconPress = () => {
    setIsEditing(true);
  };

  return (
    <TaskCard
      isSelected={isSelected}
      isSelectionMode={isSelectionMode}
      isDragging={isActive}
    >
      {/* The drag handle is only visible when not in selection mode. */}
      {!isSelectionMode && (
        <DragHandle
          onLongPress={drag} // Activates drag on long press
          delayLongPress={200}
          onPressIn={drag} // Allows immediate drag on press-in for better responsiveness
        >
          <DragHandleIcon>
            <DragHandleLine />
            <DragHandleLine />
            <DragHandleLine />
          </DragHandleIcon>
        </DragHandle>
      )}

      <LeftContainer onPress={handleTaskPress}>
        {/* Edit Icon */}
        <EditIconContainer onPress={handleEditIconPress}>
          <EditIcon>
            <EditIconTip />
          </EditIcon>
        </EditIconContainer>

        {/* In selection mode, a radio button is shown. Otherwise, a checkbox is shown. */}
        {isSelectionMode ? (
          <RadioButton selected={isSelected} onPress={handleRadioPress}>
            {isSelected && <RadioInner />}
          </RadioButton>
        ) : (
          <Checkbox
            completed={item.completed}
            onPress={() => {
              if (!isSelectionMode) {
                // If not in selection mode, pressing the checkbox initiates selection mode.
                onSelect(item._id, true);
              } else {
                // This case should ideally not be hit if the checkbox isn't shown in selection mode,
                // but as a fallback, it toggles the item.
                onToggle(item._id);
              }
            }}
          >
            {item.completed && <CheckboxInner />}
          </Checkbox>
        )}

        <TaskContent onPress={handleTaskPress}>
          <TaskTextContainer>
            {isEditing ? (
              <>
                <TextInput
                  value={editedTitle}
                  onChangeText={setEditedTitle}
                  style={{ fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4, padding: 0 }}
                  autoFocus
                />
                <TextInput
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  style={{ fontSize: 14, color: '#888', padding: 0 }}
                  multiline
                  placeholder="Add description (optional)"
                />
              </>
            ) : (
              <>
                <TaskTitle style={item.completed && { textDecorationLine: 'line-through', opacity: 0.7 }}>
                  {item.title}
                </TaskTitle>
                {item.description ? (
                  <TaskDescription>{item.description}</TaskDescription>
                ) : null}
              </>
            )}
          </TaskTextContainer>
        </TaskContent>

        <DoneButton completed={item.completed} onPress={(e) => { e.stopPropagation(); handleToggleCompleted(); }}>
          <ButtonText>{item.completed ? 'Undo' : 'Done'}</ButtonText>
        </DoneButton>
      </LeftContainer>

      {/* Action buttons are shown when an item is selected but not in selection mode or being edited. */}
      {!isSelectionMode && isSelected && !isEditing && (
        <ButtonContainer>
          <EditButton onPress={handleEditIconPress}>
            <ButtonText>Edit</ButtonText>
          </EditButton>
          <DeleteButton onPress={() => handleDelete(item._id)}>
            <ButtonText>Delete</ButtonText>
          </DeleteButton>
        </ButtonContainer>
      )}

      {/* Save and Cancel buttons are shown only during edit mode. */}
      {isEditing && (
        <ButtonContainer>
          <EditButton onPress={handleSave}>
            <ButtonText>Save</ButtonText>
          </EditButton>
          <DeleteButton onPress={handleCancel}>
            <ButtonText>Cancel</ButtonText>
          </DeleteButton>
        </ButtonContainer>
      )}
    </TaskCard>
  );
};