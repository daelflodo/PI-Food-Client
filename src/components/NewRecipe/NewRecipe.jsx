import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import validation from '../Validation/Validation'
import style from '../NewRecipe/NewRecipe.module.css'
import { getAllDiet, getAllRecipes, postRecipes } from "../../redux/actions/actions";

const NewRecipe = () => {
    const dispatch = useDispatch();
    let listDiets = useSelector((state) => state.diets);
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({//1
        name: "",
        summary: "",
        healthScore: "",
        steps: "",
        diets: [],
        image: "",
    });

    useEffect(() => {
        dispatch(getAllDiet());
        dispatch(getAllRecipes());
    }, []);

    const handleChange = (event) => {
        if (event.target.name === 'diets') {
            setForm({// este solamente es para el estado de //2
                ...form,
                diets: [...form.diets, event.target.value] //usando bracket-notations pq no sabemos cual es el nombre de la 
                //propiedad
            })
            setErrors(validation({
                ...form,
                [event.target.name]: event.target.value
            }))
        } else {// aqui es para el resto de los estados
            setForm({
                ...form,
                [event.target.name]: event.target.value
            })
            setErrors(validation({
                ...form,
                [event.target.name]: event.target.value
            }))
        }

        //declaramos la funcion validation dentro del handleChange para q las validaciones sean en tiempo real o mejor dicho
        //cada ves que cambie el estado de los input
    }

    // Elimina los tipos de Diet
    const handleDelete = (diet) => {
        setForm({
            ...form,
            diets: form.diets.filter((element) => element !== diet),
        });
    }
    const handleSubmit = (event) => {

        if (form.name ==='' || Object.keys(errors).length !== 0) {
            event.preventDefault()
            alert('Missing data')
        }
        else{
            dispatch(postRecipes(form))
        }
    }


    return (
        <div className={style.container}>
            <h1>New Recipe</h1>
            <form onSubmit={handleSubmit} >
                { !form.name && <label style={{ color: "red" }} htmlFor="name">Name</label>}
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                />
                {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

                {!form.summary && <label style={{ color: "red" }} htmlFor="summary">Summary</label>}
                <input
                    name="summary"
                    type="text"
                    value={form.summary}
                    onChange={handleChange}
                />
                {errors.summary && <p style={{ color: "red" }}>{errors.summary}</p>}

                {!form.healthScore && <label style={{ color: "red" }} htmlFor="healthScore">Health Score</label>}
                <input
                    name="healthScore"
                    type="text"
                    value={form.healthScore}
                    onChange={handleChange}
                />
                {errors.healthScore && <p style={{ color: "red" }}>{errors.healthScore}</p>}

                {!form.steps && <label style={{ color: "red" }} htmlFor="steps">Steps</label>}
                <input
                    name="steps"
                    type="text"
                    value={form.steps}
                    onChange={handleChange}
                />
                {errors.steps && <p style={{ color: "red" }}>{errors.steps}</p>}
                <br />

                {!form.image && <label style={{color:"red"}} htmlFor="image" >Url image</label>}
                <input
                    name="image"
                    type="text"
                    value={form.image}
                    onChange={handleChange}
                />
                
                { errors.image && <p style={{ color: "red" }}>{errors.image}</p>}
                <select className={style.diets} name="diets" onChange={handleChange}>
                    <option disabled selected>Select a diet</option>
                    {listDiets?.map((element, index) => (
                        <option key={index} value={element?.name}>
                            {element?.name}
                        </option>
                    ))}
                </select>
                {errors.diets && <p style={{ color: "red" }}>{errors.diets}</p>}
                {/* hago un mapeo para borrar la dieta */}
                <div >
                    {form.diets?.map((diet, index) => (
                        <div key={index} >
                            <button
                                className={style.buttonDelete}
                                onClick={() => handleDelete(diet)}
                            > x </button>
                            <span className={style.spanDiets} key={index}>{diet}</span>
                        </div>
                    ))}

                </div>
                {/* </div> */}


                {/* ------------------------------------------- */}
                <br />
                <button>Create</button>
            </form>
        </div>
    )
}
export default NewRecipe