const express = require('express');
const User = require('../models/userSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');

router.get('/', (req, res) => {

    res.send("From router get /")

})

router.post('/register', async(req, res) => {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
        return res.status(422).json({ error: "plzz fill the right data" })
    }

    //bu using promises you need to remove async above is using promises
    // User.findOne({ email: email }).then((userExists) => {
    //     if (userExists) res.status(422).json({ error: "User already exists" });

    //     const user = new User({ name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword })
    //     user.save().then(() => {
    //         res.status(201).json({ message: "User successfuly" })
    //     }).catch((err) => res.status(500).json({ error: "Failes to register" }))

    // })


    //by usuing async await

    try {

        const userExist = await User.findOne({ email: email });

        if (userExist) return res.status(422).json({ error: "User already exists" });
        else if (password != cpassword) return res.status(422).json({ error: "Password does not match" });

        else {
            const user = new User({ name: name, email: email, phone: phone, work: work, password: password, cpassword: cpassword })

            const userRegister = await user.save();

            res.status(201).json({ message: "User successfuly" })

        }


    } catch (err) {
        console.log(err);
    }




})


router.post('/sigin', async(req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "plzz fill the right data" })
    }

    try {

        const userExist = await User.findOne({ email: email });


        if (userExist) {
            const isMatch = await bcrypt.compare(password, userExist.password);

            const token = await userExist.genrateAuthtoken();
            res.cookie("jwtyoken", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true

            })
            if (!isMatch) {
                res.status(401).json({ error: "Invalid Credentials" })
            }
        } else {
            res.status(401).json({ error: "Invalid Credentials" })
        }

        res.status(201).json({ message: "User Sigin successfuly" })

    } catch (err) {
        console.log(err);
    }


})

module.exports = router;