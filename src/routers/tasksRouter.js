const express = require('express');
const router = new express.Router()
const Tasks = require("../models/tasksModel");
const auth = require('../middleware/auth')
router.post('/tasks', auth, async (req, res) => {
    //const tasks = new Tasks(req.body)
    const tasks = new Tasks({
        ...req.body,
        owner: req.user._id
    })
    try {

        await tasks.save()
        res.status(201).send(tasks)
    }
    catch (e) {
        res.status(400).send(e)

    }
})
// Get tasks?completed = true // filterin tasks
// Get tasks?limit=10&skip=0 // pagination 
// Get task?sortBy=createdAt:desc // sorting
router.get('/tasks', auth, async (req, res) => {
    try {

        const match = {}  // for filtering
        const sort = {} // for sorting // {createdAt:-1}
        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            console.log(parts); ["createdAt", "desc"]

            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
            console.log(sort[parts[0]]); // -1

        }
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
            console.log(match); // {completed: true}
        }
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort

            }

        }).execPopulate()
        res.status(200).send({"Tasks":req.user.tasks, count: req.user.tasks.length})
        
    } catch (e) {
        console.log("Error: ", e.message);
        res.status(500).send(e.message)
    }
})
router.get('/tasks/:id', auth, async (req, res) => {
    //const _id = req.params.id
    try {

        const task = await Tasks.findOne({ _id, owner: req.user._id })

        if (!task) {
            res.status(404).send()
        }


        res.send(task)
    }
    catch (e) {
        console.log("Error: ", e.message);

        res.status(500).send(e.message)
    }
})
router.patch('/tasks/:id', auth, async (req, res) => {
    //const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).json({
            success: false,
            error: 'Invalid updates!'
        })
    }
    try {

        const task = await Tasks.findOne({ _id: req.params.id, owner: req.user._id })
        //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true})

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.send(task)
    }
    catch (e) {
        console.log("Error: ", e.message);

        res.status(400).send(e.message)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {

    try {
        const task = await Tasks.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    }
    catch (e) {
        console.log("Error: ", e.message);

        res.status(500).send(e)
    }
})

module.exports = router;
