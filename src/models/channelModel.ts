import mongoose, { Schema, model, Document, Model } from "mongoose";

interface ImageAttrs{
    data: string
    contentType: string
    cloudinaryPublicId: string
}

const imageSchema = new Schema<ImageAttrs>({
    data: String,
    contentType: String,
    cloudinaryPublicId: String
})

interface ChannelAttrs{
    channelName: string
    owner?: mongoose.Types.ObjectId
    members?: mongoose.Types.ObjectId[]
    description?: string
    thumbnail?: ImageAttrs
    //message: mongoose.Types.ObjectId[]
}

interface ChannelModel extends Model<ChannelDoc>{
    build(attrs: ChannelAttrs): ChannelDoc
}

interface ChannelDoc extends Document{
    channelName: string
    owner: mongoose.Types.ObjectId
    members: mongoose.Types.ObjectId[]
    description: string
    thumbnail: ImageAttrs
    admins: mongoose.Types.ObjectId[]
    //message: mongoose.Types.ObjectId[]
}

const channelShema = new Schema<ChannelDoc>({
    channelName: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: "User",
        default: []
    }],
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: []
        }
    ],
    description: {
        type: String,
        default: ""
    },
    thumbnail: {
        type: imageSchema,
        default: null
    },
    /* message: [
        {
            type: Schema.Types.ObjectId,
            ref: "Messages",
            default: []
        }
    ] */
});

channelShema.statics.build = (attrs: ChannelAttrs) => {
    return new Channel(attrs);
};

export const Channel = model<ChannelDoc, ChannelModel>("Channel", channelShema);