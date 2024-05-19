//implementation of the HTTP routes that make up the REST API of the web application
//Tem as funções que tratam dos pedidos HTTP incluindo obter a informação e gerar uma resposta

import httpResponse from './cmdb-response-errors.mjs'
import * as cmdbServices from './cmdb-services.mjs'
import errors from './cmdb-errors.mjs'


export let createGroup = handleRequest(createGroupInternal)
export let updateGroup = handleRequest(updateGroupInternal)
export let getGroups = handleRequest(getGroupsInternal)
export let deleteGroup = handleRequest(deleteGroupInternal)
export let getGroup = handleRequest(getGroupInternal)
export let addMovie = handleRequest(addMovieInternal )
export let deleteMovie = handleRequest(deleteMovieInternal)

export async function getMostPopularMovies(req, rsp){
    try{
        let movies = await cmdbServices.getMostPopularMovies(req.query.q, req.query.skip, req.query.limit)
        rsp
            .status(201)
            .json({movies: movies})
        }catch(e){
            const response = httpResponse(e)
            rsp.status(response.status).json(response.body)
            console.log(e)
        }
}

export async function getMovieByName(req, rsp){
    try{
        let movies = await cmdbServices.getMovieByName(req.query.q, req.query.skip, req.query.limit, req.params.title)
        rsp.status(201).json({ movies: movies})
    }catch(e){
        const response = httpResponse(e)
        rsp.status(response.status).json(response.body)
        console.log(e)
    }
}
    

export async function createUser(req, rsp){
    try{
        let newUser = await cmdbServices.createUser(req.body)
    rsp
        .status(201)
        .json({
            status: `user with id ${newUser.id} created with success`, 
            newUser: newUser
        })

    } catch(e) {
            const response = httpResponse(e)
            rsp.status(response.status).json(response.body)
            console.log(e)
        }
}

async function createGroupInternal(req, rsp){
    let newGroup = await cmdbServices.createGroup(req.token, req.body)
    rsp
        .status(201)
        .json({
            status: `Group with id ${newGroup.id} created with success`,                
            newGroup: newGroup
            })
}

async function updateGroupInternal(req, rsp){
    const groupId = req.params.id
    let groupUpdated = await cmdbServices.updateGroup(req.token, groupId, req.body)
    rsp
        .status(200)
        .json({
            status: `Group with id ${groupId} updated with success`,
            groupUpdated: groupUpdated
            })
}

async function getGroupsInternal(req, rsp){
    let groups = await cmdbServices.getGroups(req.token)
    rsp.json(groups)  
}

async function deleteGroupInternal(req, rsp){
    let groupId = req.params.id
    let deletedGroup = await cmdbServices.deleteGroup(req.token, groupId)
    rsp
        .status(200)
        .json({
            status: `Group with id ${groupId} deleted with success`,
            deletedGroup: deletedGroup
        })
}

async function getGroupInternal(req, rsp){
    let groupId = req.params.id
    let group = await cmdbServices.getGroup(req.token, groupId)
    rsp.json(group)
}

async function addMovieInternal(req, rsp){
    let groupId = req.params.id
    let movieToAdd = await cmdbServices.addMovie(req.token, req.body, groupId)
    rsp
        .status(201)
        .json({
            status: `Movie added with success to group with id ${groupId}`,
            movieToAdd: movieToAdd
        })
}

async function deleteMovieInternal(req, rsp){
    const groupId = req.params.id
    const movieId = req.params.movieId
    let movieDeleted = await cmdbServices.deleteMovie(req.token, movieId, groupId)
    rsp
        .status(200)
        .json({
            status: `Movie with id ${movieId} deleted with success from group with id ${groupId}`,
            movieDeleted: movieDeleted
        })
}

function handleRequest(handler){
    return async function(req, rsp){
        try {
            const BEARER_STR = "Bearer "
            const tokenHeader = req.get("Authorization")
            if(!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
               throw errors.INVALID_TOKEN
            }
            req.token = tokenHeader.slice(7) 
            let body = await handler(req, rsp)
            rsp.json(body)
        } catch(e) {
            const response = httpResponse(e)
            rsp.status(response.status).json(response.body)
            console.log(e)
        }
        
    }
}