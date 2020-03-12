import server from './server'

const httpPort =  process.env.PORT || 6000;
server.listen(httpPort, () => console.log(require('fs').readFileSync('logo.txt', 'utf8').replace(':PORT', `:${httpPort}`)))