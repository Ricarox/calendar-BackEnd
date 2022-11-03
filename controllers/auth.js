const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');




const createUser = async ( req, res = response ) => {

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })
        console.log(user);

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'The user exists'
            })
        }

        
        user = new User( req.body );

        // Encryptar constraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save();
        
        //Generar JWT
        const token = await generateJWT( user.id, user.name );
       
    
        res.status(201).json({
            ok:true,
            uid: user.id,
            name: user.name,
            token
            
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error DB'
        })
    }


}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email })
        console.log(user);

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'The user not exists'
            })
        }

        // confirmar password
        const validPassword = bcrypt.compareSync( password, user.password );
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Incorrect password'
            });
        }

        //Generar JWT
        const token = await generateJWT( user.id, user.name );


        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token

        })


        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error DB'
        })
    }

}

const reToken = async(req, res) => {

    const { uid, name } = req;

    const token = await generateJWT( uid, name );

    res.json({
        ok:true,
        uid,
        name,
        token
    })

}

module.exports = {

    createUser,
    loginUser,
    reToken
}