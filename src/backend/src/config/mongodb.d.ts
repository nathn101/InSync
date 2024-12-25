import { MongoClient } from 'mongodb';

declare module '../config/mongodb' {
    export const client: MongoClient;
    export const connectDB: () => Promise<void>;
}