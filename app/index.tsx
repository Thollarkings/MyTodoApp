// app/index.tsx
import { api } from '@/src/convex/_generated/api';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { ScrollView, Text, View, TouchableOpacity, SafeAreaView, Dimensions, useWindowDimensions } from 'react-native';
import { TodoList } from '../src/components/TodoList';
import { TodoInput } from '../src/components/TodoInput';
import { Footer } from '../src/components/Footer';
import { Header } from '../src/components/Header';
import { 
  Container, 
  MainContentContainer, 
  InputSectionContainer, 
  TodoListSectionContainer, 
  FilterContainer, 
  ItemsCounter, 
  FilterButton, 
  FilterButtonText, 
  ClearCompletedButton, 
  ClearCompletedButtonText, 
  Placeholder
} from './_index.styles';

import { useState, useLayoutEffect, useEffect } from 'react';

/**
 * The main screen of the application.
 * It fetches todos from the database, manages the application's primary state,
 * and renders the main layout and components.
 */
export default function Index() {
  // Fetches all todos from the database, ordered by position.
  const tasks = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);

  // State for filtering the displayed todos.
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Local state for todos to enable optimistic updates for drag-and-drop.
  const [localTasks, setLocalTasks] = useState(tasks);

  // Effect to synchronize the local state with the data fetched from the database.
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);
  
  // Hooks for responsive design and ensuring client-side rendering.
  const { width: screenWidth } = useWindowDimensions();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures that the component only renders on the client-side,
    // preventing hydration errors with responsive hooks.
    setIsClient(true);
  }, []);

  // Avoid rendering on the server to prevent layout shifts.
  if (!isClient) {
    return <View style={{ flex: 1, backgroundColor: '#ffffff' }} />;
  }
  
  const isDesktop = screenWidth > 768;

  const activeTodoCount = tasks?.filter((task) => !task.completed).length || 0;

  /**
   * Handles the creation of a new todo.
   */
  const handleAddTask = (title: string) => {
    // For this example, a static userId is used.
    const userId = "anonymous"; 
    createTodo({ title, userId });
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => setFilter(newFilter);

  const handleClearCompleted = () => clearCompleted();

  // Apply the current filter to the local list of tasks.
  const filteredTasks = localTasks?.filter((task) => {
    const matchesFilter = () => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true; // 'all' filter
    };
    return matchesFilter();
  });

  return (
    <Container>
      <Header />
      <MainContentContainer style={{
        maxWidth: isDesktop ? '50%' : '100%',
        paddingHorizontal: isDesktop ? 20 : 16
      }}>
        <InputSectionContainer style={{
          width: '100%'
        }}>
          <TodoInput onAddTask={handleAddTask} />
        </InputSectionContainer>
        
        <TodoListSectionContainer style={{
          width: '100%'
        }}>
          {tasks === undefined ? (
            <Placeholder>Loading...</Placeholder>
          ) : filteredTasks?.length === 0 ? (
            <Placeholder>No tasks yet. Add one!</Placeholder>
          ) : (
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={{ 
                flexGrow: 1,
                minHeight: 200
              }}
              showsVerticalScrollIndicator={true}
              bounces={true}
              overScrollMode="never"
              alwaysBounceVertical={false}
            >
              <TodoList todos={filteredTasks || []} setTodos={setLocalTasks} />
            </ScrollView>
          )}          
        </TodoListSectionContainer>
        
        <FilterContainer style={{
          width: '100%'
        }}>
          <View style={{ 
            flexDirection: isDesktop ? 'row' : 'column', 
            justifyContent: isDesktop ? 'space-between' : 'center',
            alignItems: 'center', 
            width: '100%',
            marginBottom: isDesktop ? 0 : 11
          }}>
            <View style={{ 
              flexDirection: 'row',
              flex: isDesktop ? 1 : undefined,
              justifyContent: isDesktop ? 'center' : 'center'
            }}>
              <FilterButton active={filter === 'all'} onPress={() => handleFilterChange('all')}>
                <FilterButtonText active={filter === 'all'}>All</FilterButtonText>
              </FilterButton>
              <FilterButton active={filter === 'active'} onPress={() => handleFilterChange('active')}>
                <FilterButtonText active={filter === 'active'}>Active</FilterButtonText>
              </FilterButton>
              <FilterButton active={filter === 'completed'} onPress={() => handleFilterChange('completed')}>
                <FilterButtonText active={filter === 'completed'}>Completed</FilterButtonText>
              </FilterButton>
            </View>
            <ClearCompletedButton onPress={handleClearCompleted}>
              <ClearCompletedButtonText>Clear Completed</ClearCompletedButtonText>
            </ClearCompletedButton>
          </View>
          <div style={{ marginTop: 12}}>
          <ItemsCounter>{activeTodoCount} items left</ItemsCounter>
          </div>
        </FilterContainer>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}