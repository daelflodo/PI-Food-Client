import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import validation from '../Validation/Validation'
import style from '../NewRecipe/NewRecipe.module.css'
import { getAllDiet } from "../../redux/actions/actions";
import axios from 'axios'

const Modify = () => {
    const dispatch = useDispatch();
    let listDiets = useSelector((state) => state.diets);
    // console.log('lista ', listDiets);
    const [errors, setErrors] = useState({})
    const [form, setForm] = useState({
        id: "",
        name: "",
        summary: "",
        healthScore: "",
        healthScoreModify:"",
        steps: "",
        diets: [],
        image: "",
    });

    useEffect(() => {
        dispatch(getAllDiet());
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
    //selecciona lso tipos de diet
    // Elimina los tipos de Diet
    const handleDelete = (diet) => {
        setForm({
            ...form,
            diets: form.diets.filter((element) => element !== diet),
        });
    }
    const handleSubmit = (event) => {

        if (form.id === '' || errors.id || errors.healthScoreModify) {
            event.preventDefault()
            alert('missing data')
        }
        else {
            axios.put("https://pi-food-server-f3pg.onrender.com/recipes/",form) //hago un post a la ur pasandole el body recipe(que son los values del formulario)
            .then(response=>alert(response.data))//cuando se resuelva la promesa hago un alert de la respuesta
            .catch(error => alert(error.response.data))
        }
    }

    return (
        <div className={style.container}>
            <h1>Modify Recipe</h1>
            <form onSubmit={handleSubmit} >
                {!form.id && <label style={{ color: "red" }} htmlFor="id">id</label>}
                <input
                    name="id"
                    type="text"
                    value={form.id}
                    onChange={handleChange}
                />
                {errors.id && <p style={{ color: "red" }}>{errors.id}</p>}

                {!form.name && <label style={{ color: "red" }} htmlFor="name">Name</label>}
                <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                />

                {!form.summary && <label style={{ color: "red" }} htmlFor="summary">Summary</label>}
                <input
                    name="summary"
                    type="text"
                    value={form.summary}
                    onChange={handleChange}
                />

                {!form.healthScore && <label style={{ color: "red" }} htmlFor="healthScore">Health Score</label>}
                <input
                    name="healthScore"
                    type="text"
                    value={form.healthScore}
                    onChange={handleChange}
                />
                 {errors.healthScoreModify && <p style={{ color: "red" }}>{errors.healthScoreModify}</p>}


                {!form.steps && <label style={{ color: "red" }} htmlFor="steps">Steps</label>}
                <input
                    name="steps"
                    type="text"
                    value={form.steps}
                    onChange={handleChange}
                // onChange={handleSteps}
                />
                {/* <button onClick={handleadd}>add</button> */}
                <br />

                {!form.image && <label style={{ color: "red" }} htmlFor="image" >Url image</label>}
                <input
                    name="image"
                    type="text"
                    value={form.image}
                    onChange={handleChange}
                />

                {/* hago un mapeo para agregar la dieta */}

                <select className={style.diets} name="diets" onChange={handleChange}>
                    <option disabled selected>Select a diet</option>
                    {listDiets?.map((element, index) => (
                        <option key={index} value={element?.name}>
                            {element?.name}
                        </option>
                    ))}
                </select>
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

                <button name="add">Modify</button>
            </form>
        </div>
    )
}
export default Modify
