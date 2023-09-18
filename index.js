//Apartir de node 16, no es necesario importar express desde el package.json usando el type: module, 
//-ya que node lo reconoce como un modulo, por lo que se puede importar directamente desde el codigo,
//-sin necesidad de usar el require, como se hacia antes.
//En el package.json, se debe agregar el type: module, para que node reconozca el archivo como un modulo.
import express from 'express';

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/users', (req, res) => res.send('gettin users'));
app.post('/users', (req, res) => res.send('creating users'));
app.put('/users', (req, res) => res.send('updating users'));
app.delete('/users', (req, res) => res.send('deleting users'));

app.listen(3000);
console.log('Server on port', 3000);