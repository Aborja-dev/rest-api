/* eslint-disable eqeqeq */
const express = require('express')
const app = express()
const crypto = require('node:crypto')
const movies = require('./data/movies.json')
const { validateMovie } = require('./schema/movie')
app.use(express.json())
app.disable('x-powered-by')
/*
(req, res) => {
    res.status(200).json()
}
*/
app.get('/', (req, res) => {
  res.status(200).send('<h1>Mi REST API con Express</h1>')
})
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies = movies.filter(movie => {
      return movie.genre.some(g => g.toLowerCase().includes(genre.toLowerCase()))
    })
    res.status(200).json({ movies: filteredMovies })
  }
  res.status(200).json({ movies })
})
app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(m => {
    return m.id == id
  })
  if (!movie) {
    return res.status(404).end()
  }
  return res.status(200).json({ movie })
})
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body)
  if (result.error) {
    res.status(400).json({ error: result.error })
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(200).json({ movies })
})
app.use((req, res) => {
  res.status(404).send('<h1>404 page not found</h1>')
})
app.listen(3000, () => {
  console.log('server running on port 3000')
})
