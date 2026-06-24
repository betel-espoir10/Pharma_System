const express = require("express");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const flash = require("connect-flash");
const helmet = require("helmet");
const morgan = require("morgan");
const { Role } = require("./models");

const app = express();

//CREATION ROLES AUTOMATIQUE
async function createDefaultRoles() {
    const roles = [
        "ADMIN",
        "PHARMACIEN.(NE)",
        "CAISSIER.(E)"
    ];
    for (const roleName of roles) {
        const roleExists =
        await Role.findOne({
            where: { name: roleName }
        });
        if (!roleExists) {
            await Role.create({
                name: roleName
            });
        }
    }
}
createDefaultRoles();

// CONTROLLERS IMPORT
const drugController = require("./controllers/drugController");
const categoryController = require("./controllers/categoryController");
const manufacturerController = require("./controllers/manufacturerController");
const customerController = require('./controllers/customerController');
const supplierController = require('./controllers/supplierController');
const userController = require("./controllers/userController");
const roleController = require("./controllers/roleController");
const batchController = require("./controllers/batchController");

// SÉCURITÉ
app.use(helmet({
   contentSecurityPolicy: {
         directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
               "'self'",
               "'unsafe-inline'",
               "https://cdn.jsdelivr.net",
               "https://cdn.datatables.net"
            ],

            scriptSrc: [
               "'self'",
               "'unsafe-inline'",
               "https://code.jquery.com",
               "https://cdn.jsdelivr.net",
               "https://cdn.datatables.net"
            ],
            imgSrc: [
               "'self'",
               "data:",
               "https://cdn.jsdelivr.net",
            ],
            connectSrc: [
               "'self'",
               "https://cdn.jsdelivr.net"
            ],
            fontSrc: [
               "'self'",
               "https://cdn.jsdelivr.net"
            ]
         }
      }
})
);

// LOGS
app.use(morgan("dev"));

// BODY PARSER
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));


//  VIEW ENGINE (EJS)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

// SESSION (MySQL)
const sessionStore = new MySQLStore({
  host: "localhost",
  user: "root",
  password: "",
  database: "db_pharma",
});

app.use( session ({
    key: "pharma_session",
    secret: "pharma_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60, // 1h
    },
  }),
);

// MIDDLEWARE GLOBAL
app.use((req, res, next) => {
   res.locals.user =
   req.session.user || null;
   next();
});

// FLASH MESSAGES
app.use(flash());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.session.user || null;
  next();
});

// ROUTES
const authRoutes = require("./routes/authRoutes");
const drugRoutes = require("./routes/drugRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const manuRoutes = require("./routes/manuRoutes");
const customerRoutes = require('./routes/customerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const userRoutes = require("./routes/userRoutes");
const roleRoutes = require("./routes/roleRoutes");
const batchRoutes = require("./routes/batchRoutes");
const saleRoutes =require("./routes/saleRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");


app.use("/", authRoutes);
app.use("/drugs", drugRoutes);
app.use("/category", categoryRoutes);
app.use("/manufacturer", manuRoutes);
app.use('/customers', customerRoutes);
app.use("/suppliers", supplierRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/batches", batchRoutes);
app.use("/sales", saleRoutes);
app.use("/purchases", purchaseRoutes);
app.use("/dashboard", dashboardRoutes);

// LOGIN PAGE
app.get("/", (req, res) => {
  res.render("auth/login");
});

// HOME PAGE
app.get("/home", (req, res) => {
   if(!req.session.user){
      return res.redirect("/login");
   }
   res.render("home");
});

// 404 HANDLER
app.use((req, res) => {
  res.status(404).render("errors/404");
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("❌ ERREUR:", err);
  res.status(500).render("errors/500");
});

module.exports = app;
