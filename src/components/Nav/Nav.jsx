import { useLocation } from "react-router-dom"
import SearchBar from "../SearchBar/SearchBar"
import style from './Nav.module.css'
import logoFood from '../../img-food/logo.png'
import logoGitHub from '../../img-food/GitHub-Logo.png'
import { Link } from "react-router-dom"
const Nav = () => {
    const location = useLocation()

    return (
        <div className={style.container}>
            <nav >
                <Link to={'/'}><img src={logoFood} alt="food-logo" width="50px" height="50px" /></Link>
                {location.pathname!=='/home' && <Link to={'/home'}><button>Home</button></Link>}
                {location.pathname === '/home' && <SearchBar />}
                {/* <button  onClick={handleOnClick}>Reset</button> */}
                {location.pathname === '/home'&& <Link to={'/newRecipe'}><button>New Recipe</button></Link>} {/* este link te dirige a un nuevo componente para crear recetas*/}
                {location.pathname === '/home'&& <Link to={'/modify'}><button>Modify Recipe</button></Link>} {/* este link te dirige a un nuevo componente para crear recetas*/}
                <Link to={'https://github.com/daelflodo'}><img src={logoGitHub} alt="" width="75px" height="40px"  /></Link>
            </nav>
        </div>
    )
}
export default Nav