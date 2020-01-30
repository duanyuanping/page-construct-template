// import { GET_LIST_TEST } from '../actions';

export function list(state = {}, action) {

    switch (action.actionType) {
        case 'GET_LIST_TEST':
            return { ...state, list: action.data.list }
        default:
            return state;
    }
}
