import mongoose, { Schema, model, Document, Model } from "mongoose";

interface UserAttrs{
    name: string
    myChannels?: mongoose.Types.ObjectId[]
    savedId?: string
};

interface UserModel extends Model<UserDoc>{
    build(attrs: UserAttrs): UserDoc
};

interface UserDoc extends Document{
    name: string
    savedId: mongoose.Types.ObjectId
    myChannels: mongoose.Types.ObjectId[]
    comments: mongoose.Types.ObjectId[]
    posts: mongoose.Types.ObjectId[]
};

const UserSchema = new Schema<UserDoc>({
    name: {
        type: String,
        required: true
    },
    savedId: {
        type: Schema.Types.ObjectId,

    },
    myChannels: [
        {
            type: Schema.Types.ObjectId,
            ref: "Channel",
            default: []
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: [],
        }
    ],
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            default: []
        }
    ]
});

UserSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

export const User = model<UserDoc, UserModel>('User', UserSchema);