import './style/App.css';
import {Routes, Route,  BrowserRouter as Router} from 'react-router-dom'
import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={ <Home />}>
         
        </Route>
        <Route path="/register" element={ <Register />}>
          
        </Route>
        <Route path="/login" element={ <Login />}>
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
