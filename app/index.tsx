// app/index.tsx
import { api } from '@/src/convex/_generated/api';
import { useRouter } from 'expo-router';
import { useQuery, useMutation } from 'convex/react';
import { ScrollView, Text, View, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
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

import { useState, useLayoutEffect } from 'react';

const screenWidth = Dimensions.get('window').width;

export default function Index() {
  const tasks = useQuery(api.todos.getTodos);
  const createTodo = useMutation(api.todos.createTodo);
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

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
      <MainContentContainer>
        <InputSectionContainer>
          <TodoInput onAddTask={handleAddTask} />
        </InputSectionContainer>
        
        <TodoListSectionContainer>
          {tasks === undefined ? (
            <Placeholder>Loading...</Placeholder>
          ) : filteredTasks?.length === 0 ? (
            <Placeholder>No tasks yet. Add one!</Placeholder>
          ) : (
            <ScrollView 
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              showsVerticalScrollIndicator={true}
              bounces={true}
            >
              <TodoList todos={filteredTasks || []} />
            </ScrollView>
          )}          
        </TodoListSectionContainer>
        
        <FilterContainer>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <View style={{ flexDirection: 'row' }}>
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
          <ItemsCounter>{activeTodoCount} items left</ItemsCounter>
        </FilterContainer>
      </MainContentContainer>
      <Footer />
    </Container>
  );
}