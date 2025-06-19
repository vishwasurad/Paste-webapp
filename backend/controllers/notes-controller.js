const Notes =  require("../models/notes-model")

const createNote = async (req, res) => {
    try {
        console.log(req.body)
        console.log("createNote");
        console.log("after")

//         req.user={
//     "id": "685123fb6aff0064f7aee12f",
//     "email": "vishwa@gmail.com",
//     "role": "NORMAL"
//   }
        
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Title and content are required'
            });
        }
        
        const newNote = new Notes({
            title,
            content,
            createdBy: req.user.id,
        });

        await newNote.save();
        res.status(201).json({
            success: true,
            message: 'Note created successfully',
            note: newNote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating note',
            error: error.message
        });
    }
};

const getAllNotes = async (req, res) => {
    try {
          req.user={
    "id": "685123fb6aff0064f7aee12f",
    "email": "vishwa@gmail.com",
    "role": "NORMAL"
  }
        console.log("getAllNotes");
        
        console.log(req.user.id) // For testing purposes, remove this line in production
        const notes = await Notes.find({ createdBy: req.user.id })
            .sort({ createdAt: -1 });
      
        res.json({
            success: true,
            notes: notes
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notes',
            error: error.message
        });
    }
};

const getNoteById = async (req, res) => {
    try {
        const note = await Notes.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching note',
            error: error.message
        });
    }
};
const getNoteByTitle = async (req, res) => {
    try {
        const note = await Notes.findOne({
            title: req.params.title,
        });

        if (!note) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            note
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching note',
            error: error.message
        });
    }
};

const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const updatedNote = await Notes.findOneAndUpdate(
            { _id: req.params.id, createdBy: req.user.id },
            { title, content, updatedAt: new Date() },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            message: 'Note updated successfully',
            note: updatedNote
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating note',
            error: error.message
        });
    }
};

const deleteNote = async (req, res) => {
    try {
        const deletedNote = await Notes.findOneAndDelete({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!deletedNote) {
            return res.status(404).json({
                success: false,
                message: 'Note not found'
            });
        }

        res.json({
            success: true,
            message: 'Note deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting note',
            error: error.message
        });
    }
};

module.exports = {
    createNote,
    getAllNotes,
    getNoteById,
    updateNote,
    deleteNote,
    getNoteByTitle
};