import { Schema, model, Document } from 'mongoose';

export interface IReview extends Document {
  userId:      Schema.Types.ObjectId;
  targetId:    Schema.Types.ObjectId;
  targetType:  'hotel' | 'destination';
  rating:      number;
  title:       string;
  comment:     string;
  images:      string[];
  helpful:     number;
  createdAt:   Date;
}

const reviewSchema = new Schema<IReview>({
  userId:     { type: Schema.Types.ObjectId, ref: 'User', required: true },
  targetId:   { type: Schema.Types.ObjectId, required: true },
  targetType: { type: String, enum: ['hotel', 'destination'], required: true },
  rating:     { type: Number, required: true, min: 1, max: 5 },
  title:      { type: String, required: true },
  comment:    { type: String, required: true },
  images:     [String],
  helpful:    { type: Number, default: 0 },
}, { timestamps: true });

// One review per user per target
reviewSchema.index({ userId: 1, targetId: 1, targetType: 1 }, { unique: true });

export default model<IReview>('Review', reviewSchema);
