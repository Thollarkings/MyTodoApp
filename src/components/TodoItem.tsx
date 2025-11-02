import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, Platform } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useMutation } from 'convex/react';
import { api } from '@/src/convex/_generated/api';

const TaskCard = styled.View<{ isSelected: boolean; isSelectionMode: boolean }>`
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  border-width: 1px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.isSelected 
    ? props.theme.colors.primary + '20' 
    : props.theme.colors.card
  };
  border-color: ${(props) => props.isSelected 
    ? props.theme.colors.primary 
    : props.theme.colors.border
  };
  border-width: ${(props) => props.isSelected ? '2px' : '1px'};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4;
  elevation: 3;
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

export const TodoItem = ({ 
  item, 
  drag, 
  isActive, 
  isSelectionMode, 
  isSelected, 
  onSelect,
  onToggle,
  onDelete
}: TodoItemProps) => {
  const router = useRouter();
  const updateTodo = useMutation(api.todos.updateTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item.title);
  const [editedDescription, setEditedDescription] = useState(item.description || '');

  const handleDelete = (id: string) => {
    console.log("handleDelete in TodoItem reached for ID:", id);
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          console.log("Alert confirmed, calling onDelete for ID:", id);
          onDelete(id);
        },
        style: 'destructive',
      },
    ]);
  };

  const handleSave = () => {
    updateTodo({ 
      id: item._id, 
      title: editedTitle,
      description: editedDescription,
      completed: item.completed
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(item.title);
    setEditedDescription(item.description || '');
    setIsEditing(false);
  };

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
  const handleTaskPress = () => {
    if (isSelectionMode) {
      onSelect(item._id, !isSelected);
    }
  };

  const handleRadioPress = () => {
    onSelect(item._id, !isSelected);
  };

  const handleEditIconPress = () => {
    setIsEditing(true);
  };

  return (
    <TaskCard 
      style={isActive && { borderColor: 'blue', borderWidth: 2 }} 
      isSelected={isSelected} 
      isSelectionMode={isSelectionMode}
    >
      <LeftContainer onPress={handleTaskPress}>
        {/* Edit Icon (replaced the three lines) */}
        <EditIconContainer onPress={handleEditIconPress}>
          <EditIcon>
            <EditIconTip />
          </EditIcon>
        </EditIconContainer>
        
        {/* Show radio button in selection mode, checkbox in normal mode */}
        {isSelectionMode ? (
          <RadioButton selected={isSelected} onPress={handleRadioPress}>
            {isSelected && <RadioInner />}
          </RadioButton>
        ) : (
          <Checkbox 
            completed={item.completed} 
            onPress={() => {
              console.log("Left Checkbox pressed");
              console.log("Checkbox pressed for ID:", item._id, "isSelectionMode:", isSelectionMode);
              if (!isSelectionMode) {
                onSelect(item._id, true); // Select the item and initiate selection mode
              } else {
                onToggle(item._id); // Toggle completion if already in selection mode (though this path shouldn't be hit if RadioButton is rendered)
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
        
                                </DoneButton>      </LeftContainer>



      {/* Show buttons only when not in selection mode and todo is selected AND not editing */}
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

      {/* Show save/cancel buttons when editing */}
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