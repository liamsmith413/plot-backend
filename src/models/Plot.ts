
import mongoose, { Schema, Document } from 'mongoose';

interface IPlot extends Document {
    plot_id: string;
    image_url: string;
    lease_duration: number;
    status: string;
    owner_wallet: string;
    owner_id: string;
    admin_wallet: string;
    plot_value: number;
    remote_link: string;
    crop: string;
    plot_description: string;
    growth_stage: string;
    harvest_value: number;
    lease_remaining: number;
    next_remote_drive: Date;
    secret_key: string;
    total_earned: number;
}

const plotSchema: Schema = new Schema({
    plot_id: { type: String, required: true },
    image_url: { type: String },
    lease_duration: { type: Number, required: true },
    status: { type: String, required: true },
    owner_wallet: { type: String, required: true },
    owner_id: { type: String, required: true },
    admin_wallet: { type: String, required: true },
    plot_value: { type: Number, required: true },
    remote_link: { type: String, required: true },
    crop: { type: String, required: true },
    plot_description: { type: String, required: true },
    growth_stage: { type: String, required: true },
    harvest_value: { type: Number, required: true },
    lease_remaining: { type: Number, required: true },
    next_remote_drive: { type: Date, required: true },
    secret_key: { type: String, required: true },
    total_earned: { type: Number, required: true },
    imagePath: { type: String, required: true }
});

export default mongoose.model<IPlot>('Plot', plotSchema);
