
import { Link } from "react-router-dom";
import styled from "./LandingPages.module.css"

const LandingPages = () => {
    return (
        <div className={styled.container}>

            <h1 className={styled.title}>PI - FOOD</h1>
            <p className={styled.info}>Welcome!</p>
            <Link to="/home">
                <button >Go Home</button>
            </Link>
            <p className={styled.credits}>By: David Flores</p>
        </div>
    )
}
export default LandingPages
