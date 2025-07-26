import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './components/Login';
import Signin from './components/Signin';
import AddProduct from './components/AddProduct';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} /> {/* Dynamic Route */}
        <Route path="/login" element={<Login />}></Route> 
        <Route path="/signup" element={<Signin />}></Route>
        <Route path="/add" element={<AddProduct />}></Route>

      </Routes>
    </Router>
  );
}

export default App;