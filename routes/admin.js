const express = require('express');
const router = express.Router();
const passport = require('passport');
const Notification = require('../models/notification')
const methodOverride = require('method-override')
router.use(methodOverride('_method')); 
const flash = require('connect-flash');
const Ticket = require('../models/ticket');
const { isLoggedIn } = require('../middleware');
router.use(flash());


router.get('/check', (req, res)=>{
    res.send("HI")
})


router.get('/adminhome',isLoggedIn, (req, res)=>{
  res.render('home/adminhome')
})

router.get('/admin', (req, res)=>{
  res.render('home/admin')
})

router.post('/adminhome', (req, res)=>{
  req.flash('success', "Admin successfully loggedin!");
  res.render('home/adminhome')
  
})



// ************NOTIFICATIONS*****************

// create notifcation page
router.get('/notifications', isLoggedIn, (req, res)=>{
    res.render('./home/notification.ejs')
})
// posting notification
router.post('/notifications', isLoggedIn, async(req, res)=>{
    const notification = new Notification(req.body)
    console.log(req.body)
    await notification.save();
    req.flash('success', 'Notice broadcasted successfully')
    res.redirect(`/notifications`)
})

// show all notification table
router.get('/shownotifications',isLoggedIn, async(req, res, next)=>{
    try{
        const notifications = await Notification.find({});
        console.log(notifications);
      res.render('./home/shownotifications.ejs', {notifications})
      }
      catch(e){
        next(e)
      }
})

// delete notification
router.delete('/deleten/:id',isLoggedIn, async(req, res, next)=>{
    try{
        const {id} = req.params;
        const n = await Notification.findByIdAndDelete(id);
        console.log(n)
        req.flash("success", "Sucessfully deleted!")
        res.redirect('/shownotifications');
      }
      catch(e){
        next(e);
      }
})




// router.get('/adminhome/ticket/open',isLoggedIn, async(req, res)=>{
//   const user = req.user;
//   const tickets = await Ticket.find({ username: user.username, status: 1 })
//   console.log(tickets)
//   res.render('home/ticketshowadmin1.ejs', {tickets})
// })


router.get('/adminhome/ticket/action',isLoggedIn, async(req, res)=>{
  const user = req.user;
  const tickets = await Ticket.find({ status: 2 })
  console.log(tickets)
  res.render('home/ticketshowadmin2.ejs', {tickets})
})
router.post('/adminhome/ticket/action/:id', async(req, res, next)=>{
  try{
      const {id} = req.params;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", id);
      const n = await Ticket.findByIdAndUpdate(id, { status:1 });
      console.log(n)
      req.flash("success", "MOved to Author action!")
      res.redirect('/home/ticket/action');
    }
    catch(e){
      next(e);
    }
})


router.get('/adminhome/ticket/closed',isLoggedIn, async(req, res)=>{
  const user = req.user;
  const tickets = await Ticket.find({ status: 3 })
  console.log(tickets)
  res.render('home/ticketshowadmin3.ejs', {tickets})
})


//admin ticekt OPEN to AUTHOR ACTION
router.post('/adminhome/ticket/:id', async(req, res, next)=>{
  try{
      const {id} = req.params;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", id);
      const n = await Ticket.findByIdAndUpdate(id, { status:2 });
      console.log(n)
      req.flash("success", "MOved to Author action!")
      res.redirect('/adminhome/ticket/open');
    }
    catch(e){
      next(e);
    }
})

// ADMIN tickets

router.get('/adminhome/ticket/open', isLoggedIn, async(req, res)=>{

  const tickets = await Ticket.find({status: 1 })
  console.log(tickets) 
  res.render('home/ticketshowadmin1.ejs', {tickets})
})

router.post('/adminhome/ticket/close/:id', async(req, res, next)=>{
  try{
      const {id} = req.params;
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>", id);
      const n = await Ticket.findByIdAndUpdate(id, { status:3 });
      console.log(n)
      req.flash("success", "MOved to Author action!")
      res.redirect('/home/ticket/action');
    }
    catch(e){
      next(e);
    }
})


module.exports = router;