const express = require('express');
const rescue = require('express-rescue');
const { StatusCodes } = require('http-status-codes');
const Error = require('../helpers/errors');

const Service = require('../services/tasksService');

const tasksRouter = express.Router();
const validateTasks = require('../middlewares/tasksMiddlewares');

tasksRouter.get('/', rescue(async (req, res) => {
  const tasksAll = await Service.getAll();
  return res.status(StatusCodes.OK).json(tasksAll);
}));

tasksRouter.get('/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const task = await Service.findById(id);
  if (task.isError) {
    return res.status(task.code).json({ message: task.message });
  }
  return res.status(StatusCodes.OK).json(task);
}));

tasksRouter.post('/',
  validateTasks,
  rescue(async (req, res) => {
    const date = new Date();
    const { tasks, description, taskStatus } = req.body;
    const task = await Service.create({
      tasks,
      description,
      taskStatus,
      date: `${date.getDay()}/${date.getMonth()}/${date.getFullYear()}`,
    });
    return res.status(StatusCodes.CREATED).json({ task });
  }));

tasksRouter.put('/:id',
  validateTasks,
  rescue(async (req, res) => {
    const { code, message } = Error.notFound('Tarefa não encontrada');
    const { id } = req.params;
    const task = await Service.update(id, req.body);
    if (!task) {
      return res.status(code).json({ message });
    }
    return res.status(StatusCodes.OK).json(task);
  }));

tasksRouter.delete('/:id', rescue(async (req, res) => {
  const { id } = req.params;
  const task = await Service.deleteTask(id);
  return res.status(StatusCodes.NO_CONTENT).json(task);
}));

module.exports = tasksRouter;
