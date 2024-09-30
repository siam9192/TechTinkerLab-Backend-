import { model, Schema } from 'mongoose';
import { IReader } from './reader.interface';

const ReaderSchema = new Schema<IReader>(
  {
    post: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    user: {
      type: Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Reader = model<IReader>('Reader', ReaderSchema);

export default Reader;
