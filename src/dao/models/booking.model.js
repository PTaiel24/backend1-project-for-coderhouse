import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    services: [
      {
        service: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "services",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
          required: true,
        },
        _id: false,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const BookingModel = mongoose.model("bookings", bookingSchema);
