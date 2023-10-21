const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const Ticket = require('../models/ticket');
const Bookings = require('../models/booking')
const { isLoggedIn } = require('../middleware');
const flash = require('connect-flash');
router.use(flash());

router.use(express.json());

//Sign in or Register
router.get('/register', isLoggedIn, (req, res)=>{
    res.render('users/register')
})
router.post('/register',isLoggedIn, async(req, res)=>{
    try{
        const {fname, lname, roomnumber, email, username, password} = req.body;
        const user = new User({fname, lname, roomnumber, email, username, password});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser);
        req.flash('success', 'On-boarding Successful!!');
        res.redirect('/register')
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
})  

////**********LOGIN************
router.get('/login', (req, res)=>{
    res.render('users/login')
})
router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res)=>{

    const {username} = req.body;
    if(username==="admin"){
        req.flash('success', 'Admin Sucessfully Logged in!');
        res.redirect('/adminhome');
    }
    else{
        req.flash('success', 'Sucessfully Logged in!');
        res.redirect('/userhome');
    }    
})

//**********LOGOUT************
router.get('/logout', (req, res, next)=>{
  
    req.logout(function(err){
        if(err){
            return next(err);
        }
    req.flash('success', "Sucessfully Logged out!");
    res.redirect('/login');
    });
});



// **********************TICEKTS**********************

//show  ticket page
router.get('/home/ticket',isLoggedIn, (req, res)=>{
    res.render('home/ticketnew.ejs')
})
// create ticket
router.post('/home/ticket',isLoggedIn, async(req, res, next)=>{
    console.log(req.body);
    // res.send(req.user._id);
    try{
        const user = req.user;
        const ticket = new Ticket(req.body)
        ticket.username = user.username;
        ticket.userid = user.id;
        console.log(ticket);
        ticket.date = new Date();
        
        ticket.status = 1;
        console.log(ticket);
        
        await ticket.save();
        req.flash('success', 'ticket created. Wait for admin to fix it! Keep checking Autor action section.')
        res.redirect(`/home/ticket`);
      }
      catch(e){
        next(e);
      }
})

//show open tickets
router.get('/home/ticket/open', async(req, res)=>{
    const user = req.user;
    console.log(user.username);
    const tickets = await Ticket.find({ username: user.username, status: 1 })
    console.log(tickets)
    res.render('home/ticketshow1.ejs', {tickets})
})

//show author action
router.get('/home/ticket/action',isLoggedIn, async(req, res)=>{
    const user = req.user;
    console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",user.username)
    const tickets = await Ticket.find({ username: user.username, status: 2 })
    console.log(tickets)
    res.render('home/ticketshow2.ejs', {tickets})
})

// show closed tickets
router.get('/home/ticket/closed',isLoggedIn, async(req, res)=>{
    const user = req.user;
    const tickets = await Ticket.find({ username: user.username, status: 3 })
    console.log(tickets)
    res.render('home/ticketshow3.ejs', {tickets})
})






  



// *******************BLOGS************************
router.get('/blog1',isLoggedIn, async(req, res)=>{
    res.render('users/blog1.ejs')
})

router.get('/blog2',isLoggedIn, async(req, res)=>{
    res.render('users/blog2.ejs')
})

//************check********************************* 
router.get('/user-info', isLoggedIn, (req, res)=>{
    try{
        const user = req.user;
        res.send(`User: ${user.username}, UserID: ${user.id}`);
    }
    catch{
        res.send("Error")
    }
});


// ************LAUNDARY BOOKING*******************
router.get('/home/booking',isLoggedIn, async(req, res)=>{
    const user = req.user;
    const bookings = await Bookings.findById(user);
    console.log(bookings)
    res.render('users/createbooking.ejs', {bookings});
})
//Bookings of washing machine
router.post("/createbooking", async(req, res) => {
    const { date, time, username, userid } = req.body;
    console.log(req.body)
    // const user = req.user;
    const bookings = await Bookings.find({username:username})
    for (let i = 0; i < bookings.length; i++) {
        if (bookings[i].username === username) {
            let id = bookings[i]._id;
            await Bookings.findByIdAndDelete(bookings[i]._id);
            break;
        }
    }
    // bookings.push({ date, time, username, userid });
    const newBooking = new Bookings();
    newBooking.userid = userid;
    newBooking.date = date;
    newBooking.time = time;
    newBooking.username = username;
    console.log(newBooking);
    await newBooking.save();
    return res.send("Received");
})

router.post("/getbookings", async(req, res) => {
    const { date } = req.body;
    // const user = req.user;
    // console.log(date);
    const allBookings = await Bookings.find({date});
    // let booking = [];
    // bookings.forEach(item => {
    //     if (item.date === date) {
    //         booking.push(item);
    //     }
    // })
    return res.json(allBookings);
})


module.exports = router;