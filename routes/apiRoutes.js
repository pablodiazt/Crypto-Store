var db = require("../models");
var passport = require("../config/passport");
var isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = function(app){
  app.get("/api/coins", isAuthenticated, function(req, res) {
    var query= {};
    if(req.query.user_id){
      query.UserId = req.query.user_id;
    }
    db.Coins.findAll({
      where: query,
      include: [db.User]
    }).then(function(dbCoins) {
      res.json(dbCoins);
    });
  });
    
  app.get("/api/coins/:name", isAuthenticated, function(req, res){
    db.Coins.findOne({
      where: {
        name: req.params.name
      },
      include: [db.User]
    }).then(function(dbCoins){
      res.json(dbCoins);
    });
  });
    
  // // Create a new example
  // app.post("/api/coins", function(req, res) {
  //   db.Coins.create(req.body).then(function(dbCoins) {
  //     res.json(dbCoins);
  //   });
  // });
    
  app.patch("/api/coins/buy/:name", isAuthenticated, function(req, res) {
    db.Coins.update({userId: req.user.id}, {
      where: {
        name: req.params.name,
        userId: null
      }
    }).then(function(dbCoins){
      console.log(dbCoins);
      res.json(dbCoins);
    });
  });

  app.post("api/register", function(req, res) {
    db.User.create(req.body).then(function(dbUser) {
      res.json(dbUser);
    });
  });

  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
  });

  app.get("/api/users", isAuthenticated, function(req, res){
    db.User.findAll({
      include: [{model: db.Coins, as: "coinsOwned"}]
    }).then(function(dbUser){
      res.json(dbUser);
    });
  });

  app.get("/api/users/:id", isAuthenticated, function(req, res){
    db.User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function(dbUser){
      res.json(dbUser);
    });
  });

  app.delete("/api/users/:id", isAuthenticated, function(req, res) {
    db.User.destroy({ where: { id: req.params.id } }).then(function(dbUser) {
      res.json(dbUser);
    });
  });
};