// convex/leads.ts
import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import type { Lead } from '@/app/domain/Lead';

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    phone: v.string(),
    email: v.string(),
    message: v.string(),
    apartmentType: v.optional(
      v.array(v.union(v.literal('1+KK'), v.literal('2+KK'), v.literal('3+KK'), v.literal('4+KK')))
    ),
    newsletter: v.boolean(),
  },
  handler: async (ctx, args: Lead) => {
    await ctx.db.insert('leads', {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getByEmail = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('leads')
      .filter((q) => q.eq(q.field('email'), args.email))
      .order('desc')
      .first();
  },
});
