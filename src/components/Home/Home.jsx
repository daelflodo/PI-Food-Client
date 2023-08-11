import style from './Home.module.css'
import Recipe from "../Recipe/Recipe"
import { useDispatch, useSelector } from 'react-redux';
import { useState } from "react";
import { OrderName, filterCreated, filterRecipesDiet, orderRecipesScore } from '../../redux/actions/actions';

const Home = () => {
    const dispatch = useDispatch();
    const allRecipes = useSelector((state) => state.recipes);
    const allDiets = useSelector((state) => state.diets)
    console.log('todas las recetas ', allRecipes);
    const [currentPag, setCurrentPag] = useState(1);
    const [recipesByPag] = useState(9);
    const indexLastRecipe = currentPag * recipesByPag;
    const indexFirstRecipe = indexLastRecipe - recipesByPag;
    const currentRecipes = allRecipes.slice(indexFirstRecipe, indexLastRecipe);

    const pageNumbers = []//almacenar los números de página
    const handlePaginated = (pageNumber) => {
        setCurrentPag(pageNumber);
    };
    const totalPages = Math.ceil(allRecipes.length / recipesByPag)
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    const handleOrderScore = (event) => {
        dispatch(orderRecipesScore(event.target.value))
    }
    const handleOrderName = (event) => {
        dispatch(OrderName(event.target.value))
    }
    const handleFilterDiet = (event) => {
        dispatch(filterRecipesDiet(event.target.value))
        setCurrentPag(1)
    }
    const handleFilterCreated = (event) => {
        dispatch(filterCreated(event.target.value))
    }
    const handleNext = () => {
        if (currentPag < totalPages) {
            setCurrentPag(currentPag + 1)
        }
    }
    const handlePrevious = () => {
        if (currentPag > 1) {
            setCurrentPag(currentPag - 1)
        }
    }
    //row
    return (
        <div className={style.container}>
            <div>
                <select className={style.filter} onChange={handleOrderName}>
                    <option disabled selected>Order by Title</option>
                    <option value="A-Z">(A-Z)</option>
                    <option value="Z-A">(Z-A)</option>
                </select>

                <select className={style.filter} onChange={handleOrderScore}>
                    <option disabled selected>Order by Score</option>
                    <option value="Ascendente">Ascendente</option>
                    <option value="Descendente">Descendente</option>
                </select>

                <select className={style.filter} onChange={handleFilterDiet}>
                    <option disabled selected>Filter by Diet</option>
                    <option value="allDiets">All Diets</option>
                    {
                        allDiets?.map((diet, index) => {
                            return <option value={diet.name} key={index}> {diet.name}</option>
                        }

                        )
                    }
                </select>

                <select className={style.filter} onChange={handleFilterCreated}>
                    <option disabled selected>Filter by Created</option>
                    <option value="allRecipes">All</option>
                    <option value="api">Recipe Api</option>
                    <option value="db">Recipe Created</option>
                </select>
            </div>

            <div className={style.contbutton}>
                <button onClick={handleNext}>Next</button>
                {pageNumbers.map((pag) => {
                    return (<button
                        className={currentPag === pag ? "container current" : "container"}
                        key={pag}
                        onClick={() => handlePaginated(pag)}>
                        {pag}
                    </button>)

                })
                }
                <button onClick={handlePrevious}>Previous</button>
            </div>

            <div className={style.row}>
                {currentRecipes.map((recipe, index) => (
                    <Recipe
                        key={index}
                        id={recipe.id}
                        name={recipe.name}
                        image={recipe.image}
                        diets={recipe.diets}
                        healthScore={recipe.healthScore}
                    />
                ))}
            </div>

            {/* <div>
                {pageNumbers.map((pag) => {
                    return (<button
                        className={currentPag === pag ? "container current" : "container"}
                        key={pag}
                        onClick={() => handlePaginated(pag)}>
                        {pag}
                    </button>)
                })}
            </div> */}
        </div>
    );
};

export default Home;
