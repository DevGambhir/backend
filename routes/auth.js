const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_secret = "This is bunty speaking";

router.post('/createuser',[
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 3 })],
    async (req,res)=>{
    
        // If there are errors return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // check whether the user with the email exists already
        try{
    
            let user = await User.findOne({email: req.body.email});
            if(user){
                return res.status(400).json({error1: "Sorry a user with this email already exists"})
            }
    
            secPass = req.body.password;
            const salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(secPass, salt);
    
            // create a new user
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
              })
    
              const data = {
                user:{
                    id: user.id
                }
              }
    
              var authtoken = jwt.sign(data, JWT_secret);
              let success = true;
              
              res.json({success,authtoken: authtoken})
    
            //   res.json({user})
            //   .then(user => res.json(user)) 
            //   .catch((err)=>{
            //     console.log(err);
            //   res.json({error: "Please enter a unique values", message: err.message})})
        }
        catch(error){
    
            // catching the errors
            console.error(error.message);
            res.status(500).send("Some error occured");
        }
    
        
    })

    // login into the user details

    router.post('/login',[
        body('email').isEmail(),
        body('password','Password cannot be blank').exists()],
        // body('password').isLength({ min: 3 })],
        async (req,res)=>{
    
        // If there are errors return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const {email,password} = req.body;
        try {
            let user = await User.findOne({email});
            
            if(!user){
                let success = false;
                return res.status(400).json({success, error: "Please enter correct credentials"});
            }
    
            const passwordcomapare = await bcrypt.compare(password, user.password);
            if(!passwordcomapare){
                let success = false;
                return res.status(400).json({success, error: "Please enter correct credentials"});
            }
    
            const data = {
                user:{
                    id: user.id
                }
              }
    
              var authtoken = jwt.sign(data, JWT_secret);
              let success = true;
              res.json({success, authtoken: authtoken});
    
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Internal Server error: Some error occured");
            
        }
    
            
        
    })


// Route to get the user detail
router.post('/getuser',fetchuser,async (req,res)=>{

    try{
        let userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server error: Some error occured");
    }

})


    module.exports = router;