export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          text: string;
          completed: boolean;
          user_id: string;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          text: string;
          completed?: boolean;
          user_id: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          text?: string;
          completed?: boolean;
          user_id?: string;
          order_index?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type Todo = Database['public']['Tables']['todos']['Row'];