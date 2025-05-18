import { Router, Request, Response } from 'express'
import { calculatePartners } from './ballroomHandlers'

const ballroomRouter = Router()

// POST /calculate-partners
ballroomRouter.post('/calculate-partners', async (req: Request, res: Response) => {
    try {
        const result = calculatePartners(req.body)
        res.json({data: result})
    } catch (error) {
        res.status(500).json({error: 'Internal server error'})
    }
})

export default ballroomRouter;