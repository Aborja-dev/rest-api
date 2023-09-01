/* eslint-disable eqeqeq */
const express = require('express')
const app = express()
const crypto = require('node:crypto')
const movies = require('./data/movies.json')
const { validateMovie, validatePartialMovie } = require('./schema/movie')
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
app.patch('/movies/:id', (req, res) => {
  const { id } = req.params
  const { title, duration, director, year } = req.body
  const result = validatePartialMovie({ title, duration, director, year })
  if (!result.success) {
    res.status(400).json({ error: result.error })
  }
  const movieIndex = movies.findIndex(m => m.id == id
  )
  if (movieIndex === -1) {
    return res.status(404).end()
  }
  const updated = {
    ...movies[movieIndex],
    ...result.data
  }
  movies[movieIndex] = updated
  res.status(200).json(movies)
})
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const elementIndex = movies.findIndex(element => element.id == id)
  // Si el elemento se encuentra, borrarlo.
  if (elementIndex !== -1) {
    movies.splice(elementIndex, 1)
    return res.status(200).json({ success: true, message: 'Element deleted successfully' })
  // Si no se encuentra el elemento, devolver un error 400
  } else {
    return res.status(400).json({ success: false, message: 'Element not found' })
  }
})
app.use((req, res) => {
  res.status(404).send('<h1>404 page not found</h1>')
})
app.listen(3000, () => {
  console.log('server running on port 3000')
})
