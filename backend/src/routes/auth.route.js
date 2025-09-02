import { Router } from 'express';


const authRoute = Router();

// Endpoints
authRoute.post('/register', {})
authRoute.post('/login', {})
authRoute.post('/refresh', {})