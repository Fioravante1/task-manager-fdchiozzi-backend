const Model = require('../models/tasksModel');

const findById = async (id) => {
  const card = await Model.findById(id);
  if (!card) {
    return null;
  }
  return card;
};

const getAll = async () => {
  const tasks = await Model.getAll();
  return tasks;
};

const create = async (tasks) => {
  const newTasks = await Model.create(tasks);
  return newTasks;
};

module.exports = {
  getAll,
  create,
};
