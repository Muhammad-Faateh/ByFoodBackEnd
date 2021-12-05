const express = require('express');
const router = express.Router();
const { Owner } = require('../models/OwnerModel')
const jwt = require('jsonwebtoken')



router.get('/owners', async(req, res) => {
    const owners = await Owner.find();
    res.status(200).send(owners);

});

router.get('/owners/:id', async(req, res) => {
    const owner = await Owner.findOne({ _id: req.params.id })
    res.send(owner);
})

router.post('/signup', async(req, res) => {
    const owner = new Owner();
    owner.name = req.body.name;
    owner.gender = req.body.gender;
    owner.email = req.body.email;
    owner.password = await owner.encryptPassword(req.body.password);
    await owner.save();
    res.status(200).send(owner);
})

router.patch('/forgotpassword/:id', async(req, res) => {
    const owner = await Owner.findById({ _id: req.params.id })
    owner.password = await owner.encryptPassword(req.body.password);
    await owner.save();
    res.status(200).send(owner);

})

router.post('/login', async(req, res) => {

    try {
        const owner = await Owner.findOne({ email: req.body.email });
        const isValid = await owner.decryptPassword(req.body.password, owner.password);
        if (isValid) {
            const token = jwt.sign({
                _id: owner._id,
                email: owner.email,
                role: owner.role
            }, process.env.PRIVATE_KEY)
            res.send(token);

        } else {
            res.status(400).send('Password is incorrect')

        }
    } catch (err) {
        res.status(400).send('Password is incorrect')

    }
})



module.exports = router;