import React, { useState, useEffect } from 'react';
import { View, Alert } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
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

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
  userId: string;
  description?: string;
  position: number;
}

interface TodoListProps {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const reorderTodos = useMutation(api.todos.reorderTodos);
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
      
      if (!isSelectionMode) {
        setIsSelectionMode(true);
      }
    } else {
      newSelected.delete(id);
      
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

  const handleDragEnd = async ({ data }: { data: Todo[] }) => {
    setTodos(data);
    
    try {
      const updates = data.map((todo, index) => ({
        id: todo._id,
        position: index
      }));
      
      await reorderTodos({ updates });
      console.log("Todos reordered successfully");
    } catch (error) {
      console.error("Failed to reorder todos:", error);
      Alert.alert("Error", "Failed to reorder tasks. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1 }}>
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

      {/* Draggable Todo List */}
      <DraggableFlatList
        data={todos}
        keyExtractor={(item) => item._id}
        onDragEnd={handleDragEnd}
        renderItem={({ item, drag, isActive }) => (
          <TodoItem
            key={item._id}
            item={item}
            drag={drag}
            isActive={isActive}
            isSelectionMode={isSelectionMode}
            isSelected={selectedTodos.has(item._id)}
            onSelect={handleSelect}
            onToggle={() => handleToggle(item._id)}
            onDelete={() => handleDelete(item._id)}
          />
        )}
        contentContainerStyle={{ 
          paddingBottom: 20,
          flexGrow: 1 
        }}
        activationDistance={10}
        dragItemOverflow={false}
      />
    </View>
  );
};