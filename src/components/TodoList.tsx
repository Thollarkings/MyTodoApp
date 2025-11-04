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

/**
 * Renders a draggable list of todo items.
 * This component manages the list's state, including selection for batch operations
 * and handling the drag-and-drop reordering logic.
 */
export const TodoList: React.FC<TodoListProps> = ({ todos, setTodos }) => {
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const reorderTodos = useMutation(api.todos.reorderTodos);

  // State for managing which todos are selected for batch operations.
  const [selectedTodos, setSelectedTodos] = useState<Set<string>>(new Set());
  // State to toggle the UI for batch actions.
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  /**
   * Toggles the completion status of a single todo item.
   */
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

  /**
   * Deletes a single todo item after confirmation.
   */
  const handleDelete = async (id: string) => {
    try {
      await deleteTodo({ id });
    } catch (error) {
      console.error("Error deleting todo:", id, error);
      Alert.alert("Deletion Error", "Failed to delete task. Please try again.");
    }
  };

  /**
   * Manages the selection of items. Entering selection mode when the first item is selected
   * and exiting when the last item is deselected.
   */
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

  /**
   * Handles the batch deletion of all selected todos.
   */
  const handleBatchDelete = () => {
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
                // Optionally, inform the user about specific failures.
              }
            });
            // Clear selection and exit selection mode after deletion.
            setSelectedTodos(new Set());
            setIsSelectionMode(false);
          },
          style: 'destructive',
        },
      ]
    );
  };

  /**
   * Callback for when a drag-and-drop operation concludes.
   * It optimistically updates the UI and sends the new order to the backend.
   */
  const handleDragEnd = async ({ data }: { data: Todo[] }) => {
    // Optimistically update the parent component's state for a smooth user experience.
    setTodos(data);
    
    try {
      // Map the new data to the format expected by the mutation.
      const updates = data.map((todo, index) => ({
        id: todo._id,
        position: index
      }));
      
      // Asynchronously send the updates to the backend.
      await reorderTodos({ updates });
    } catch (error) {
      console.error("Failed to reorder todos:", error);
      Alert.alert("Error", "Failed to reorder tasks. Please try again.");
      // Note: A robust implementation might revert the optimistic update on failure.
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* The batch action bar is only visible when in selection mode. */}
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

      <DraggableFlatList
        data={todos} // The data for the list comes directly from the parent component.
        keyExtractor={(item) => item._id}
        onDragEnd={handleDragEnd} // Callback to persist the new order.
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
        activationDistance={10} // Makes it easier to initiate a drag.
        dragItemOverflow={false}
      />
    </View>
  );
};