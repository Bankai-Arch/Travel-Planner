import { Schema, model, Document } from 'mongoose';

export interface IExpense extends Document {
  tripId:   Schema.Types.ObjectId;
  userId:   Schema.Types.ObjectId;
  category: 'food' | 'transport' | 'hotel' | 'activity' | 'shopping' | 'other';
  amount:   number;
  currency: string;
  note:     string;
  date:     Date;
}

const expenseSchema = new Schema<IExpense>({
  tripId:   { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
  userId:   { type: Schema.Types.ObjectId, ref: 'User', required: true },
  category: {
    type: String,
    enum: ['food', 'transport', 'hotel', 'activity', 'shopping', 'other'],
    required: true,
  },
  amount:   { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  note:     String,
  date:     { type: Date, default: Date.now },
}, { timestamps: true });

export default model<IExpense>('Expense', expenseSchema);
