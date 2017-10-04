const express = require('express')
const router = express.Router()

const chatbot = require('../controllers/chatbot')

router.post('/:id',chatbot.question)

module.exports = router;