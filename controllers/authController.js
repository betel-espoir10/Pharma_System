const bcrypt = require("bcrypt");
const { User, Role } = require("../models");


// PAGE LOGIN
exports.showLogin = (req, res) => {
    res.render("auth/login", {
        error: ""
    });
};


// LOGIN USER
exports.login = async (req, res) => {

    try {
        const { email, password } = req.body;

// RECHERCHE USER
        const user = await User.findOne({
            where: { email },
            include: [Role]
        });

// USER INTROUVABLE
        if (!user) {
            return res.render( "auth/login",
                {
                    error: "Email incorrect"
                }
            );
        }

// VERIFICATION PASSWORD
        const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.render( "auth/login",
                {
                    error: "Mot de passe incorrect"
                }
            );
        }

// SESSION
        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ? user.role.name: null
        };
// REDIRECTION
     res.redirect("/home");
    }
    catch (error) {
        console.log(error);
        res.render("auth/login", {
            error:
            "Erreur connexion"
        });
    }
};


// LOGOUT
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/login");
    });
};