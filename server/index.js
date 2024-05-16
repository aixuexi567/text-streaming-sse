const express = require('express');

const app = express();

const cors = require('cors');

app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Send SSE data every second
  const infos =
    '平生不会相思，才会相思，便害相思。身似浮云，心如飞絮，气若游丝。空一缕余香在此，盼千金游子何之。证侯来时，正是何时？灯半昏时，月半明时。';
  const wrods = infos.split('');
  let index = 0;
  const sendData = () => {
    if (index < wrods.length) {
      const data = {
        message: wrods[index],
        timestamp: new Date().toISOString(),
      };
      res.write(`data: ${JSON.stringify(data)}\n\n`);
      index++;
    } else {
      clearInterval(intervalId);
    }
  };
  const intervalId = setInterval(sendData, 100);
  res.on('close', () => {
    console.log('>>> close >>>', new Date().toISOString());
    clearInterval(intervalId);
  });
});

app.listen(3000, () => {
  console.log('SSE demo server is running on port 3000');
});
