//access to the Internet Movies Database API.

import { readFile, writeFile } from 'node:fs/promises'
import  fetch  from 'node-fetch'




const urlTop250Movies = "https://imdb-api.com/en/API/Top250Movies/k_vfhddy3v"
const urlMovieName = "https://imdb-api.com/en/API/SearchMovie/k_vfhddy3v/"
const urlMoviebyId = "https://imdb-api.com/en/API/Title/k_vfhddy3v/"

const out_file_name = 'storage.json'

let output = {
    "totalDuration" : 0,
    "movies" : []
}

export async function getMovie(movieId){
    let getmovie = await makeRequest(String(urlMoviebyId + movieId))
    let movieToadd = {
        id: movieId,
        title: getmovie.title, 
        description: getmovie.description,
        totalDuration: getmovie.runtimeMins
    }
    output.movies.push(movieToadd)
    writefileAsync(output, out_file_name)
    return movieToadd
}

export async function getMovieByName(q, limit, skip, movieTitle){
    let moviesByName = await makeRequest(String(urlMovieName + movieTitle))
    const predicate = q ? m => m.title.includes(q) : m => true
    let retMovies = moviesByName['results'].filter(predicate)
    const end = limit != 250 ? (skip+limit) : retMovies.length
    let moviesFinal = retMovies.slice(skip,  end)
    return processResultsbyName(moviesFinal) 
}

export async function getMostPopularMovies(q, limit, skip) { 
    let topMostPopularMovies = await makeRequest(urlTop250Movies)
    const predicate = q ? m => m.title.includes(q) : m => true
    let retMovies = topMostPopularMovies['items'].filter(predicate)
    const end = limit != 250 ? (skip+limit) : retMovies.length
    let moviesFinal = retMovies.slice(skip,  end)
    return processResultsMostPopular(moviesFinal)  
}

async function makeRequest(url){
    let allM = await fetch(url)
    let obj = await allM.json() 
    return (obj)
}

function processResultsbyName(movies) {
    movies.forEach(element => {
         output.movies.push({
            "id": element.id,
            "title": element.title,
            "description" : element.description
        })
    })
    writefileAsync(output, out_file_name)
    return output.movies
}

function processResultsMostPopular(movies) {
    
    
    movies.forEach(element => {
         output.movies.push({
            "id": element.id,
            "title": element.title,
        })
    })
    writefileAsync(output, out_file_name)
    return output.movies
}

function writefileAsync(obj, OUT_FILE_NAME) {
    console.log("Write file")
    // Write to the output file
    
    writeFile(OUT_FILE_NAME, JSON.stringify(obj, null, " "))
    console.log(`Odd ids escritos com sucesso em: ${OUT_FILE_NAME}`)
    
}