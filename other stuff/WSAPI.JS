// Required modules
const express = require('express');
const app = express();

app.use(express.json());

// API route - a real action, not just an example
app.get('/fetchData', (req, res) => {
  const data = { message: 'Here is your data!' };
  res.json(data);  // Respond with the data
});

// Real server listening
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
