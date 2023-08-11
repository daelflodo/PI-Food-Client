import { React, useEffect } from "react";
import { getRecipeDetail } from "../../redux/actions/actions";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import styles from './Detail.module.css'
const Detail = () => {
    const dispatch = useDispatch();
    const { id } = useParams()
    useEffect(() => {
        dispatch(getRecipeDetail(id));
    }, [id]);

    const data = useSelector((state) => state.details);
    return (
        <div className={styles.enc}>
            <h2>{data?.name}</h2>
            <img className={styles.imgdetail} src={data?.image} alt="" />
            <h2 >health score: {data?.healthScore}</h2>
            <h3 className={styles.summary}>Summary</h3>
            <h3> {data?.summary.replace(/(<([^>]+)>)/gi, "")}</h3>
            <h3>Step by Step</h3>
            <div  className={styles.steps}>{ data?.steps }</div>
           <h3>Types of diets: </h3>
            <h3> {data?.diets}, </h3>
        </div>
    )
}
export default Detail