import { useState } from 'react';
import style from './SearchBar.module.css'
import {useDispatch} from "react-redux";
import { searchRecipesByName } from '../../redux/actions/actions';

const SearchBar = () =>{
    const dispatch = useDispatch()
    const [searchName, setSearchName] = useState('')

    const handleOnChange=(event) =>{
        setSearchName(event.target.value)
    }
    const handleOnClick = (event) => {
        dispatch(searchRecipesByName(searchName))
        setSearchName('')//limpia el input
    }

    return(
        <div className={style.container}>
            <input
            value={searchName}
            onChange={event=>handleOnChange(event)}
            type="search"
            placeholder="Search"
        />
        <button type='submit' onClick={event=>handleOnClick(event)} >Search</button>
        </div>
    )
}
export default SearchBar