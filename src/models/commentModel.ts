import mongoose, { Schema, Types, model, Document, Model} from 'mongoose';

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

interface CommentAttrs{
    fullname: string
    email: string
    body: string
    thumbnail?: ImageAttrs
    user: mongoose.Types.ObjectId
    post: mongoose.Types.ObjectId
    status?: string
};
interface CommentModel extends Model<CommentDoc>{
    build(attrs: CommentAttrs): CommentDoc
};
interface CommentDoc extends Document{
    fullname: string
    email: string
    body: string
    thumbnail: ImageAttrs
    user: mongoose.Types.ObjectId
    post: mongoose.Types.ObjectId
    status: string
};

const commentSchema = new Schema<CommentDoc>({
    fullname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    thumbnail: {
        type: imageSchema,
        default: null
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "rejected", "aproved"]
    },
});

commentSchema.statics.build = (attrs: CommentAttrs) => {
    return new Comment(attrs);
};

export const Comment = model<CommentDoc, CommentModel>("Comment", commentSchema);