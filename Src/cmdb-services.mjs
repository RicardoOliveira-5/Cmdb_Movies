//implementation of the logic of each of the application's functionalities
//validação se os dados recebidos são válidos ou não
//Não tem nada que envolva manipulação de dados
import * as moviesData from './cmdb-movies-data.mjs'
import * as dataMem from './cmdb-data-mem.mjs' 
import errors from './cmdb-errors.mjs'

export async function getMostPopularMovies(q, skip = 0, limit = 250){
    limit = Number(limit)
    skip = Number(skip)
    if(isNaN(limit) || isNaN(skip)) {
        throw errors.INVALID_PARAMETER(`skip or limit`)
    }
    return moviesData.getMostPopularMovies(q, limit, skip)
}

export async function getMovieByName(q, skip = 0, limit = 250, movieTitle){
    if(!isAString(movieTitle) || movieTitle == undefined){
        throw errors.INVALID_PARAMETER('movieTitle')
    }
    limit = Number(limit)
    skip = Number(skip)
    if(isNaN(limit) || isNaN(skip)) {
        throw errors.INVALID_PARAMETER(`skip or limit`)
    }
    return moviesData.getMovieByName(q, limit, skip, movieTitle)
}

export async function createGroup(userToken, groupToCreate){
    const user = await userValidation(userToken)
    //Parameters validation
    if(!isAString(groupToCreate.title) || groupToCreate.title == undefined){
        throw errors.INVALID_PARAMETER('title')
    }
    if (groupToCreate.description == undefined){
        throw errors.INVALID_PARAMETER('description')
    }
    return dataMem.createGroup(user.id, groupToCreate)
}

export async function updateGroup(userToken, groupId, newGroup){
    const user = await userValidation(userToken)
    const group = await groupValidation(user.id, groupId)
    //Parameters validation
    if(!isAString(newGroup.title) || newGroup.title == undefined){
        throw errors.INVALID_PARAMETER('title')
    }
    if (newGroup.description == undefined){
        throw errors.INVALID_PARAMETER('description')
    }
    return dataMem.updateGroup(group, newGroup)
}

export async function getGroups(userToken){
    const user = await userValidation(userToken)
    return dataMem.getGroups(user.id)
}

export async function deleteGroup(userToken, groupId){
    const user = await userValidation(userToken)
    let groupTodelete = await groupValidation(user.id, groupId)
    return dataMem.deleteGroup(groupTodelete) 
}



export async function getGroup(userToken, groupId) {
    const user = await userValidation(userToken)
    let group = await dataMem.getGroup(user.id, groupId)
    if(group){
        return group 
    }
    throw errors.GROUP_NOT_FOUND(groupId) 
}

export async function addMovie(userToken, newMovieId, groupId){
    const user = await userValidation(userToken)
    //Group search
    let group = await groupValidation(user.id, groupId)
    let id = Number(newMovieId.MovieId)
    if (id == undefined || !isNaN(id)){
        throw errors.INVALID_PARAMETER('MovieId')
    }
    //validate that the movie to be added does not yet exist in this group
    let existingMovie =  group.movies.find(movie => movie.id == newMovieId.id)
    if(existingMovie != undefined){
        throw errors.EXISTING_MOVIE
    }

    let newMovie = moviesData.getMovie(newMovieId.movieId)
    return dataMem.addMovie(newMovie, group)
}

export async function deleteMovie(userToken, movieId, groupId){
    const user = await userValidation(userToken)
    //Group search
    let group = await groupValidation(user.id, groupId)
    //Movie search
    const movieIdx = group.movies.findIndex(movie => movie.id == movieId)
    if(movieIdx != -1){
        return dataMem.deleteMovie(group, movieIdx)
    }
    throw errors.MOVIE_NOT_FOUND(movieId)
}

export async function createUser(newUser){
    if( newUser.name == undefined || !isAString(newUser.name)){
        throw errors.INVALID_PARAMETER('User name')
    }
    if ( newUser.email == undefined || !isAString(newUser.email)){
        throw errors.INVALID_PARAMETER('User email')
    }
    let users = await dataMem.getUsers()
    if(users.find(user => user.name == newUser.name) != undefined){
        throw errors.EXISTING_USERNAME(newUser.name)
    }
    if(users.find(user => user.email == newUser.email) != undefined){
        throw errors.EXISTING_USEREMAIL(newUser.email)
    }
    
    return dataMem.createUSer(newUser.name, newUser.email)
}

export async function tokenValidation(tokenHeader){
    const BEARER_STR = "Bearer "
            
    if(!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
        throw errors.INVALID_TOKEN
    }
    return true
}


//----------------------- Auxiliary functions----------------------------
async function groupValidation(userId, groupId){
    let group = await dataMem.getGroup(userId, groupId)
    if(group) {
        return group
    }
    throw errors.GROUP_NOT_FOUND(groupId)
}

async function userValidation(userToken){
    const user = await dataMem.getUser(userToken)
    
    if(!user){
        throw errors.USER_NOT_FOUND
    }
    return user
}

function isAString(value) {
    return typeof value == 'string' && value != ""
}


