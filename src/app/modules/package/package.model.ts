import { model, Schema } from 'mongoose';
import { IPackage, TPackageService } from './package.interface';

const PackageServiceSchema = new Schema<TPackageService>({
  name: {
    type: String,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
  },
});

const PackageSchema = new Schema<IPackage>({
  name: {
    type: String,
    required: true,
  },
  services: {
    type: [PackageServiceSchema],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  expire_after_hours: {
    type: Number,
    min: 1,
    required: true,
  },
  available_from: {
    type: Date,
    required: true,
  },
  available_until: {
    type: Date,
    required: true,
  },
});

const Package = model<IPackage>('Package', PackageSchema);

export default Package;
