
import { UiState } from './' //importamos la interfaz creada en UiProvider

type UiActionType =
    | { type: '[UI] - ToggleMenu' }


export const uiReducer = (state: UiState, action: UiActionType): UiState => {

    switch (action.type) {
        case '[UI] - ToggleMenu':
            return {
                ...state,
                isMenuOpen: !state.isMenuOpen //cambiamos el valor booleano
            }


        default:
            return state;
    }
}