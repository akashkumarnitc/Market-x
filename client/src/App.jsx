import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Login from './components/Login';
import Signin from './components/Signin';
import AddProduct from './components/AddProduct';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import Cart from './pages/Cart';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} /> {/* Dynamic Route */}
        <Route path="/login" element={<Login />}></Route> 
        <Route path="/signup" element={<Signin />}></Route>
        <Route path="/add" element={<AddProduct />}></Route>
        <Route path="/sell" element ={<AddProduct/>}></Route>
        <Route path= "/profile" element ={<Profile/>}></Route>
        <Route path="/requests" element ={<Requests/>}></Route>
        <Route path="/cart" element={<Cart/>}></Route>
      </Routes>
    </Router>
  );
}

export default App;