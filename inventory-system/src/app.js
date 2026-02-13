const express = require('express');
const httpStatus = require('http-status');
const helmet = require('helmet');
const xss = require('xss-clean');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const routes = require('./routes/v1');
const routesWeb = require('./routes');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/ApiError');
const { jwtStrategy } = require('./config/passport');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerOptions = require('./swaggerOption');
const expressLayout = require('express-ejs-layouts');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const path = require('path');
const { userService, authService, tokenService } = require('./services');
const prisma = require('../prisma');
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const { auth } = require('./middlewares/auth');
const { addTokenToHeader } = require('./middlewares/addTokenToHeader');
const { tokenTypes } = require('./config/tokens');
const { checkNotAuthenticate, checkAuthenticate } = require('./middlewares/checkAuth');
const app = express();


if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}



// set security HTTP headers
app.use(helmet());

// aktifin parsing json
app.use(express.json());

// aktifin urlencoded
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use(methodOverride('_method'));

//static file
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));


//flash message
app.use(
  flash({
    sessionKeyName: 'express-flash-message',
   
  })
);



//template engine
app.use(expressLayout);
app.set('layout','./layouts/main');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//express session
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    //   sameSite: 'none',
    //   secure: false, // becareful set this option, check here: https://www.npmjs.com/package/express-session#cookiesecure. In local, if you set this to true, you won't receive flash as you are using `http` in local, but http is not secure
    // },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use('jwt', jwtStrategy);

// v1 api routes
app.use('/v1', routes);

// web routes
app.use('/', routesWeb);




passport.use(
	new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async function (email, password, done) {
		try {

      const user = await authService.loginUserWithEmailAndPassword(email,password)
      const tokens = await tokenService.generateAuthTokens(user);
      // const accessToken = tokens.access.token;
      // const authorizationHeader = `Bearer ${accessToken}`;

      // console.log('User:', user);
      // console.log('Authorization Header:', authorizationHeader);
      user.tokens = tokens;
      return done(null, user)
    } catch (error) {
			done(error);
		}

	})
);


passport.serializeUser(function (user, done) {
  console.log('Serialize User:', user);
	process.nextTick(function () {
		return done(null, user.id);
	});
});

passport.deserializeUser(function (id, done) {
  console.log('Deserialize User ID:', id);
  
	process.nextTick(async function () {
		try {
      // const existingUser = await prisma.user.findUnique({
      //   where:{id},
      // })
      const existingUser = await userService.getUserById(id)
      const tokens = await tokenService.generateAuthTokens(existingUser);
      existingUser.tokens = tokens;
			done(null, existingUser);
		} catch (error) {
			done(error);
		}
	});
});




app.post(
	'/auth/login',
	checkNotAuthenticate,
	passport.authenticate('local', { 
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
  }),

);



app.post('/auth/register', async (req, res) => {
	const { name, email, password, role } = req.body;
	if (!name) {
		return res.render("register", {
			error: "name required",
			name,
			email,
			password,
		});
	}
	if (!email) {
		return res.render("register", {
			error: "email required",
			name,
			email,
			password,
		});
	}
	if (!password) {
		return res.render("register", {
			error: "password required",
			name,
			email,
			password,
		});
	}

	const existingUser = await userService.getUserByEmail(email)

	if (existingUser) {
		return res.render("register", {
			error: "email already taken",
			name,
			email,
			password,
		});
	}

	//const hashPassword = await bcrypt.hash(password, 8);
  await userService.createUser(req.body)
	// await prisma.user.create({
	// 	data: {
	// 		name,
	// 		email,
	// 		password: hashPassword,
	// 	},
	// });

	res.render("register", {
		success_msg: "Register Succesfully",
	});
});




app.get('/', checkAuthenticate, (req, res) => {
  // Handler untuk rute root
  res.render('index', {
      user: req.user,
      //accessToken: req.user.tokens.access.token
  });
});


app.get('/auth/login', checkNotAuthenticate, (req, res) =>{
  res.render('./auth/login')
})


app.get('/auth/register', checkNotAuthenticate, (req, res) => {
	res.render("./auth/register");
});



app.get('/auth/logout', (req, res) => {
  req.logout(); // Hapus sesi pengguna
  res.redirect('/auth/login'); // Redirect ke halaman login setelah logout
});

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//Handle 404
app.get('*', (req,res)=>{
  res.status(404).render('404');
})



// send 404 error jika route tidak ada
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});



// convert error jadi Instance API Error jika ada error yang tidak ketangkap
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
