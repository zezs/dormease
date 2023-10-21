const express = require('express')
const path = require('path')
const methodOverride = require('method-override')
const morgan = require('morgan')
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const AppError = require('./AppError')
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const {isLoggedIn} = require('./middleware')

const Product = require('./models/product')
const Comment = require('./models/comment');
const User = require('./models/user');
const Notification = require('./models/notification');

// const productRoutes = require('./routes/products');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');


app.set('views', path.join(__dirname, '/views'));
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(methodOverride('_method')); 
app.use(express.urlencoded({ extended: true }));    // to access request.body & response.body (This is middle)
const session = require('express-session')
const flash = require('connect-flash');
app.use(flash());
const sessionConfig = {
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized: true,
  cookie: {
      httpOnly: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }
}

app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  // console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})


app.use(morgan('common'))


// const validateProduct = (req, res, next) => {
//   const productSchema = Joi.object({
//     product: Joi.object({
//         title: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().required(),
//         location: Joi.string().required(),
//         description: Joi.string().required()
//     }).required()
//   })
//   console.log(req.body)
//   const {error} = productScheama.validate(req.body, camp);
//   // console.log("***************************",error,"***************************")
//   if(error){
//     const msg = error.deatils.map(el => el.messgae).join(',')
//     throw new AppError(msg, 400)   

//   }
//   else{
//     next();
//   }
// }


const mongoose = require('mongoose');
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/dorm-ease' );
  console.log("Connection open!!!");
}


// const productRoutes = require('./models/product') //Product collection/table called in script
const user = require("./models/user")

app.get('/products', isLoggedIn, async(req, res, next)=>{
    // console.log(`REQUEST DATE: ${req.requestTime}`)
    try{
      const products = await Product.find({});
      console.log(products);
    res.render('products/index.ejs', {products})
    }
    catch(e){
      next(e)
    }
})

app.get('/products/new', isLoggedIn, (req, res)=>{
    res.render('products/new.ejs')
    console.log("111111111111111111111111111")
})
app.post('/products', isLoggedIn, async(req, res, next)=>{

  try{
      console.log(req.body)
      // if (!req.body.product) throw new AppError('Invalid Product data', 400)
      // throw new AppError("Nabeel is cool!!", 500)
      const product = new Product(req.body)
      product.author = req.user._id;
      console.log(product);
      await product.save();
      req.flash('success', 'Successfully made a new product')
      res.redirect(`/products/${product._id}`)
    }

    catch(error){
      console.log("4444444444444444444eeeeeeeeeeeeeeeeeeeeeeeee")
      next(error)
    }
})

// adding next as there is an error handler for async function
app.get('/products/:id/edit', isLoggedIn, async(req, res, next)=>{
  try{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
      return next(new AppError('No product with id', 404)); //alwawsy return
    }
    res.render('products/edit.ejs', {product})
  }
  catch(e){
    next(e);
  }
})
app.put('/products/:id', async(req, res, next)=>{
  try{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body);
    console.log(req.body)
    res.redirect(`/products/${product._id}`)
  }
  catch(e){
    next(e);
  }
})

// error handling in asyn cusing custom class, also add next
app.get('/products/:id', isLoggedIn, async(req, res, next)=>{
  try{
    const {id} = req.params;
    console.log(id)
    const product = await Product.findById(id).populate({ path:'comments',
    populate: {
      path: 'author'
    }
  }).populate('author');
    console.log(product)
    if(!product){
      throw new AppError('No product with id', 404); //alwawsy return
    }
    res.render('products/show.ejs', {product})
  } catch (e) {
    next(e);
  }
})

app.delete('/products/:id', async(req, res)=>{
  try{
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
  }
  catch(e){
    next(e);
  }
})

//**********COMMENT******************/
// comment create
app.post('/products/:id/comments', isLoggedIn, async(req, res) => {
  try{
    const product = await Product.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    product.comments.push(comment);
    console.log(comment);
    await comment.save();
    await product.save();
    // req.flash('success', 'Created new comment!')
    res.redirect(`/products/${product._id}`);
  }
  catch(e){
    next(e);
  }
})
//comment delete
app.delete('/products/:id/comments/:commentId', async(req, res)=>{
  const { id, commentId} = req.params;
  //first removeing references in Productcollection and then removing comment in comment collection
  await Product.findByIdAndUpdate(id, { $pull: {comments: commentId}}) // $pull(used in references):removes all comments in Comment with commentId
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/products/${id}`);
})


app.get('/dormease', (req, res)=>{
  // res.send("Hello!")
  res.render('home/landing.ejs')
})

app.use('/', userRoutes);
app.use('/', adminRoutes)



app.get('/userhome',isLoggedIn, async(req, res, next)=>{
  try{
    const notices = await Notification.find({});
    console.log(notices);
    res.render('users/home.ejs', {notices})
  }
  catch(e){
    next(e)
  }
})

// error handler FINAL hope 
app.use((err, req, res, next)=>{
  console.log("******IN FINAL*****")
  const {status=500} = err;
  if(!err.message) err.message = "Oh No, Something went Wrong!";
  console.log(err, status, err.message)
  // res.status(status).send(message)
  res.status(status).render('products/error.ejs', {err})
})

// listening 
app.listen(3000, ()=>{
  console.log("Listening at 3000!")
})
