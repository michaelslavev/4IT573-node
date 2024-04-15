import knex from 'knex';
import knexfile from '../knexfile.js';

export const db = knex(knexfile);

export const getAllTodos = async () =>
    await db('todos').select('*');

export const getTodoById = async (id) =>
    await db('todos').select('*').where('id', id).first();