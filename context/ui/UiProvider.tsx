
import { FC, ReactElement, useReducer } from 'react'
import { UiContext, uiReducer} from './'

//creamos la interfaz para las props del componente
interface Props {
    children: ReactElement | ReactElement[];
}

//creamos una interfaz para el tipado de las propiedades a compartir, lo
//usamos para tipar el estado inicial y en el ./uiReducers para tipar el state
//y el return 
export interface UiState {
    isMenuOpen: boolean;
}

//usamos la interfaz creada arriba para el estado inicial
const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiProvider: FC<Props> = ({ children }) => {
    //usamos el Hook useReducer de React como estado inicial ponemos el objeto creado arriba
    //Ui_INITIAL_STATE, como reducer usamos el reducer creado UiReducer
    const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

    //creamos el metodo que cambiara el estado llamando al uiReducer con el dispatch
    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }


    return (
        //usamos el componente de Contexto(create Context) UiContext
        //definimos el value que es lo que se compartira con el resto de componentes
        //el children lo compondran los componentes incluidos en este Provider
        <UiContext.Provider value={{
            ...state,

            //metodos
            toggleSideMenu,
        }}>
            { children}
        </UiContext.Provider>
    )
};