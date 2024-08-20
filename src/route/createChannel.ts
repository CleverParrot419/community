import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
import mongoose from 'mongoose';

import { Channel } from '../models/channelModel';
import { User } from '../models/userModel';

export const router = Router();

router.get('/all-channel', async (req: Request, res: Response) => {
    const documents = await User.find({}, {myChannels: 1}).populate("channelName").exec();

    res.status(200).send({ success: true, document });
});

router.post('/create-channel', async (req: Request, res: Response, next: NextFunction) => {
    const { userId, channelName, description } = req.body;

    const isChannelNameExit = await Channel.findOne({ channelName });

    if(isChannelNameExit){
        const error = new Error('The channel name already exit') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const channel = Channel.build({channelName: channelName, owner: new mongoose.Types.ObjectId(userId), description: description });
    channel.save();

    await User.find({
        _id: userId,
        $push: {
            myChannels: channel._id
        }
    });

    res.status(200).send({ success: true, channel});
});

router.put('/edit-channel/:channelId', async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params;
    const { userId, channelName, description} = req.body;

    const channel = await Channel.findById(channelId);

    if(!channel){
        const error = new Error('The channel does not exit') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const isEditorAdmin = await Channel.find({
        admins: { $elemMatch: { $eq: userId } }
    });

    if(!isEditorAdmin){
        const error = new Error('access denied, you are not the admin') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const  updated = await Channel.updateOne(
        {_id: channelId},
        {
            description:description,
            channelName: channelName
        }
    );

    res.status(200).send({ success: true, updated });
});

router.delete('/delete-channel/:channelId', async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params
    const { userId } = req.body;

    const isAdmin = await Channel.find({
        admins: { $elemMatch: { $eq: userId }},
    });

    const channel = await Channel.findOne({ channelId });

    if(!channel){
        const error = new Error('The channel does not exit') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    if(!isAdmin){
        const error = new Error('access denied, you are not the admin') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    await User.find({
        myChannels: { $elemMatch: { $eq: channelId }},
        $pull: {
            myChannels: channelId
        }
    });

    const deleted = await Channel.deleteOne({
        _id: channelId
    });

    res.status(200).send({ success: true, deleted });
});

router.put('/join-channel/:channelId', async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params;
    const { userId } = req.body;

    const request = await Channel.findById(channelId);

    if(!request){
        const error = new Error('The channel you want join does not exit') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    await User.find({
        _id: userId,
        $push: { myChannels: channelId}
    });

    const join = await Channel.find({
        _id: channelId,
        $push: { members: userId}
    });

    res.status(200).send({ success: true, join });
});

router.delete('/leave-channel/:channelId', async (req: Request, res: Response, next: NextFunction) => {
    const { channelId } = req.params;
    const { userId } = req.body;

    const request = await Channel.findById(channelId);

    if(!request){
        const error = new Error('The channel does not exit') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const permited = await User.find({
        _id: userId,
        $pull: { myChannels: channelId}
    });

    if(!permited){
        const error = new Error('access denied') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const leave = await Channel.find({
        _id: channelId,
        $pull: { members: userId}
    });

    res.status(200).send({ success: true, leave });
});

router.delete('/remove-member/:userId', async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const { channelId, admins } = req.body;

    const isAdmin = await Channel.find({
        admins: { $elemMatch: { $eq: admins }}
    });

    if(!isAdmin){
        const error = new Error('access denied, you are not the admin') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const permited = await User.find({
        _id: userId,
        $pull: { myChannels: channelId}
    });

    if(!permited){
        const error = new Error('access denied') as Error & { status?: number };
            error.status = 401;
            return next(error);
    }

    const leave = await Channel.find({
        _id: channelId,
        $pull: { members: userId}
    });

    res.status(200).send({ success: true, leave });
});
