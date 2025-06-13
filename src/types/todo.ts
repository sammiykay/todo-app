export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  user_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type TodoFilter = 'all' | 'active' | 'completed';