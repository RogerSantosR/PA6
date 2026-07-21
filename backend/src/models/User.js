import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Correo con formato inválido'],
    },
    passwordHash: {
      type: String,
      required: true,
      select: false, // nunca se devuelve por defecto
    },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
    },
  },
  { timestamps: true }
);

// Método de instancia: comparar contraseña en texto plano con el hash.
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

// Helper estático para crear usuario hasheando la contraseña.
userSchema.statics.createWithPassword = async function ({ name, email, password, role }) {
  const passwordHash = await bcrypt.hash(password, 10);
  return this.create({ name, email, passwordHash, role });
};

// No exponer passwordHash ni __v al serializar.
userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
