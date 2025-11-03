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

export default function Index() {
  const tasks = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  
  // Use useWindowDimensions hook for responsive design
  const { width: screenWidth } = useWindowDimensions();
  const isDesktop = screenWidth > 768;

  const activeTodoCount = tasks?.filter((task) => !task.completed).length || 0;

  const handleAddTask = (title: string) => {
    const userId = "anonymous"; 
    createTodo({ title, userId });
  };

  const handleFilterChange = (newFilter: 'all' | 'active' | 'completed') => setFilter(newFilter);

  const handleClearCompleted = () => clearCompleted();

  const filteredTasks = tasks?.filter((task) => {
    const matchesFilter = () => {
      if (filter === 'active') return !task.completed;
      if (filter === 'completed') return task.completed;
      return true;
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
              <TodoList todos={filteredTasks || []} />
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
  marginBottom: isDesktop ? 0 : 12
}}>
            <View style={{ 
  flexDirection: isDesktop ? 'row' : 'column', 
  justifyContent: isDesktop ? 'space-between' : 'center',
  alignItems: 'center', 
  width: '100%',
  marginBottom: isDesktop ? 0 : 12
}}>
  <View style={{ 
    flexDirection: 'row',
    flex: isDesktop ? 1 : undefined, // Take available space on desktop
    justifyContent: isDesktop ? 'center' : 'center' // Center the buttons
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
      <ClearCompletedButton onPress={handleClearCompleted}>
    <ClearCompletedButtonText>Clear Completed</ClearCompletedButtonText>
  </ClearCompletedButton>
  </View>
</View>

          </View>
          <div style={{ marginTop: isDesktop ? 10 : 12 }}>
          <ItemsCounter>{activeTodoCount} items left</ItemsCounter>
          </div>
        </FilterContainer>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}