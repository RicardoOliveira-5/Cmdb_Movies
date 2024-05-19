export default {
    INVALID_TOKEN: () => {
        return {
            code: 0,
            message: `Invalid authentication token`
        }

    }, 
    INVALID_PARAMETER: argName => {
        return {
            code: 1,
            message: `Invalid argument: ${argName}`
        }
    },
    USER_NOT_FOUND: () => {
        return {
            code: 2,
            message: `User not found`
        }
    },
    GROUP_NOT_FOUND: (groupId) => {
        return {
            code: 3,
            message: `Group with id ${groupId} not found`
        }
    },
    EXISTING_MOVIE: () => {
        return {
            code: 4, 
            message: `The movie you are trying to add already exists in this group`
        }

    }, 
    MOVIE_NOT_FOUND: (movieId) => {
        return{ 
            code: 5, 
            message: `Movie with id ${movieId} not found`
        }
    }, 
    EXISTING_USERNAME: (userName) => {
        return{
            code: 6, 
            message: `User with name '${userName}' already exists!`
        }
    }, 
    EXISTING_USEREMAIL: (userEmail) => {
        return{
            code: 7, 
            message: `User with email '${userEmail}'already exists!`
        }
    }
    

}