import mongoose, { Schema, model, Document, Model } from 'mongoose';

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


// Creating an interface representation for a document in MongoDB
interface PostAttrs{
    body: string
    channelName: string
    thumbnail: ImageAttrs[]
    //comments: mongoose.Types.ObjectId[],
    user: mongoose.Types.ObjectId
};

interface PostModel extends Model<PostDoc>{
    build(attrs: PostAttrs): PostDoc
};

interface PostDoc extends Document{
    body: string
    favorite: boolean
    thumbnail: ImageAttrs[]
    likes: number
    views: number
    comments: mongoose.Types.ObjectId[]
    user: mongoose.Types.ObjectId
    tag: mongoose.Types.ObjectId[]
    channelName: string
};

const postShema = new Schema<PostDoc>({
    body: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    thumbnail: [{
        type: imageSchema,
        required: true
    }],
    likes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0,
      },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment',
            default: []
        }
    ],
    channelName: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tag: [
        {
            type: Schema.Types.ObjectId,
            ref: "Tag",
            default: []
        }
    ]
});

postShema.statics.build = (attrs: PostAttrs) => {
    return new Post(attrs)
};

export const Post = model<PostDoc, PostModel>("Post", postShema);


// post should be 2 or more