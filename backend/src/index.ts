import app from './app.js';
import { PORT } from './config/port.js';

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
