import app from './app';
import { PORT } from './config';

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
