// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  leads: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    email: v.string(),
    message: v.string(),
    apartmentType: v.optional(
      v.array(v.union(v.literal('1+KK'), v.literal('2+KK'), v.literal('3+KK'), v.literal('4+KK')))
    ),
    newsletter: v.boolean(),
    createdAt: v.number(),
  }).index('by_createdAt', ['createdAt']),
});
