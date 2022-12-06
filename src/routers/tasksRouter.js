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
// Get tasks?completed = true
// Get tasks?limit = 10& skip = 0
// Get task?sortBy=createdAt:desc
router.get('/tasks', auth, async (req, res) => {
    try {

        const match = {}
        const sort = {}

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
        }
        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
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
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
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

        res.status(500).send()
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
            error: 'Invalid updates!' })
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
        res.status(400).send(e)
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
        res.status(500).send(e)
    }
})

module.exports = router;
