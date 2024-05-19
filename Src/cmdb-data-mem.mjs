// access to cmdb data (groups and users), in this version stored in memory .
//Tudo o que implica acesso ao exterior tem de ter uma implementação assincrona 

import crypto from 'crypto'

let userId = 0
let maxId = 0
let movieId = 0
  
let users = []
let groups = []
 

export async function createGroup(userId, groupToCreate) {        
    let newGroup = {
        id: getNewId(), 
        title: groupToCreate.title,
        description: groupToCreate.description,
        movies: [], 
        userId: userId
    }
    groups.push(newGroup)
    return newGroup
}

export async function updateGroup(group, update) {
    group.title = update.title
    group.description = update.description
    return group
}

export async function getGroups(userId) {
    return groups.filter(group => group.userId == userId)
}

export async function deleteGroup(groupTodelete) {
    let groupIdx = groups.findIndex(group =>  group == groupTodelete)
    groups.splice(groupIdx, 1)
    return groupTodelete
}

export async function getGroup(userId, groupId) {
    return groups.find(group => group.id == groupId && group.userId == userId)   
}

export async function addMovie(newMovie, group){
    group.movies.push(newMovie)
    return newMovie 
}

export async function deleteMovie(group, movieIdx){
    const movie = group.movies[movieIdx]
    group.movies.splice(movieIdx, 1)
    return movie
}
//-------------------------------------------------------------
export async function createUSer(userName, userEmail){
    const userId = newUserId()
    let newUser = {
        id: userId,
        name: userName,
        email: userEmail,
        token: generateToken()
    }
    users.push(newUser)
    return newUser
}

export async function getUsers(){
    return users
}

export async function getUser(userToken) {
    return users.find(user => user.token == userToken)
}
//---------------- Auxiliar functions ---------------------------
function getNewId() {
    return maxId++
}


function generateToken(){
    return crypto.randomUUID()
}

function newUserId() {
    return userId++
}

