import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Todo } from '../types/todo';
import { useAuth } from './useAuth';

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fetch todos from Supabase
  const fetchTodos = useCallback(async () => {
    if (!user) {
      setTodos([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', user.id)
        .order('order_index', { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = useCallback(async (text: string) => {
    if (!user || !text.trim()) return;

    try {
      const maxOrder = Math.max(...todos.map(t => t.order_index), -1);
      const { data, error } = await supabase
        .from('todos')
        .insert({
          text: text.trim(),
          user_id: user.id,
          order_index: maxOrder + 1,
        })
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos(prev => [data, ...prev]);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }, [user, todos]);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('todos')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setTodos(prev => prev.map(todo => todo.id === id ? data : todo));
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }, [user]);

  const deleteTodo = useCallback(async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }, [user]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    await updateTodo(id, { completed: !todo.completed });
  }, [todos, updateTodo]);

  const reorderTodos = useCallback(async (newTodos: Todo[]) => {
    if (!user) return;

    // Update local state immediately for better UX
    setTodos(newTodos);

    try {
      // Update order_index for all todos
      const updates = newTodos.map((todo, index) => ({
        id: todo.id,
        order_index: index,
      }));

      for (const update of updates) {
        await supabase
          .from('todos')
          .update({ order_index: update.order_index })
          .eq('id', update.id)
          .eq('user_id', user.id);
      }
    } catch (error) {
      console.error('Error reordering todos:', error);
      // Revert on error
      fetchTodos();
    }
  }, [user, fetchTodos]);

  const clearCompleted = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('todos')
        .delete()
        .eq('user_id', user.id)
        .eq('completed', true);

      if (error) throw error;
      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch (error) {
      console.error('Error clearing completed todos:', error);
    }
  }, [user]);

  return {
    todos,
    loading,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    clearCompleted,
    editingId,
    setEditingId,
  };
}