import { AuthProvider, useAuth } from "./AuthContext";
import { TodoProvider } from "./TodoContext";   
import TodoApp from "./components/TodoApp";  
import { useState } from "react";
function AuthForm() {
  const { login, signup } = useAuth();
  const [state, setState] = useState({ name: "", email: "", password: "" });

  const handle = (e) => setState({ ...state, [e.target.name]: e.target.value });

  return (
    <div className="space-y-4 max-w-sm mx-auto">
      <input name="name"     placeholder="Name"     onChange={handle} value={state.name}     className="border p-2 w-full" />
      <input name="email"    placeholder="Email"    onChange={handle} value={state.email}    className="border p-2 w-full" />
      <input name="password" type="password" placeholder="Password" onChange={handle} value={state.password} className="border p-2 w-full" />
      <button onClick={() => signup(state)} className="bg-blue-600 text-white px-4 py-2 w-full">Sign up</button>
      <button onClick={() => login({ email: state.email, password: state.password })} className="bg-green-600 text-white px-4 py-2 w-full">Log in</button>
    </div>
  );
}

function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div className="text-center space-y-4">
      <h1 className="text-2xl font-bold">Hello {user.name}</h1>
      <button onClick={logout} className="bg-red-600 text-white px-4 py-2">Log out</button>
    </div>
  );
}

function Inner() {
 const { user } = useAuth();

  return user ? (
    <TodoProvider>
      <Dashboard />
      <TodoApp />
    </TodoProvider>
  ) : (
    <AuthForm />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Inner />
    </AuthProvider>
  );
}
