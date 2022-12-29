
import { createContext} from 'react';
import { IUser } from '../../interfaces/user';


//creamos una interfaz para mostrar como luce el contexto
interface ContextProps {
   isLooggedIn: boolean;
   user?: IUser;

   //metodos
   loginUser: (email: string, password: string) => Promise<boolean>;
   registerUser: (name: string, email: string, password: string) => Promise<{ hashError: boolean; message?: string;}>
}


//creamos el contexto para crear el provider y poder pasar informacion entre componentes
//usamos la interfaz de arriba para mostrar que atributos maneja el contexto
//para refrescar ver video --> https://www.youtube.com/watch?v=UPCOJgLlr3w
export const AuthContext = createContext({} as ContextProps );