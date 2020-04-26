export const initialState = null

export const reducer = (state, action) => {
    if (action.type === 'USER') {
        return action.payload
    }
    if (action.type === 'CLEAR') {
        return action.payload
    }
    if (action.type === 'UPDATE') {
        return {
            ...state,
            followers: action.payload.followers,
            following: action.payload.following
        }
    }
    if (action.type === 'UPDATE_PROFILE_PHOTO') {
        return {
            ...state,
            profilePhoto: action.payload
        }
    }
    if (action.type === 'UPDATE_BIO') {
        return {
            ...state,
            bio: action.payload
        }
    }
    return state
}