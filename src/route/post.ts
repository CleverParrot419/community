import { Router, Response, Request, NextFunction } from 'express';

import { Post } from "../models/postModel";

export const postRoute = Router();

postRoute.get('/single-post/:id', async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const post = await Post.findById({ _id: id }, { body: 1, favorite: 1, thumbnail: 1, likes: 1, views: 1 })

    if(!post){
        const error = new Error('The post does not exit') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    post.views++
    await post.save();

    res.status(200).send({ success: true, post });
});