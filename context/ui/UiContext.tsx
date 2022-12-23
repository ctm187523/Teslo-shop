
import { createContext} from 'react';


//creamos una interfaz para mostrar como luce el contexto
interface ContextProps {
   isMenuOpen: boolean;

   //metodos
   toggleSideMenu: () => void;
}


//creamos el contexto para crear el provider y poder pasar informacion entre componentes
//usamos la interfaz de arriba para mostrar que atributos maneja el contexto
//para refrescar ver video --> https://www.youtube.com/watch?v=UPCOJgLlr3w
export const UiContext = createContext({} as ContextProps );