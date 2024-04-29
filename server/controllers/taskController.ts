import { Request, Response } from 'express';
import Task from '../models/Task';
import FileHelper from '../utils/fileHelper';
import fs from 'fs';
import path from 'path';
import { TaskWithFiles } from '../types/type';

export const getTasks = async (req: Request, res: Response) => {
  try {
    let { text, priority, status } = req.query;

    const filters: any = {};
    if (text) {
      text = typeof text === 'string' ? text : (Array.isArray(text) ? text[0] : '');
      filters.text = new RegExp(text as string, 'i');
    }
    if (priority) filters.priority = priority;
    if (status) filters.status = status;

    const tasks = await Task.find(filters);

    const tasksWithFiles: TaskWithFiles[] = await Promise.all(tasks.map(async (task) => {
      const taskWithFiles: TaskWithFiles = task.toObject(); 

      if (task.file) {
        const filePath = path.join(__dirname, '..', 'folders', task.file);
        const fileData = fs.readFileSync(filePath);
        taskWithFiles.fileData = fileData; 
      }
      if (task.thumbnail) {
        const thumbnailPath = path.join(__dirname, '..', 'folders', task.thumbnail);
        const thumbnailData = fs.readFileSync(thumbnailPath);
        taskWithFiles.thumbnailData = thumbnailData; // Attach thumbnail data to task object
      }
      return taskWithFiles;
    }));

    res.json(tasksWithFiles);
  } catch (error) {
    console.error('Error fetching tasks', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createTask = async (req: Request, res: Response) => {
  // @ts-ignore
  const { text, status, priority } = req.fields;
  // @ts-ignore
  const { thumbnail, file } = req.files;

  try {
    let fileName;
    let thumbnailName;

    
    if (file) {
      fileName = `${Date.now()}_${file.name}`;
      const filePath = path.join(__dirname, '..', 'folders', fileName);
      fs.renameSync(file.path, filePath);
    }

    if (thumbnail) {
      thumbnailName = `${Date.now()}_${thumbnail.name}`;
      const thumbnailPath = path.join(__dirname, '..', 'folders', thumbnailName);
      fs.renameSync(thumbnail.path, thumbnailPath);
    }

    const newTask = new Task({
      text,
      status,
      priority,
      file: fileName,
      thumbnail: thumbnailName,
      userId: res.locals.userId
    });

    await newTask.save();
    res.status(201).json(newTask);

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateTask = async (req: Request, res: Response) => {
  const { text, status, priority, id } = req.body;

  console.log(id, text, status, priority);
  

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, { text, status, priority }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteTask = async (req: Request, res: Response) => {
  const taskId = req.params.id;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
