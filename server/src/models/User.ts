import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name:        string;
  email:       string;
  password:    string;
  avatar?:     string;
  role:        'user' | 'admin';
  savedTrips:  Schema.Types.ObjectId[];
  createdAt:   Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  name:       { type: String, required: true, trim: true },
  email:      { type: String, required: true, unique: true, lowercase: true },
  password:   { type: String, required: true, minlength: 6, select: false },
  avatar:     { type: String },
  role:       { type: String, enum: ['user', 'admin'], default: 'user' },
  savedTrips: [{ type: Schema.Types.ObjectId, ref: 'Trip' }],
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain password with hashed
userSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default model<IUser>('User', userSchema);
