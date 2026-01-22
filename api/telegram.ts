
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim()));
const SERVICE_ACCOUNT_B64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;

function initFirebase() {
  if (!getApps().length && SERVICE_ACCOUNT_B64) {
    try {
      const jsonStr = Buffer.from(SERVICE_ACCOUNT_B64, 'base64').toString('utf-8');
      const serviceAccount = JSON.parse(jsonStr);
      initializeApp({ credential: cert(serviceAccount) });
    } catch (e) {
      console.error("Firebase Init Error:", e);
    }
  }
  return getFirestore();
}

const db = initFirebase();

async function tgCall(method: string, body: any) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const update = req.body;
  if (!update || !update.message) return res.status(200).send('OK');

  const { message } = update;
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text || '';

  if (message.chat.type === 'private') {
    if (text === '/start') {
      try {
        await db.collection('users').doc(userId.toString()).set({
          id: userId,
          first_name: message.from.first_name,
          username: message.from.username || null,
          startedAt: FieldValue.serverTimestamp()
        }, { merge: true });

        await tgCall('sendMessage', {
          chat_id: chatId,
          text: 'Welcome! Add me to a group as an admin to start filtering links.'
        });
      } catch (e) {}
    }
    return res.status(200).send('OK');
  }

  if (['group', 'supergroup'].includes(message.chat.type)) {
    if (!message.text || message.text.split(/\n/).length > 1) {
      return deleteAndWarn(chatId, userId, message.message_id);
    }

    const telegramLinkRegex = /^(https?:\/\/)?(t\.me\/|telegram\.me\/)(\+|joinchat\/)?([a-zA-Z0-9_]{5,}|[a-zA-Z0-9\+_-]+)$/i;
    if (!telegramLinkRegex.test(text.trim())) {
      return deleteAndWarn(chatId, userId, message.message_id);
    }
  }

  return res.status(200).send('OK');
}

async function deleteAndWarn(chatId: number, userId: number, messageId: number) {
  await tgCall('deleteMessage', { chat_id: chatId, message_id: messageId });
  await tgCall('sendMessage', {
    chat_id: chatId,
    text: `⚠️ Only single-line Telegram group/channel links are allowed.`,
    parse_mode: 'Markdown'
  });
  
  try {
    await db.collection('logs').add({
      chatId,
      userId,
      action: 'DELETED',
      timestamp: FieldValue.serverTimestamp()
    });
  } catch(e) {}
}
