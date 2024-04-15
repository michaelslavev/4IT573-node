import express from 'express'
import { db, getAllTodos, getTodoById } from './src/dbKnex.js';
import {
  createWebSocketServer,
  sendTodoDeletedToConnection,
  sendTodoDetailToAllConnections,
  sendTodoListToAllConnections
} from "./src/wsServer.js";

const PORT = 3000;
const app = express();

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('Incomming request', req.method, req.url)
  next()
})

app.get('/', async (req, res) => {
  const todos = await getAllTodos();

  res.render('index', {
    title: 'Todos',
    todos,
  })
})

app.get('/todo/:id', async (req, res, next) => {
  const reqId = Number(req.params.id);
  const todo = await getTodoById(reqId);

  if (!todo) return next()

  res.render('todo', {
    todo,
  })
})

app.post('/add-todo', async (req, res) => {
  const todo = {
    title: req.body.title,
    done: false,
    priority: "normal",
  }

  await db('todos').insert(todo)

  sendTodoListToAllConnections().catch((err) => console.error(err));

  res.redirect('/')
})

app.post('/update-todo/:id', async (req, res, next) => {
  const reqId = Number(req.params.id);
  const todo = await getTodoById(reqId);

  if (!todo) return next()

  await db('todos').update({ title: req.body.title }).where('id', todo.id)

  sendTodoListToAllConnections().catch((err) => console.error(err));
  sendTodoDetailToAllConnections(reqId).catch((err) => console.error(err));

  res.redirect('back')
})

app.get('/remove-todo/:id', async (req, res) => {
  const reqId = Number(req.params.id);
  const todo = await getTodoById(reqId);

  if (!todo) return next()

  await db('todos').delete().where('id', todo.id)

  sendTodoListToAllConnections().catch((err) => console.error(err));
  sendTodoDeletedToConnection(reqId).catch((err) => console.error(err));

  res.redirect('/')
})

app.get('/toggle-todo/:id', async (req, res, next) => {
  const reqId = Number(req.params.id);
  const todo = await getTodoById(reqId);

  if (!todo) return next()

  await db('todos').update({ done: !todo.done }).where('id', todo.id)

  sendTodoListToAllConnections().catch((err) => console.error(err));
  sendTodoDetailToAllConnections(reqId).catch((err) => console.error(err));

  res.redirect('back')
})

app.post('/update-priority/:id', async (req, res) => {
  const reqId = Number(req.params.id);
  const todo = await getTodoById(reqId);

  if (!todo) return next();

  await db('todos')
      .update({ priority: req.body.priority })
      .where('id', todo.id);

  sendTodoListToAllConnections().catch((err) => console.error(err));
  sendTodoDetailToAllConnections(reqId).catch((err) => console.error(err));

  res.redirect('back');
});

app.use((req, res) => {
  res.status(404)
  res.send('404 - Stránka nenalezena')
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500)
  res.send('500 - Chyba na straně serveru')
})


const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

createWebSocketServer(server);
