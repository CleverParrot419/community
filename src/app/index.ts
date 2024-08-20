import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { Connection } from "../configurations/db";
import { router } from "../route/createChannel";
import { postRoute } from "../route/post";
const MongoDBSession = require("connect-mongodb-session")(session);


// Load environment variables
dotenv.config();

const app = express();

// Database connection configuration
Connection();

app.set("trust-proxy", true);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD"],
  credentials: true,
}))
app.use(cookieParser());
app.use(morgan("combined"));



app.use(
  session({
    name: "sessionID",
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      // @ts-ignore 
      client: mongoose.connection.getClient(),
      collectionName: "sessions",
      mongoUrl: process.env.MONGO_URI,
      ttl: 2 * 60 * 60,
      dbName: "users"
    }),
    cookie: {
      maxAge: 2 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true, // Prevent client-side JavaScript access to cookies
    },
  })
);


// Log requests
app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  next();
});

// Test route for setting cookies
app.get("/api/cookie", (req, res) => {
  res.send("Cookie is set");
});

// Authentication routes
app.use(
  "/api/community",
  router,
  postRoute
);

// Middleware to handle not found routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found") as Error & { status?: number };
  error.status = 404;
  next(error);
});

// Error handling middleware
app.use(
  (
    err: Error & { status?: number },
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err.status) {
      res.status(err.status).json({ error: err.message });
      return;
    }

    res.status(500).json({ error: "Something went wrong" });
  }
);

export default app;
