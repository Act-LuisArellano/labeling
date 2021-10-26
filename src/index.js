const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');


// Initializations
const app = express();
require('./database');
require('./config/passport');

// Settings
app.set('port',process.env.PORT || 8080);
app.set('views',path.join(__dirname,'views'));
const hbs = exphbs.create({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',

    // HELPERS
    helpers:{
        img0: function(image_name){
            return image_name.split(',')[0]
        },
        img_iter: (image_name)=>{
            out='';
            image_name.split(',').forEach((image)=>{
                out=out+ "<img src='" + image + "' class='card-img-bot'></img>";
            });
            return out;
        },
        complete: (id_card,ids_ejemplos) =>{
            if(ids_ejemplos.includes(id_card.toString())){
                return '<h4 class="card-title d-flex justify-content-between align-items-center"><i class="far fa-check-square" id="faicon"></i></h4>';
            }else{
                return '<h4 class="card-title d-flex justify-content-between align-items-center"><i class="fas fa-pencil-alt" id="faicon_pencil"></i></h4>';
            }
        },
        checked:(categoria)=>{
            if(categoria){
                return "checked";
            }
        },
        for: function(num_page, block) {
            n=Math.min(19,Math.max(3,num_page));
            var accum = '';
            for(var i = (n-2); i <= (n+2); i += 1)
                accum += block.fn(i);
            return accum;
        },
        page_ind: (i,num)=>{
            if(num==i){
                return 'id="actual_page"';
            }
        }
    }
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');


// Middlewares
app.use(express.urlencoded({extended:false}));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Global variables
app.use((req,res,next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

//Routes
app.use(require('./routes/index'));
app.use(require('./routes/notes'));
app.use(require('./routes/users'));


//Static files
app.use(express.static(path.join(__dirname,'public')));

//Server is listenning
app.listen(app.get('port'),()=>{
    console.log('Server on port', app.get('port'));
});