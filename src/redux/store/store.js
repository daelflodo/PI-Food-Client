import { createStore, applyMiddleware,compose } from 'redux';
import ThunkMiddleware from 'redux-thunk';
import rootReducer from '../Reducer/reducer';

// esta línea es para conectar con la extensión del navegador
const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; 
const store = createStore(
    rootReducer,
    composeEnhancer(applyMiddleware(ThunkMiddleware)) // esta línea es para poder hacer peticiones a un server
);
export default store;