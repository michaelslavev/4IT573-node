import { WebSocketServer } from 'ws';
import {getAllTodos, getTodoById} from './dbKnex.js';
import ejs from 'ejs';

const connections = new Set();

export const createWebSocketServer = (server) => {
    const wss = new WebSocketServer({ server });

    wss.on('connection', (ws) => {
        connections.add(ws);

        ws.send('{"AYO": 69}');

        console.log('Number of new connections', connections.size);

        ws.on('close', () => {
            connections.delete(ws);
        });
    });
};

export const sendTodoListToAllConnections = async () => {
    const todoList = await ejs.renderFile('views/_todos.ejs', {
        todos: await getAllTodos(),
    });

    for (const connection of connections) {
        connection.send(JSON.stringify({ type: 'todoList', html: todoList }));
    }
};

export const sendTodoDetailToAllConnections = async (id) => {
    const todoDetail = await ejs.renderFile('views/_todo.ejs', {
        todo: await getTodoById(id),
    });

    for (const connection of connections) {
        connection.send(JSON.stringify({ type: 'todoDetail_'+id, html: todoDetail}));
    }
};

export const sendTodoDeletedToConnection = async (id) => {
    const todoDetail = await ejs.renderFile('views/_todoDeleted.ejs', {
        todo: await getTodoById(id),
    });

    for (const connection of connections) {
        connection.send(JSON.stringify({ type: 'todoDeleted_'+id, html: todoDetail}));
    }
};