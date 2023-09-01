const express = require('express')
const app = express()
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

app.listen(3000, () => {
  console.log('server running on port 3000')
})
