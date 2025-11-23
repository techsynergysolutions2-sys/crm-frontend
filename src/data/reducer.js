
export const initialState = {
    user: null,
};

const reducer = (state, action) => {
    switch(action.type){
        case 'USER':
            return {
                ...state, 
                user: action.item
            };
        default:
            return state;
    }
}

export default reducer;