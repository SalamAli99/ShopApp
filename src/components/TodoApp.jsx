import { useState } from "react";
import { useTodos } from "../TodoContext";   // add, toggle, remove helpers

export default function TodoApp() {
  const { todos, add, toggle, remove, update } = useTodos(); // add update helper in context
  const [title, setTitle]     = useState("");
  const [editingId, setEdit]  = useState(null);      // ← NEW

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingId) {
      update(editingId, { title });   // call PUT /todo/{id}
    } else {
      add(title);                     // call POST /todo
    }
    setTitle("");
    setEdit(null);                    // reset edit mode
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* ─── add / update form ─── */}
      <form onSubmit={submit} className="flex gap-2">
        <input
          className="border flex-1 p-2"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* ─── list ─── */}
      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id} className="flex items-center justify-between border p-2 rounded">
            <label className="flex items-center gap-2 flex-1">
              <input
                type="checkbox"
                checked={!!t.is_completed}
                onChange={() => toggle(t.id, !t.is_completed)}
              />
              <span className={t.is_completed ? "line-through text-gray-400" : ""}>
                {t.title}
              </span>
            </label>

            {/* EDIT button */}
            <button
              onClick={() => {
                setTitle(t.title);
                setEdit(t.id);
              }}
              className="text-blue-600 mr-2"
            >
              edit
            </button>

            {/* DELETE button */}
            <button onClick={() => remove(t.id)} className="text-red-600">
              delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
