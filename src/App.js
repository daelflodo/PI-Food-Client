import './App.css';
import Home from './components/Home/Home';
import LandingPages from './components/LandingPages/LandingPages'
import {Route, Routes } from 'react-router-dom'
import Nav from './components/Nav/Nav'
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useEffect } from "react";
import { getAllDiet, getAllRecipes } from './redux/actions/actions';
import Detail from './components/Detail/Detail';
import NewRecipe from './components/NewRecipe/NewRecipe';
import Modify from './components/NewRecipe/Modify';


function App() {
  const dispatch = useDispatch();
  const location =useLocation()
  useEffect(() => {
    dispatch(getAllRecipes());
    dispatch(getAllDiet());
  }, []);


  return (
    <div className="App">
      {location.pathname !=='/' && <Nav/>}
     <Routes>
      <Route path='/' element = {<LandingPages/>}/>
      <Route path='/home' element ={<Home/>}/>
      <Route path='/detail/:id' element={<Detail />} />
      <Route path='/newRecipe' element={<NewRecipe />} />
      <Route path='/modify' element={<Modify />} />
      {/* <Route path=''/> */}
     </Routes>
    </div>
  );
}

export default App;
