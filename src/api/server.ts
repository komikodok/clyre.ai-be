import app from './app';
import { logger } from '../utils/logging';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => logger.info(`🚀 Server running on port ${PORT}`));
