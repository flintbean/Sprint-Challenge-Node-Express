const express = require('express');
const projDb = require('../helpers/projectModel');

const router = express.Router();
//RETRIEVE LIST OF ACTIONS BY PROJECT WITH /api/projects/actions/:id

//All routes in projectRoutes default to /api/projects/
router.get('/', async (req, res, next) => {
    try {
        const projects = await projDb.get();
        res.status(200).json(projects)
    } catch (error) {
        next({ code: 500, message: error.message })
    }
})

router.get('/actions/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const actions = await projDb.getProjectActions(id)
        if (!actions) { throw new Error("No actions") };
        res.status(200).send(actions)
    } catch (error) {
        next({ code: 500, message: error.message })
    }
})
router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const project = await projDb.get(id);
        res.status(200).json(project);
    } catch (error) {
        next({ code: 500, message: error })
    }
})

router.post('/', async (req, res, next) => {
    const project = req.body;
    try {
        if (!project.name || !project.description) { throw new Error("Please enter name and description") }
        const request = await projDb.insert(project);
        res.status(200).json(request);
    } catch (error) {
        next({ code: 501, message: error.message })
    }
})

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const project = req.body;
    try {
        if (!project.name || !project.description) { throw new Error("Please enter name and description") }
        const request = projDb.update(id, project);
        if (request === null) { throw new Error("Id not found in database!") }
        else { res.status(200).json(request); }
    } catch (error) {
        next({ code: 501, message: error.message })
    }
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const removal = await projDb.remove(id);
        if (removal === 0) { throw new Error("Id was not found in project database") }
        res.status(200).send(`${removal} items deleted`)
    } catch (error) {
        next({ code: 502, message: error.message })
    }
})
router.use((err, req, res, next) => {
    switch (err.code) {
        case 500:
            res.status(500).send({
                success: false,
                data: undefined,
                title: err.message,
                description: 'Failed get',
                recovery: 'Please check database'
            })
            break;
        case 501:
            res.status(501).send({
                success: false,
                data: undefined,
                title: 'Bad database modification',
                description: err.message,
                recovery: 'Please check inputs'
            })
            break;
        case 502:
            res.status(502).send({
                success: false,
                data: undefined,
                title: 'Removed Failed',
                description: err.message,
                recovery: 'Please check inputs'
            })
            break;
        default:
            res.status(404).send({ message: 'Something bad happened' })
    }
})
module.exports = router;