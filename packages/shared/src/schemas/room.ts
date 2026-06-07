import z from 'zod';

export const RoomCreateInputSchema = z.object({
  name: z.string().trim().min(5, 'lobby.form.name.error'),
  count: z.enum(['4', '6', '8']),
});
