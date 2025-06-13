import React from 'react';
import { CheckSquare } from 'lucide-react';
import { AddTodo } from './components/AddTodo';
import { TodoList } from './components/TodoList';
import { ThemeToggle } from './components/ThemeToggle';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    reorderTodos,
    clearCompleted,
    editingId,
    setEditingId,
  } = useTodos();

  const handleEditTodo = (id: string, text: string) => {
    updateTodo(id, { text });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-500 rounded-xl shadow-lg">
              <CheckSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                TodoFlow
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Stay organized, stay productive
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {todos.length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Total</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {todos.filter(todo => !todo.completed).length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Active</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {todos.filter(todo => todo.completed).length}
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400">Done</div>
          </div>
        </div>

        {/* Add Todo */}
        <div className="mb-8">
          <AddTodo onAdd={addTodo} />
        </div>

        {/* Todo List */}
        <TodoList
          todos={todos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={handleEditTodo}
          onReorder={reorderTodos}
          onClearCompleted={clearCompleted}
          editingId={editingId}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  );
}

export default App;