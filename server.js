require("dotenv").config();
const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

// Connexion à la base de données + démarrage serveur
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à MySQL réussie");

    await sequelize.sync({ alter: false });
    console.log("✅ Synchronisation des tables OK");

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur de connexion à la base :", error);
  }
})();
