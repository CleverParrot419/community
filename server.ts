import http from 'http';
import app from './src/app';

const PORT = process.env.PORT || 3500;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('Starting Server...👌👌');
    console.log(`Server running on port: ${PORT}`);
});
