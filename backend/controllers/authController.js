const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const query = require('../queries/dbQueries')
const { ValidateRegister } = require('../models/user');

const moment = require('moment');
const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

//________USer SignUp___________________________________________________
const register = async (req, res) => 
{
    try 
    {
        const { email, password, name } = req.body;
        const validationError = ValidateRegister(email, password, name);
        console.log(validationError);

        if(validationError !== null) 
        {
            return res.status(400).json({ error: validationError });
        }
        else
        {
            const ifuser = await query.FINDONE('users','email',email);
            if(ifuser.length>0)
            {
                return res.status(403).json({ error: 'this email is already registered' });
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = query.INSERT('users', name, email, hashedPassword, currentDate);
    
            if(result) 
            {
                return res.status(201).json({ message: 'User registered successfully' });
            } 
            else 
            {
                return res.status(500).json({ error: 'Failed to register user' });
            }
        }
    } 
    catch (err) 
    {
        return res.status(500).json({ error: err.message });
    }
  };




//_______________SignIn______________________________________________________________________________
const login = async (req, res) => 
{
    try
    {
        const {email, password} = req.body;
        if (!email || !password) 
        {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const result = await query.FINDONE('users', 'email', email);
        console.log(result);

        if(!result || result.length === 0)
        {
            return res.status(404).json({ error: 'Invalid email' });
        }
        else
        {
            const db_password = result[0].password;
            const isMatch = await bcrypt.compare(password, db_password);
            if(isMatch) 
            {
                 // Generate JWT
                const SECRET_KEY = 'book000';
                const token = jwt.sign({ email, userId: result[0].id }, SECRET_KEY, { expiresIn: '1h' });
                return res.status(200).json({message: 'Login successful', token, user: { email }});
            } 
            else 
            {
                return res.status(401).json({ error: 'Invalid password'});
            }
        }
        
    }
    catch(err)
    {
        return res.status(500).json({ error: err });
    }
}

module.exports = { register, login};