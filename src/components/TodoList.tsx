// src/components/TodoList.tsx
import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TodoItem } from './TodoItem';
import { useMutation } from 'convex/react';
import { api } from '@/src/convex/_generated/api';
import styled from 'styled-components/native';

const BatchActionContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${props => props.theme.colors.card};
  border-radius: 8px;
  margin-bottom: 16px;
`;

const BatchActionText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const BatchDeleteButton = styled.TouchableOpacity`
  background-color: #e74c3c;
  padding: 12px 20px;
  border-radius: 8px;
`;

const BatchDeleteButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;

const SelectionModeButton = styled.TouchableOpacity`
  background-color: #3498db;
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 16px;
  align-self: flex-start;
`;

const SelectionModeButtonText = styled.Text`
  color: #fff;
  font-weight: bold;
  font-size: 14px;
`;

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  userId: string;
  description?: string;
}

interface TodoListProps {
  todos: Todo[];
}

export const TodoList: React.FC<TodoListProps> = ({ todos }) => {
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  const handleToggle = (id: string) => {
    const todo = todos.find(t => t._id === id);
    if (todo) {
      updateTodo({ 
        id, 
        completed: !todo.completed,
        title: todo.title,
        description: todo.description || ''
      });
    }
  };

  const handleDelete = async (id: string) => {
    console.log("Attempting to delete todo with ID:", id);
    try {
      await deleteTodo({ id });
      console.log("Todo deleted successfully:", id);
    } catch (error) {
      console.error("Error deleting todo:", id, error);
      Alert.alert("Deletion Error", "Failed to delete task. Please try again.");
    }
  };

  const handleSelect = (id: string, selected: boolean) => {
    const newSelected = new Set(selectedTodos);
    if (selected) {
      newSelected.add(id);
      
      // Automatically enter selection mode when first todo is selected
      if (!isSelectionMode) {
        setIsSelectionMode(true);
      }
    } else {
      newSelected.delete(id);
      
      // Automatically exit selection mode when no todos are selected
      if (newSelected.size === 0) {
        setIsSelectionMode(false);
      }
    }
    setSelectedTodos(newSelected);
  };

  const handleBatchDelete = () => {
    console.log("handleBatchDelete called.");
    if (selectedTodos.size === 0) return;

    Alert.alert(
      'Delete Selected Tasks', 
      `Are you sure you want to delete ${selectedTodos.size} task${selectedTodos.size > 1 ? 's' : ''}?`, 
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            selectedTodos.forEach(async (id) => {
              try {
                await deleteTodo({ id });
              } catch (error) {
                console.error(`Error deleting todo ${id}:`, error);
                Alert.alert("Deletion Error", `Failed to delete task ${id}. Please try again.`);
              }
            });
            setSelectedTodos(new Set());
            setIsSelectionMode(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleCancelSelection = () => {
    setSelectedTodos(new Set());
    setIsSelectionMode(false);
  };

  return (
    <View>
      {/* Selection Mode Header - Show when in selection mode */}
      {isSelectionMode && (
                  <BatchActionContainer>
                    <BatchActionText>
                      {selectedTodos.size} task{selectedTodos.size > 1 ? 's' : ''} selected
                    </BatchActionText>
                    <BatchDeleteButton onPress={handleBatchDelete}>
                      <BatchDeleteButtonText>
                        Delete Selected
                      </BatchDeleteButtonText>
                    </BatchDeleteButton>
                  </BatchActionContainer>
      )}

      {/* Todo Items */}
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          item={todo}
          drag={() => {}} // You can keep your drag functionality
          isActive={false}
          isSelectionMode={isSelectionMode}
          isSelected={selectedTodos.has(todo._id)}
          onSelect={handleSelect}
          onToggle={() => handleToggle(todo._id)}
          onDelete={() => handleDelete(todo._id)}
        />
      ))}
    </View>
  );
};