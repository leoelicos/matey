const router = require('express').Router()
import apiRoutes from './api'

router.use('/api', apiRoutes)

router.use((req, res) => res.send('Wrong route!'))

export default router
