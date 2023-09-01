const z = require('zod')

const movieSchema = z.object({
  director: z.string(),
  duration: z.number().int().min(30).max(200),
  title: z.string(),
  poster: z.string().url().endsWith('jpg'),
  rate: z.number().positive().max(10),
  year: z.number().int().min(1800).max(2024),
  genre: z.array(
    z.enum(['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Sci-Fi', 'Romance'])
  )
})

const validateMovie = (input) => movieSchema.safeParse(input)

module.exports = {
  validateMovie
}
