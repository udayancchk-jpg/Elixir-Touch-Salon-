import 'dotenv/config';
import serverless from 'serverless-http';
import { createApiApp } from '../../lib/api.ts';

const app = createApiApp({ serverless: true });

export const handler = serverless(app);
