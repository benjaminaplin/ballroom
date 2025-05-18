import { Router, Request, Response } from 'express'
import { calculatePartners } from './ballroomHandlers'

const ballroomRouter = Router()

// GET hello world
ballroomRouter.get('/', async (_req: Request, res: Response) =>{
    try {
        const result = 'hello there, world'
        res.json({data: result})
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})


// POST /calculate-partners
ballroomRouter.post('/calculate-partners', async (req: Request, res: Response) => {
    try {
        const result = calculatePartners(req.body.data)
        res.json({data: result})
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})

export default ballroomRouter;