const { Client } = require('pg');

const username = 'postgres.hkwehwrovblatcxplbwz';
const password = 'JHS&hgu3#&gfdgfdf';
const database = 'postgres';
const port = 6543;
const host = 'aws-0-ap-northeast-1.pooler.supabase.com';

async function run() {
  const client = new Client({
    host,
    port,
    user: username,
    password,
    database,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected to Supabase database!');

    // 1. Inspect packages columns
    const columnsRes = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'packages'
    `);
    console.log('Columns in public.packages table:', columnsRes.rows.map(c => `${c.column_name} (${c.data_type})`));

    // 2. Perform updates based on code
    console.log('Updating packages to the new Bangladesh pricing structure...');

    // A. Starter Plan (৳499) - code: Standard
    await client.query(`
      UPDATE public.packages 
      SET 
        name = 'Starter',
        price = '৳499 BDT',
        price_bdt = 499,
        duration_days = 30,
        device_limit = 1,
        popular_badge = false,
        display_order = 1,
        features = ARRAY[
          '1 WhatsApp Connection',
          'Live Chat Shared Team Inbox',
          'Contact Management & Tags',
          'Basic Dashboard Analytics',
          'Real-time Desktop Notifications',
          'Broadcast Limit: 1,000 Messages/day'
        ]
      WHERE code = 'Standard';
    `);

    // B. Premium Plan (৳799) - code: Premium
    await client.query(`
      UPDATE public.packages 
      SET 
        name = 'Premium',
        price = '৳799 BDT',
        price_bdt = 799,
        duration_days = 30,
        device_limit = 3,
        popular_badge = true,
        display_order = 2,
        features = ARRAY[
          'Everything in Starter',
          'Up to 3 WhatsApp Connections',
          'Unlimited Daily Broadcasts',
          'Visual Chatbot Flow Editor',
          'CRM Sales Pipelines & Deals',
          'Custom Webhooks Integration'
        ]
      WHERE code = 'Premium';
    `);

    // C. Enterprise Plan (৳999) - code: Enterprise
    await client.query(`
      UPDATE public.packages 
      SET 
        name = 'Enterprise',
        price = '৳999 BDT',
        price_bdt = 999,
        duration_days = 30,
        device_limit = 10,
        popular_badge = false,
        display_order = 3,
        features = ARRAY[
          'Everything in Premium',
          'Up to 10 WhatsApp Connections',
          'AI Reply Agents & Auto Chat',
          'Dynamic AI Knowledge Base (RAG)',
          'Round-Robin Chat Assignment',
          'Priority VIP 24/7 Support'
        ]
      WHERE code = 'Enterprise';
    `);

    console.log('Database updates completed successfully!');

    // 3. Verify final packages list
    const finalRes = await client.query('SELECT id, name, code, price, price_bdt, device_limit, allowed_submenus FROM public.packages ORDER BY display_order ASC');
    console.log('Final packages in DB:', finalRes.rows);

  } catch (err) {
    console.error('Error during inspection:', err.message);
  } finally {
    await client.end();
  }
}

run();

