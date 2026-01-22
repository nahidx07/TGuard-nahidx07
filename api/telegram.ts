
/**
 * THIS FILE IS THE SERVER-SIDE LOGIC FOR THE BOT.
 * In a Next.js environment, this would be placed in /pages/api/telegram.ts or /app/api/telegram/route.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Environment variables configuration (Assume these exist on the deployment platform)
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').map(id => parseInt(id.trim()));
const SERVICE_ACCOUNT_B64 = process.env.FIREBASE_SERVICE_ACCOUNT_B64;

// Initialize Firebase
if (!getApps().length && SERVICE_ACCOUNT_B64) {
  // Use atob to decode the base64 service account string to avoid dependency on Node's Buffer global type
  const serviceAccount = JSON.parse(atob(SERVICE_ACCOUNT_B64));
  initializeApp({ credential: cert(serviceAccount) });
}
const db = getFirestore();

// Helper to call Telegram API
async function tgCall(method: string, body: any) {
  const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  return res.json();
}

// Main logic for moderation and commands
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const update = req.body;
  if (!update.message) return res.status(200).send('OK');

  const { message } = update;
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text || '';

  // 1. Check for Private Chat Commands
  if (message.chat.type === 'private') {
    if (text === '/start') {
      await db.collection('users').doc(userId.toString()).set({
        id: userId,
        first_name: message.from.first_name,
        last_name: message.from.last_name || null,
        username: message.from.username || null,
        startedAt: FieldValue.serverTimestamp()
      }, { merge: true });

      await tgCall('sendMessage', {
        chat_id: chatId,
        text: 'Welcome! I am a moderation bot. Add me to a group as an admin to start filtering links.'
      });
    }

    // Admin Broadcast Command: /broadcast <message>
    if (text.startsWith('/broadcast ') && ADMIN_IDS.includes(userId)) {
      const broadcastMsg = text.replace('/broadcast ', '').trim();
      const snapshot = await db.collection('users').get();
      
      let count = 0;
      for (const doc of snapshot.docs) {
        try {
          await tgCall('sendMessage', { chat_id: doc.id, text: broadcastMsg });
          count++;
        } catch (e) { /* user blocked bot */ }
      }
      
      await tgCall('sendMessage', {
        chat_id: chatId,
        text: `Broadcast sent to ${count} users.`
      });
    }

    return res.status(200).send('OK');
  }

  // 2. Group Moderation Logic
  if (['group', 'supergroup', 'channel'].includes(message.chat.type)) {
    // Skip if it's an admin (optional, depending on requirements)
    // const member = await tgCall('getChatMember', { chat_id: chatId, user_id: userId });
    // if (['administrator', 'creator'].includes(member.result?.status)) return res.status(200).send('OK');

    // Rule 1: Must be text only
    if (!message.text) {
      return deleteAndWarn(chatId, userId, message.message_id);
    }

    // Rule 2: Single line only
    const lines = text.trim().split(/\r?\n/);
    if (lines.length > 1) {
      return deleteAndWarn(chatId, userId, message.message_id);
    }

    // Rule 3: Valid single link format
    const trimmed = text.trim();
    const telegramLinkRegex = /^(https?:\/\/)?(t\.me\/|telegram\.me\/)(\+|joinchat\/)?([a-zA-Z0-9_]{5,}|[a-zA-Z0-9\+_-]+)$/i;
    
    // Check if it's exactly one link and nothing else
    if (!telegramLinkRegex.test(trimmed)) {
      return deleteAndWarn(chatId, userId, message.message_id);
    }

    // Rule 4: Deep verification if it's a username link (not invite)
    const match = trimmed.match(/(?:t\.me\/|telegram\.me\/)([a-zA-Z0-9_]{5,})$/i);
    if (match && !trimmed.includes('/+') && !trimmed.includes('/joinchat/')) {
      const username = match[1];
      const chatInfo = await tgCall('getChat', { chat_id: `@${username}` });
      
      // Allow only groups or channels
      if (!chatInfo.ok || !['group', 'supergroup', 'channel'].includes(chatInfo.result.type)) {
        return deleteAndWarn(chatId, userId, message.message_id);
      }
    }

    // If we passed all checks, allow the message
    return res.status(200).send('OK');
  }

  return res.status(200).send('OK');
}

async function deleteAndWarn(chatId: number, userId: number, messageId: number) {
  // Delete original message
  await tgCall('deleteMessage', { chat_id: chatId, message_id: messageId });
  
  // Send warning
  const userRef = `[User](tg://user?id=${userId})`;
  await tgCall('sendMessage', {
    chat_id: chatId,
    text: `⚠️ Only Telegram group/channel links are allowed (one link per line).`,
    parse_mode: 'Markdown'
  });
  
  // (Optional) Log to DB for dashboard monitoring
  try {
    await db.collection('logs').add({
      chatId,
      userId,
      action: 'DELETED',
      timestamp: FieldValue.serverTimestamp()
    });
  } catch(e) {}
}
