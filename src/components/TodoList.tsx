import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { CheckCircle, Circle, ArchiveX } from 'lucide-react';
import { TodoItem } from './TodoItem';
import { Todo, TodoFilter } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onReorder: (todos: Todo[]) => void;
  onClearCompleted: () => void;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}

export function TodoList({ 
  todos, 
  onToggle, 
  onDelete, 
  onEdit, 
  onReorder, 
  onClearCompleted,
  editingId,
  setEditingId 
}: TodoListProps) {
  const [filter, setFilter] = useState<TodoFilter>('all');

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;
      case 'completed':
        return todo.completed;
      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(filteredTodos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Rebuild the full todos array with the new order
    const newTodos = [...todos];
    const filteredIds = filteredTodos.map(todo => todo.id);
    const reorderedIds = items.map(todo => todo.id);
    
    // Update positions of filtered todos
    filteredIds.forEach((id, oldIndex) => {
      const newIndex = reorderedIds.indexOf(id);
      const todoIndex = newTodos.findIndex(todo => todo.id === id);
      if (todoIndex !== -1) {
        const todo = newTodos[todoIndex];
        newTodos.splice(todoIndex, 1);
        
        // Find the correct insertion point in the full array
        let insertIndex = 0;
        if (newIndex > 0) {
          const prevId = reorderedIds[newIndex - 1];
          const prevTodoIndex = newTodos.findIndex(todo => todo.id === prevId);
          insertIndex = prevTodoIndex + 1;
        }
        newTodos.splice(insertIndex, 0, todo);
      }
    });

    onReorder(newTodos);
  };

  const filterButtons = [
    { key: 'all', label: 'All', icon: Circle, count: todos.length },
    { key: 'active', label: 'Active', icon: Circle, count: activeTodos.length },
    { key: 'completed', label: 'Completed', icon: CheckCircle, count: completedTodos.length },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
          {filterButtons.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === key
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === key
                  ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          ))}
        </div>

        {completedTodos.length > 0 && (
          <button
            onClick={onClearCompleted}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-200"
          >
            <ArchiveX className="h-4 w-4" />
            Clear completed
          </button>
        )}
      </div>

      {/* Todo List */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
            {filter === 'completed' ? 'No completed tasks' : filter === 'active' ? 'No active tasks' : 'No tasks yet'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {filter === 'completed' 
              ? 'Completed tasks will appear here' 
              : filter === 'active' 
                ? 'Active tasks will appear here'
                : 'Add a task to get started'
            }
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-3 transition-colors duration-200 ${
                  snapshot.isDraggingOver ? 'bg-slate-50 dark:bg-slate-900 rounded-xl p-2' : ''
                }`}
              >
                {filteredTodos.map((todo, index) => (
                  <Draggable key={todo.id} draggableId={todo.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`transition-transform duration-200 ${
                          snapshot.isDragging ? 'transform rotate-2 scale-105' : ''
                        }`}
                      >
                        <TodoItem
                          todo={todo}
                          isEditing={editingId === todo.id}
                          onToggle={() => onToggle(todo.id)}
                          onDelete={() => onDelete(todo.id)}
                          onEdit={(text) => {
                            onEdit(todo.id, text);
                            setEditingId(null);
                          }}
                          onStartEdit={() => setEditingId(todo.id)}
                          onCancelEdit={() => setEditingId(null)}
                          dragHandleProps={provided.dragHandleProps}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}