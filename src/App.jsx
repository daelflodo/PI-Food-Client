import { Route, Routes, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllDiet, getAllRecipes } from './redux/actions/actions';
import Nav from './components/Nav/Nav';
import Home from './components/Home/Home';
import LandingPages from './components/LandingPages/LandingPages';
import Detail from './components/Detail/Detail';
import NewRecipe from './components/NewRecipe/NewRecipe';
import Modify from './components/NewRecipe/Modify';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    dispatch(getAllRecipes());
    dispatch(getAllDiet());
  }, [dispatch]);

  return (
    <div className="app">
      {location.pathname !== '/' && <Nav />}
      <Routes>
        <Route path="/" element={<LandingPages />} />
        <Route path="/home" element={<Home />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/newRecipe" element={<NewRecipe />} />
        <Route path="/modify" element={<Modify />} />
      </Routes>
    </div>
  );
}

export default App;
