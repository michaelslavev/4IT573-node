import express from 'express'

const app = express()

let todos = [
    {
        id: 1,
        title: 'Zajít na pivo',
        done: true,
    },
    {
        id: 2,
        title: 'Vrátit se z hospody',
        done: false,
    },
]

app.set('view engine', 'ejs')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))

app.use((req, res, next) => {
    console.log('Incomming request', req.method, req.url)
    next()
})

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Todos',
        todos,
    })
})

app.get('/todo/:id', (req, res) => {
    const todo = todos.find((todo) => {
        return todo.id === Number(req.params.id)
    })

    if (!todo) {
        res.status(404).send('Todo not found')
        return
    }

    res.render('todo', {
        title: 'Todo Detail',
        todo,
    })
})

app.post('/update-todo/:id', (req, res) => {
    const todoId = Number(req.params.id);
    const updatedTitle = req.body.title;

    const todoIndex = todos.findIndex(todo => todo.id === todoId);
    if (todoIndex === -1) {
        res.status(404).send('Todo not found');
        return;
    }

    todos[todoIndex].title = updatedTitle;

    res.redirect('/');
});



app.post('/add-todo', (req, res) => {
    const todo = {
        id: todos.length + 1,
        title: req.body.title,
        done: false,
    }

    todos.push(todo)

    res.redirect('/')
})

app.get('/remove-todo/:id', (req, res) => {
    todos = todos.filter((todo) => {
        return todo.id !== Number(req.params.id)
    })

    res.redirect('/')
})

app.get('/toggle-todo/:id', (req, res) => {
    const todo = todos.find((todo) => {
        return todo.id === Number(req.params.id)
    })

    todo.done = !todo.done

    res.redirect('/')
})


app.use((req, res) => {
    res.status(404)
    res.send('404 - Page not found')
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.send('500 - Server error')
})

app.listen(3000, () => {
    console.log('Server listening on http://localhost:3000')
})
