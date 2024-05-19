// file that constitutes the entry point to the server application
//faz setup do setor (registar diversas rotas), e iniciar o servidor para que fique à escuta no porto definido 

import  express  from 'express'
import * as api from './cmdb-web-api.mjs'
//Referência entre origens cruzadas; Cors permite pedidos de qualquer sítio
//Access-Control-Allow-Origin: *
import cors from 'cors'
import yaml from 'yamlJs'
import swaggerUi from 'swagger-ui-express'
import * as data from './cmdb-data-mem.mjs'


const swaggerDocument = yaml.load('../Docs/cmdb-api-spec.yaml')

const PORT = 1906

let app = express()

//Permitir que o servidor B aceite pedidos do servidor A
app.use(cors())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())

app.get('/movies', api.getMostPopularMovies)
app.get('/movies/:title', api.getMovieByName)

app.post('/groups', api.createGroup)
app.put('/groups/:id', api.updateGroup)
app.get('/groups', api.getGroups)
app.delete('/groups/:id', api.deleteGroup)
app.get('/groups/:id', api.getGroup)
app.post('/groups/:id', api.addMovie)
app.delete('/groups/:id/:movieId', api.deleteMovie)

app.post('/users', api.createUser)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log(data.groups)






