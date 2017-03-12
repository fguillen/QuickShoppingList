/* eslint-disable no-param-reassign */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();

const DATA_FILE = path.join(__dirname, 'data.json');

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

app.get('/api/elements', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

app.post('/api/elements', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const elements = JSON.parse(data);
    const newTimer = {
      title: req.body.title,
      project: req.body.project,
      id: req.body.id,
      elapsed: 0,
      runningSince: null,
    };
    elements.push(newTimer);
    fs.writeFile(DATA_FILE, JSON.stringify(elements, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(elements);
    });
  });
});


app.put('/api/elements', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    const elements = JSON.parse(data);
    elements.forEach((element) => {
      if (element.id === req.body.id) {
        element.title = req.body.title;
        element.project = req.body.project;
      }
    });
    fs.writeFile(DATA_FILE, JSON.stringify(elements, null, 4), () => {
      res.json({});
    });
  });
});

app.delete('/api/elements', (req, res) => {
  fs.readFile(DATA_FILE, (err, data) => {
    let elements = JSON.parse(data);
    elements = elements.reduce((memo, element) => {
      if (element.id === req.body.id) {
        return memo;
      } else {
        return memo.concat(element);
      }
    }, []);
    fs.writeFile(DATA_FILE, JSON.stringify(elements, null, 4), () => {
      res.json({});
    });
  });
});

app.get('/molasses', (_, res) => {
  setTimeout(() => {
    res.end();
  }, 5000);
});

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
