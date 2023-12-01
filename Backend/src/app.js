import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import Tasks from './models/tasksModel.js'
const app = express()
const PORT = 8080

app.use(express.json());
app.use(cors())


mongoose.connect("mongodb+srv://@cluster0.gclyzpb.mongodb.net/todoList?retryWrites=true&w=majority");

//Rutas de la API
app.get("/tasks", async (req, res) => {
    const tasks = await Tasks.find();
    res.json(tasks);
})

app.post("/tasks", async (req, res) => {
    const { tasks } = req.body;
    const newTasks = new Tasks({ tasks });
    const savedTasks = await newTasks.save();
    res.json(savedTasks);
})

app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params
    const { tasks } = req.body;
    const updatedTasks = await Tasks.findByIdAndUpdate(
        id,
        { tasks }
    );
    res.json({ message: `Task ${id} updated` });
})

app.delete("/tasks/:id", async (req, res) => {
    const { id } = req.params
    await Tasks.findByIdAndDelete(id);
    res.json({ message: `Task ${id} deleted` });
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})