import { Schema, model, Document } from 'mongoose';

interface IActivity {
  time:      string;
  activity:  string;
  cost:      number;
  tip?:      string;
  location?: { lat: number; lng: number };
}

interface IDayPlan {
  day:        number;
  theme:      string;
  activities: IActivity[];
}

export interface ITrip extends Document {
  userId:            Schema.Types.ObjectId;
  collaborators:     Schema.Types.ObjectId[];
  title:             string;
  destination:       string;
  summary:           string;
  days:              number;
  budget:            number;
  totalEstimatedCost: number;
  itinerary:         IDayPlan[];
  budgetBreakdown:   { accommodation: number; food: number; transport: number; activities: number };
  packingList:       string[];
  weatherInfo?:      string;
  status:            'draft' | 'active' | 'completed';
  isPublic:          boolean;
  createdAt:         Date;
}

const activitySchema = new Schema<IActivity>({
  time:      String,
  activity:  String,
  cost:      { type: Number, default: 0 },
  tip:       String,
  location:  { lat: Number, lng: Number },
});

const tripSchema = new Schema<ITrip>({
  userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  title:         { type: String, required: true },
  destination:   { type: String, required: true },
  summary:       String,
  days:          { type: Number, required: true },
  budget:        { type: Number, required: true },
  totalEstimatedCost: { type: Number, default: 0 },
  itinerary:     [{ day: Number, theme: String, activities: [activitySchema] }],
  budgetBreakdown: {
    accommodation: { type: Number, default: 0 },
    food:          { type: Number, default: 0 },
    transport:     { type: Number, default: 0 },
    activities:    { type: Number, default: 0 },
  },
  packingList:   [String],
  weatherInfo:   String,
  status:        { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
  isPublic:      { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast destination search
tripSchema.index({ destination: 'text', title: 'text' });

export default model<ITrip>('Trip', tripSchema);
