const express = require('express');
const router = express.Router();

const {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote
} = require('../controllers/notes-controller');

router.post('/pastes/', createNote);
router.get('/pastes/', getAllNotes);
router.get('/pastes/search/:id', getNoteById);
router.put('/pastes/:id', updateNote);
router.delete('/pastes/:id', deleteNote);
router.get('/pastes/searchtitle/:title', getNoteByTitle);
module.exports = router;