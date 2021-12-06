const http = require('http')
const fs = require('fs')
const path = require('path')

const hostname = '127.0.0.1'
const port = 3000

http.createServer((request, response) => {
  let filePath = '.' + request.url

  if (filePath === './') {
    filePath = './index.html'
  }

  const extname = String(path.extname(filePath)).toLowerCase()
  const mimeTypes = {
    '.html': 'text/html'
  }

  const contentType = mimeTypes[extname] || 'application/octet-stream'

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if(error.code === 'ENOENT') {
        fs.readFile('./404.html', (error, content) => {
          response.writeHead(404, { 'Content-Type': 'text/html'})
          response.end(content, 'utf-8')
        })
      } else {
        response.writeHeat(500)
        response.end(`Sorry, you broke it. Try turning it off and then back on again. Error ${error.code}`)
      }
    } else {
      response.writeHead(200, { 'Content-Type': contentType })
      response.end(content, 'utf-8')
    }
  })
}).listen(port, hostname)

console.log(`Server running at http://${hostname}:${port}`)
