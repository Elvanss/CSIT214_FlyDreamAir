import express from "express";
import path from "path";

let router = express.Router();
const __dirname = path.resolve();

const initWebRoute = (app) => {
    router.get('/', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/login.html'));
      });
      
    router.get('/signup.html', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/signup.html'));
    });
      
    router.get('/main.html', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/main.html'));
    }); 

    router.get('/earn.html', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/earn.html'));
    }); 

    router.get('/spend.html', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/spend.html'));
    }); 

    router.get('/account.html', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/account.html'));
    }); 

    router.get('/confirmation.html', function(req, res) {
        res.sendFile(path.join(__dirname, '/src/views/confirmation.html'));
    }); 

  return app.use('/', router)
}
  
export default initWebRoute;


