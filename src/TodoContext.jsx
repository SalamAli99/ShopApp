// src/TodoContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  getTodos,
  createTodo,
  updateTodo,   //  ← make sure api.js exports this
  deleteTodo,
} from "./api";

const TodoCtx = createContext(null);
export const useTodos = () => useContext(TodoCtx);

export function TodoProvider({ children }) {
  const { user } = useAuth();

  const [todos, setTodos]   = useState([]);
  const [loading, setLoad]  = useState(true);

  /* ─── fetch on login ─── */
  useEffect(() => {
    (async () => {
      if (!user) { setTodos([]); setLoad(false); return; }

      setLoad(true);
      const { data } = await getTodos();      // { data: [...] }
      setTodos(data.data);
      setLoad(false);
    })();
  }, [user]);

  /* ─── CRUD helpers ─── */
  const add = async (title) => {
    const { data } = await createTodo({ user_id: user.id, title, is_completed: false });
    setTodos([...todos, data.todo]);
  };

 const update = async (id, payload) => {
  const { data } = await updateTodo(id, payload);        // PUT /todo/{id}
  setTodos(todos.map(t => (t.id === id ? data.todo : t))); // ✅ use data.todo
};

  const toggle = async (id, done) => update(id, { is_completed: done });

  const remove = async (id) => {
    await deleteTodo(id);
    setTodos(todos.filter(t => t.id !== id));
  };

  return (
    <TodoCtx.Provider value={{ todos, loading: loading, add, update, toggle, remove }}>
      {children}
    </TodoCtx.Provider>
  );
}
