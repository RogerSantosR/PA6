import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'La categoría es obligatoria'],
    },
    instructor: {
      type: String,
      required: [true, 'El instructor es obligatorio'],
      trim: true,
      maxlength: 80,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'El precio no puede ser negativo'],
      default: 0,
    },
    capacity: {
      type: Number,
      required: true,
      min: [1, 'La capacidad mínima es 1'],
      default: 30,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: '',
    },
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

courseSchema.index({ title: 'text', description: 'text' });

courseSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Course', courseSchema);
