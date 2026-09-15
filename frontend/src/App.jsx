import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Post from "./pages/Post"
import ProtectedRoute from "./ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
        <Route path="/post/:id" element={<Post/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;