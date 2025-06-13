import React, { useState, useRef, useEffect } from 'react';
import { Check, Edit2, Trash2, GripVertical } from 'lucide-react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (text: string) => void;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  dragHandleProps?: any;
}

export function TodoItem({ 
  todo, 
  isEditing, 
  onToggle, 
  onDelete, 
  onEdit, 
  onStartEdit, 
  onCancelEdit,
  dragHandleProps 
}: TodoItemProps) {
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editText.trim()) {
      onEdit(editText.trim());
    } else {
      onCancelEdit();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditText(todo.text);
      onCancelEdit();
    }
  };

  return (
    <div className={`group flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-200 ${todo.completed ? 'opacity-60' : ''}`}>
      <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
        <GripVertical className="h-4 w-4" />
      </div>
      
      <button
        onClick={onToggle}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
          todo.completed
            ? 'bg-emerald-500 border-emerald-500 text-white'
            : 'border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400'
        }`}
      >
        {todo.completed && <Check className="h-3 w-3" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="w-full">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSubmit}
              className="w-full px-2 py-1 bg-transparent border-none outline-none text-slate-900 dark:text-slate-100 text-base"
            />
          </form>
        ) : (
          <p
            className={`text-base truncate cursor-pointer transition-all duration-200 ${
              todo.completed
                ? 'line-through text-slate-500 dark:text-slate-400'
                : 'text-slate-900 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400'
            }`}
            onClick={onStartEdit}
          >
            {todo.text}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={onStartEdit}
          className="p-2 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
          aria-label="Edit task"
        >
          <Edit2 className="h-4 w-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-200"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}