import { z } from "zod";

/** Appointment request. Kept lenient on purpose — a lead is worth more than a tidy record. */
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a phone number we can reach you at.")
    .max(30),
  email: z.string().trim().pipe(z.email("Please enter a valid email address.")).or(z.literal("")),
  vehicleMake: z.string().trim().min(1, "Vehicle make is required.").max(60),
  vehicleModel: z.string().trim().min(1, "Vehicle model is required.").max(60),
  serviceNeeded: z.string().trim().min(1, "Please choose a service.").max(120),
  preferredDate: z.string().trim().max(20),
  comments: z.string().trim().max(2000, "Please keep comments under 2000 characters."),
});
