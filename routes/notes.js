import { Router } from 'express';
const router = Router();
import fetchUser from '../middleware/fetchUser.js';
import Notes from '../models/Notes.js'
import {body, validationResult} from "express-validator";




// Route to get the notes of a user
router.get('/fetchNotes', fetchUser, async (req, res) => {
    
    try {

        const notes = await Notes.find({user: req.user.id});
        res.json(notes);

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server Error');
    }


});





// Route to add Notes by respective users
router.post('/addNotes', fetchUser, [
        body('title', 'Enter a valid title').isLength({ min: 3 }),
        body('description', 'Enter description of atleast 5 characters').isLength({ min: 5 })
    ],
    
    async (req, res) => {
        
        // Validation results error handling
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        try {
            
            const {title, description, tag} = req.body;
            
            const note = new Notes({
                user: req.user.id,
                title,
                description, 
                tag
            })

            const savedNote = await note.save();

            res.json(savedNote);

        } catch (error) {
            console.error(error.message);
            res.status(500).send('Internal Server Error');
        }
    }
);





// Endpoint to update the notes
router.put('/updateNotes/:id', fetchUser, async (req, res) => {
    
    try{
        // Destructuring the values from the request being sent
        const {title, description, tag} = req.body;

        const newNote = {};

        // Validating the values and appending to object being sent to DB
        if(title) {newNote.title = title};
        if(description) {newNote.description = description};
        if(tag) {newNote.tag = tag};

        // Finding the document to be updated from DB with a specified ID
        let note = await Notes.findById(req.params.id);

        // If note is not present with ID specified
        if(!note){
            return res.status(404).send('Not Found');
        }

        // If unauthorized access is being made
        if(note.user.toString() !== req.user.id){
            return res.status(401).send('Unauthorized Access');
        }

        // Updating the note in the DB and sending the saved note as response
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new: true});
        res.json(note);

    }
    catch(error){
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }
});




// Endpoint to update the notes
router.delete('/deleteNotes/:id', fetchUser, async (req, res) => {
    
    try{

        // Finding the document to be updated from DB with a specified ID
        let note = await Notes.findById(req.params.id);

        // If note is not present with ID specified
        if(!note){
            return res.status(404).send('Not Found');
        }

        // If unauthorized access is being made
        if(note.user.toString() !== req.user.id){
            return res.status(401).send('Unauthorized Access');
        }

        // Deleting the note in the DB and sending the response
        note = await Notes.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Note Deleted Successfully", note: note});

    }
    catch(error){
        console.error(error.message);
        res.status(500).json("Internal Server Error");
    }
});




export default router;
