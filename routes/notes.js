const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes')
const { body, validationResult } = require('express-validator');

//Getting all the users 

router.get('/fetchallnotes', fetchuser, async (req, res) => {

    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error: Some error occured");
    }
});

// Adding a new note using post method
router.post('/addnote', fetchuser, [
    body('title').isLength({ min: 2 }),
    

], async (req, res) => {

    try {
        const { title, pricetag, price, marketCap, change, image } = req.body;

        // If there are errors return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let name = await Notes.findOne({title: req.body.title,user: req.user.id});
            if(name){
                return res.status(400).json({error1: "Sorry a user with this cryptocurrency is already exists"})
            }

        const note = new Notes({
            title,
            pricetag,
            price,
            marketCap,
            change,
            image,
            user: req.user.id

        })
        const savedNote = await note.save()
        let success = true;

        res.json({success,data:savedNote})
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error: Some error occured");
    }

})

// updating a current node

router.put('/updatenote/:id', fetchuser, [
   
    

], async (req, res) => {
    try{
        const {pricetag} =  req.body;
       
    
        // Create a new object
    
        const newNote = {};
        
        if(pricetag || pricetag==0){newNote.pricetag=pricetag
        };
    
        // Find the note to be updated and update it
    
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
    
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        
    
        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true})
        res.json({note});
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error: Some error occured");
    }
})

// Deleting an existing note
router.delete('/deletenote/:id', fetchuser, [
    body('title').isLength({ min: 2 }),
    

], async (req, res) => {

    try{
        const {title,pricetag} =  req.body;
    
        // Find the note to be deleteded and delete it
    
        let note = await Notes.findById(req.params.id);
        if(!note){return res.status(404).send("Not found")}
    
        if(note.user.toString()!== req.user.id){
            return res.status(401).send("Not Allowed");
        }
        note = await Notes.findByIdAndDelete(req.params.id)
        res.json("Success note has been deleted");
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error: Some error occured");
    }

})

















module.exports = router;