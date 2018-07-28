const express = require('express');
const actDb = require('../helpers/actionModel');

const router = express.Router();

//All routes in actionRoutes default to /api/actions
router.get('/', async (req, res, next) => {
    try {
        const actions = await actDb.get();
        res.status(200).send(actions);
    } catch (error) {
        next({ code: 500, message: error.message })
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const actions = await actDb.get(id);
        if (!actions) { throw new Error("Invalid Id") }
        res.status(200).send(actions)
    } catch (error) {
        next({ code: 501, message: error.message })
    }
})
router.post('/', async (req, res, next) => {
    const action = req.body;
    try {
        if (!action.project_id || !action.description || !action.notes) { throw new Error("Please fill out project_id, description, and notes") }
        await actDb.insert(action);
        res.status(200).send(action);
    } catch (error) {
        next({ code: 501, message: error.message })
    }
})

router.put('/:id', async (req, res, next) => {
    const id = req.params.id;
    const action = req.body;
    try {
        if (!action.project_id || !action.description || !action.notes) { throw new Error("Please fill out project_id, description, and notes") };
        const update = await actDb.update(id, action);
        if (update === null) { throw new Error('Id not found') }
        res.status(200).send(update)
    } catch (error) {
        next({ code: 501, message: error.message })
    }
})

router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        const removal = await actDb.remove(id);
        if (removal === 0) { throw new Error("Id not found in action database") }
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