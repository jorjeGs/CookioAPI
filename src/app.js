//Apartir de node 16, no es necesario importar express desde el package.json usando el type: module, 
//-ya que node lo reconoce como un modulo, por lo que se puede importar directamente desde el codigo,
//-sin necesidad de usar el require, como se hacia antes.
//En el package.json, se debe agregar el type: module, para que node reconozca el archivo como un modulo.
import express from 'express';
import indexRoutes from './routes/index.routes.js';
import usersRoutes from './routes/users.routes.js';
import recipesRoutes from './routes/recipes.routes.js';
import commentsRoutes from './routes/comments.routes.js';
import authRoutes from './routes/auth.routes.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors());

app.use(indexRoutes)
app.use('/api',usersRoutes)
app.use('/api',recipesRoutes)
app.use('/api',commentsRoutes)
app.use('/api',authRoutes)


app.use((req, res, next) => {
    res.status(404).json({ message: 'endpoint not found' })
})

export default app;