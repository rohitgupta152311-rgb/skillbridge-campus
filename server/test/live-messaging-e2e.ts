import { io, Socket } from 'socket.io-client';

const BACKEND_URL = 'https://skillbridge-backend-15a7.onrender.com';
const API_URL = `${BACKEND_URL}/api/v1`;

async function main() {
  console.log('--- STARTING LIVE REAL-TIME MESSAGING VERIFICATION ---');
  console.log(`Backend Target: ${BACKEND_URL}`);

  const userAData = {
    email: 'live_test_alice@campus.edu',
    password: 'Password123!',
    fullName: 'Alice TestStudent',
    role: 'MENTEE',
    department: 'Computer Science',
    currentYear: '3rd Year',
    university: 'State University',
  };

  const userBData = {
    email: 'live_test_bob@campus.edu',
    password: 'Password123!',
    fullName: 'Bob TestMentor',
    role: 'MENTOR',
    department: 'Software Engineering',
    currentYear: 'Alumni',
    university: 'State University',
  };

  // Helper for auth (register or login)
  async function getAuthToken(userData: any): Promise<{ token: string; user: any }> {
    // Try register
    const regRes = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const regJson = await regRes.json();
    if (regRes.ok && regJson.data?.token) {
      return { token: regJson.data.token, user: regJson.data.user };
    }

    // If already exists, login
    const loginRes = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userData.email, password: userData.password }),
    });
    const loginJson = await loginRes.json();
    if (loginRes.ok && loginJson.data?.token) {
      return { token: loginJson.data.token, user: loginJson.data.user };
    }
    throw new Error(`Failed to authenticate ${userData.email}: ${JSON.stringify(loginJson)}`);
  }

  console.log('1. Authenticating Alice and Bob on live backend...');
  const [authA, authB] = await Promise.all([
    getAuthToken(userAData),
    getAuthToken(userBData),
  ]);

  console.log(`✓ Alice authenticated (User ID: ${authA.user.id})`);
  console.log(`✓ Bob authenticated (User ID: ${authB.user.id})`);

  console.log('\n2. Creating/retrieving direct conversation between Alice and Bob...');
  const convRes = await fetch(`${API_URL}/messages/conversations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authA.token}`,
    },
    body: JSON.stringify({ recipientId: authB.user.id }),
  });
  const convJson = await convRes.json();
  if (!convRes.ok || !convJson.data?.id) {
    throw new Error(`Failed to create/get conversation: ${JSON.stringify(convJson)}`);
  }
  const conversationId = convJson.data.id;
  console.log(`✓ Conversation established (ID: ${conversationId})`);

  console.log('\n3. Connecting WebSockets for Alice and Bob to live Socket.IO server...');
  const socketA = io(BACKEND_URL, {
    auth: { token: authA.token },
    transports: ['websocket', 'polling'],
  });

  const socketB = io(BACKEND_URL, {
    auth: { token: authB.token },
    transports: ['websocket', 'polling'],
  });

  await Promise.all([
    new Promise<void>((resolve, reject) => {
      socketA.on('connect', () => {
        console.log(`✓ Alice socket connected (Socket ID: ${socketA.id})`);
        resolve();
      });
      socketA.on('connect_error', reject);
    }),
    new Promise<void>((resolve, reject) => {
      socketB.on('connect', () => {
        console.log(`✓ Bob socket connected (Socket ID: ${socketB.id})`);
        resolve();
      });
      socketB.on('connect_error', reject);
    }),
  ]);

  console.log('\n4. Joining conversation room on both sockets...');
  socketA.emit('conversation:join', conversationId);
  socketB.emit('conversation:join', conversationId);
  await new Promise((r) => setTimeout(r, 600));

  const testMessageAtoB = `Live verification test: Hello Bob! [Timestamp: ${Date.now()}]`;
  console.log(`\n5. Alice -> Bob: Sending live message: "${testMessageAtoB}"`);

  const bobReceivedPromise = new Promise<any>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout: Bob did not receive message from Alice in 8s')), 8000);
    socketB.on('message:received', (msg) => {
      if (msg.content === testMessageAtoB) {
        clearTimeout(timeout);
        resolve(msg);
      }
    });
  });

  const startTimeAtoB = Date.now();
  socketA.emit('message:send', {
    conversationId,
    content: testMessageAtoB,
  });

  const receivedByBob = await bobReceivedPromise;
  const latencyAtoB = Date.now() - startTimeAtoB;
  console.log(`✓ Bob received message in ${latencyAtoB}ms!`);
  console.log(`  - Message DB ID: ${receivedByBob.id}`);
  console.log(`  - Sender ID match: ${receivedByBob.senderId === authA.user.id ? 'YES' : 'NO'}`);

  const testMessageBtoA = `Live verification response: Hey Alice, loud and clear! [Timestamp: ${Date.now()}]`;
  console.log(`\n6. Bob -> Alice: Sending live reply: "${testMessageBtoA}"`);

  const aliceReceivedPromise = new Promise<any>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Timeout: Alice did not receive reply from Bob in 8s')), 8000);
    socketA.on('message:received', (msg) => {
      if (msg.content === testMessageBtoA) {
        clearTimeout(timeout);
        resolve(msg);
      }
    });
  });

  const startTimeBtoA = Date.now();
  socketB.emit('message:send', {
    conversationId,
    content: testMessageBtoA,
  });

  const receivedByAlice = await aliceReceivedPromise;
  const latencyBtoA = Date.now() - startTimeBtoA;
  console.log(`✓ Alice received reply in ${latencyBtoA}ms!`);
  console.log(`  - Message DB ID: ${receivedByAlice.id}`);
  console.log(`  - Sender ID match: ${receivedByAlice.senderId === authB.user.id ? 'YES' : 'NO'}`);

  console.log('\n7. Verifying PostgreSQL persistence via REST API...');
  const historyRes = await fetch(`${API_URL}/messages/${conversationId}`, {
    headers: { Authorization: `Bearer ${authA.token}` },
  });
  const historyJson = await historyRes.json();
  const dbMessages = historyJson.data || [];
  const foundA = dbMessages.some((m: any) => m.content === testMessageAtoB);
  const foundB = dbMessages.some((m: any) => m.content === testMessageBtoA);

  console.log(`✓ Total persisted messages in conversation: ${dbMessages.length}`);
  console.log(`✓ Alice's message in PostgreSQL: ${foundA ? 'CONFIRMED' : 'MISSING'}`);
  console.log(`✓ Bob's reply in PostgreSQL: ${foundB ? 'CONFIRMED' : 'MISSING'}`);

  console.log('\n8. Cleaning up WebSocket connections...');
  socketA.disconnect();
  socketB.disconnect();

  if (foundA && foundB) {
    console.log('\n======================================================');
    console.log('>>> ALL REAL-TIME MESSAGING CHECKS PASSED 100% <<<');
    console.log('======================================================');
  } else {
    throw new Error('Verification failed: Messages were not found in database history.');
  }
}

main().catch((err) => {
  console.error('\n❌ Real-time messaging verification failed:', err);
  process.exit(1);
});
