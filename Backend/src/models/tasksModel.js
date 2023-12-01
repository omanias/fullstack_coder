import mongoose from 'mongoose';

const tasksSchema = new mongoose.Schema({
    tasks: { type: String, required: true },
});

const Tasks = mongoose.model('Tasks', tasksSchema);

export default Tasks
