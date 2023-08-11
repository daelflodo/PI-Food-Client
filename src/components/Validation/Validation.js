

const validation = (form) => {
    const errors = {}
    if (!form.name) {
        errors.name = 'Ingrese un titulo!'
    }
    if (!form.summary) {
        errors.summary = 'El resumen esta vacio'
    }
    if (/[^0-9]/.test(form.healthScore)) {
        errors.healthScore = 'No se permiten caracteres ingrese un numero'
        errors.healthScoreModify = 'No se permiten caracteres ingrese un numero'
    }
    if (form.healthScore < 0 || form.healthScore > 100) {
        errors.healthScore = 'ingrese un valor entre 0 y 100'
        errors.healthScoreModify = 'ingrese un valor entre 0 y 100'

    }
    if (!form.healthScore) {
        errors.healthScore = 'El puntaje de salud esta vacio'
    }
    if (!form.steps) {
        errors.steps = 'Introduza los pasos de preparacion'
    }
    if (!form.image) {
        errors.image = 'Introduzca una url para la imagen'
    }
    if (!form.diets.length) {
        errors.diets = 'Introduzca al menos una dieta'
    }
    // if(!form.id){
    //     errors.id = 'Debe introducir el id de la receta a modificar '
    // }
    // if(listDiets.includes(form.diets)){ // trampita
    //     errors.diets = 'La dieta no existe '
    // }
    return errors;
}
export default validation