const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

const app = express();
const port = 3010;

app.use(express.static('static'));

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

let db;
(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Endpoint1
async function getAll() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  try {
    let result = await getAll();

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint2 fetch restaurants by id

async function getResId(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurants: response };
}

app.get('/restaurants/details', async (req, res) => {
  let id = parseInt(req.query.id);
  try {
    let result = await getResId(id);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint 3 fetch restaurants by cuisine

async function getResCu(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  try {
    let result = await getResCu(cuisine);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint 4

async function getResFil(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ? ';
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;

  try {
    let result = await getResFil(isVeg, hasOutdoorSeating, isLuxury);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint 5

async function getResSort() {
  let query = 'SELECT * FROM restaurants ORDER by rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  try {
    let result = await getResSort();

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Endpoint6
async function getAllD() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}
app.get('/dishes', async (req, res) => {
  try {
    let result = await getAllD();

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//endpoint 7

async function getDId(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}

app.get('/dishes/details', async (req, res) => {
  let id = parseInt(req.query.id);
  try {
    let result = await getDId(id);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint 8

async function getDFil(isVeg) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ? ';
  let response = await db.all(query, [isVeg]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;

  try {
    let result = await getDFil(isVeg);

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//endpoint 9

async function getDSort() {
  let query = 'SELECT * FROM dishes ORDER by price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  try {
    let result = await getDSort();

    if (result.length === 0) {
      return res.status(404).json({ message: 'No resturants found' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
