import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
    res.sendStatus(501)
})

router.get('/:roomId', async (req, res) => {
    res.sendStatus(501)
})

router.delete('/:roomId', async (req, res) => {
    res.sendStatus(501)
})

export default router;