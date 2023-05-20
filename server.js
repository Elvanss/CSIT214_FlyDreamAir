import express from 'express';
import fs from 'fs'
import path from 'path'
import configViewEngine from './configs/viewEngine.js'
import initWebRoute from './route/fileRouter.js';

const app = express();
const PORT = 3000;
const __dirname = path.resolve();
app.use(express.static(__dirname + '/public'));

configViewEngine(app);
initWebRoute(app);

app.use(express.json());
app.post('/users.json', function(req, res) {
  fs.writeFile('users.json', JSON.stringify(req.body), (err) => {
    if (err) throw err;
    res.status(200).send('ok');
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});