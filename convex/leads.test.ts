import { convexTest } from 'convex-test';
import { expect, test, describe } from 'vitest';
import { api } from './_generated/api';
import type { ApartmentType } from '@/app/domain/ApartmentType';
import schema from './schema';
const modules = import.meta.glob('./**/*.ts');

describe('Convex Leads Backend', () => {
  test('should create a lead with all required fields', async () => {
    const t = convexTest(schema, modules);

    const leadData = {
      firstName: 'Jan',
      lastName: 'Novák',
      phone: '+420123456789',
      email: 'jan.novak@example.com',
      message: 'Mám zájem o byt 2+KK',
      apartmentType: ['2+KK'] as ApartmentType[],
      newsletter: true,
    };

    // Create a lead
    await t.mutation(api.leads.create, leadData);

    // Query all leads to verify it was created
    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({
      firstName: 'Jan',
      lastName: 'Novák',
      phone: '+420123456789',
      email: 'jan.novak@example.com',
      message: 'Mám zájem o byt 2+KK',
      apartmentType: ['2+KK'] as ApartmentType[],
      newsletter: true,
    });
    expect(leads[0].createdAt).toBeDefined();
    expect(typeof leads[0].createdAt).toBe('number');
  });

  test('should create a lead without apartment type (optional field)', async () => {
    const t = convexTest(schema, modules);

    const leadData = {
      firstName: 'Eva',
      lastName: 'Svobodová',
      phone: '987654321',
      email: 'eva@example.com',
      message: 'Chtěla bych více informací',
      apartmentType: [] as ApartmentType[],
      newsletter: false,
    };

    await t.mutation(api.leads.create, leadData);

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(1);
    expect(leads[0]).toMatchObject({
      firstName: 'Eva',
      lastName: 'Svobodová',
      phone: '987654321',
      email: 'eva@example.com',
      message: 'Chtěla bych více informací',
      newsletter: false,
    });
    expect(leads[0].apartmentType).toEqual([]);
  });

  test('should create a lead with multiple apartment types', async () => {
    const t = convexTest(schema, modules);

    const leadData = {
      firstName: 'Petr',
      lastName: 'Dvořák',
      phone: '+420777888999',
      email: 'petr.dvorak@example.com',
      message: 'Zajímám se o různé velikosti bytů',
      apartmentType: ['1+KK', '2+KK', '3+KK'] as ApartmentType[],
      newsletter: true,
    };

    await t.mutation(api.leads.create, leadData);

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(1);
    expect(leads[0].apartmentType).toEqual(['1+KK', '2+KK', '3+KK']);
  });

  test('should create multiple leads and maintain separate records', async () => {
    const t = convexTest(schema, modules);

    const lead1 = {
      firstName: 'Jan',
      lastName: 'Novák',
      phone: '111111111',
      email: 'jan@example.com',
      message: 'První dotaz',
      apartmentType: ['1+KK'] as ApartmentType[],
      newsletter: true,
    };

    const lead2 = {
      firstName: 'Marie',
      lastName: 'Procházková',
      phone: '222222222',
      email: 'marie@example.com',
      message: 'Druhý dotaz',
      apartmentType: ['4+KK'] as ApartmentType[],
      newsletter: false,
    };

    await t.mutation(api.leads.create, lead1);
    await t.mutation(api.leads.create, lead2);

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(2);
    expect(leads[0].firstName).toBe('Jan');
    expect(leads[1].firstName).toBe('Marie');
  });

  test('should store createdAt timestamp correctly', async () => {
    const t = convexTest(schema, modules);

    const beforeCreate = Date.now();

    await t.mutation(api.leads.create, {
      firstName: 'Test',
      lastName: 'User',
      phone: '123456789',
      email: 'test@example.com',
      message: 'Test message',
      newsletter: false,
      apartmentType: [] as ApartmentType[],
    });

    const afterCreate = Date.now();

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(1);
    expect(leads[0].createdAt).toBeGreaterThanOrEqual(beforeCreate);
    expect(leads[0].createdAt).toBeLessThanOrEqual(afterCreate);
  });

  test('should accept all valid apartment type values', async () => {
    const t = convexTest(schema, modules);

    const validTypes = ['1+KK', '2+KK', '3+KK', '4+KK'] as const;

    for (const type of validTypes) {
      await t.mutation(api.leads.create, {
        firstName: 'Test',
        lastName: 'User',
        phone: '123456789',
        email: `test-${type}@example.com`,
        message: `Interested in ${type}`,
        apartmentType: [type] as const,
        newsletter: false,
      });
    }

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(4);
    expect(leads[0].apartmentType).toEqual(['1+KK']);
    expect(leads[1].apartmentType).toEqual(['2+KK']);
    expect(leads[2].apartmentType).toEqual(['3+KK']);
    expect(leads[3].apartmentType).toEqual(['4+KK']);
  });

  test('should handle empty message', async () => {
    const t = convexTest(schema, modules);

    await t.mutation(api.leads.create, {
      firstName: 'Jan',
      lastName: 'Novák',
      phone: '123456789',
      email: 'jan@example.com',
      message: '',
      newsletter: false,
      apartmentType: [] as ApartmentType[],
    });

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(1);
    expect(leads[0].message).toBe('');
  });

  test('should handle newsletter subscription correctly', async () => {
    const t = convexTest(schema, modules);

    // Create lead with newsletter = true
    await t.mutation(api.leads.create, {
      firstName: 'Subscribed',
      lastName: 'User',
      phone: '111111111',
      email: 'subscribed@example.com',
      message: 'I want newsletter',
      newsletter: true,
      apartmentType: [] as ApartmentType[],
    });

    // Create lead with newsletter = false
    await t.mutation(api.leads.create, {
      firstName: 'Not Subscribed',
      lastName: 'User',
      phone: '222222222',
      email: 'not-subscribed@example.com',
      message: 'No newsletter please',
      newsletter: false,
      apartmentType: [] as ApartmentType[],
    });

    const leads = await t.run(async (ctx) => {
      return await ctx.db.query('leads').collect();
    });

    expect(leads).toHaveLength(2);
    expect(leads[0].newsletter).toBe(true);
    expect(leads[1].newsletter).toBe(false);
  });
});
