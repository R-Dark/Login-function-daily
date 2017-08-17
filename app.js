const express = require("express")
const app = express()
const mustache = require("mustache-express")
const bodyParser = require("body-parser")
const lowercase = require("express-lowercase-paths")
const session = require("express-session")
const users = require("./users")
app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.use(express.static('public'))
var sess = {
  secret: 'robsite',
  cookie: {},
  saveUninitialized: true,
  resave: true
}
app.use(session(sess))
app.use(lowercase())
app.use(bodyParser.urlencoded({
  extended: false
}))
// END OF PACKAGE AND USED REQUESTS

app.get("/", function(req, res) {
  req.session.authorized = false
  res.redirect("/login")
})

app.get("/login", function(req, res) {
  res.render("login")
})

app.post("/authorized", function(req, res) {
      const username = req.body.username
      const password = req.body.password
      let user
      for (var i = 0; i < users.length; i++) {
        if (users[i].username === username && users[i].password === password) {
          user = users[i]
        }
      }
      if (user) {
        req.session.user = user
        req.session.authorized = true
        res.redirect("/index")
      } else {
        res.render("login", {
          message: "Something went wrong!"
        })
      }
    })


app.use(function(req, res, next) {
  req.User = req.session.user
  next()
})

app.get("/index", function(req, res) {
  const authUser = req.User
  res.render("index", {
    authUser: authUser
  })
})

// INVOKE EXPRESS 'HOST MODE' ON PORT 3000
app.listen(3000, function() {
console.log("Express Port 3000")
})
