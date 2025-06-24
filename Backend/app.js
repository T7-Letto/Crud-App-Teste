const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/user');
const userController = require('./controllers/userController');
const sequelize = require('./models').sequelize;

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', userRoutes);

app.get('/api/relatorio/pdf', userController.generatePdfReport);
app.get('/api/relatorio/excel', userController.generateExcelReport);

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });
