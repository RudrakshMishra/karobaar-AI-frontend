const { Webhook } = require('svix');
const prisma = require('../utils/db');

exports.clerkWebhook = async (req, res) => {
  const SIGNING_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!SIGNING_SECRET) {
    throw new Error('Error: Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env');
  }

  const wh = new Webhook(SIGNING_SECRET);
  const headers = req.headers;
  const payload = req.body; // Buffer from express.raw()

  const svix_id = headers['svix-id'];
  const svix_timestamp = headers['svix-timestamp'];
  const svix_signature = headers['svix-signature'];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ success: false, message: 'Missing svix headers' });
  }

  let evt;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { email_addresses, first_name, last_name } = evt.data;
    const email = email_addresses[0]?.email_address;
    const fullName = `${first_name || ''} ${last_name || ''}`.trim();

    try {
      await prisma.user.create({
        data: {
          clerk_id: id,
          email: email,
          full_name: fullName,
        }
      });
      console.log(`User ${id} synced to database.`);
    } catch (err) {
      console.error('Error syncing user:', err);
      // Don't fail the webhook if user already exists or other non-critical DB error
    }
  }

  if (eventType === 'user.deleted') {
    try {
      await prisma.user.deleteMany({
        where: { clerk_id: id }
      });
      console.log(`User ${id} removed from database.`);
    } catch (err) {
      console.error('Error removing user:', err);
    }
  }

  res.status(200).json({ success: true });
};
