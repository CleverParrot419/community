import { connect } from 'mongoose';

export async function Connection() {
    try {
        console.log('Connecting to database ♾️♾️');

        // Ensure MONGO_URI is defined
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        const conn = await connect(mongoUri, {
            dbName: 'community',
            bufferCommands: true
        });

        console.log(`MongoDB Connected: ${conn.connection.host} ✅`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}
