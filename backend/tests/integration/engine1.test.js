const request = require('supertest');
const app = require('../../index.js');

const authHeader = { 
  Authorization: 'Bearer mock-token-xyz' 
};

// Mock the Firebase admin verifyIdToken in every test file
jest.mock('../../firebase/admin.js', () => ({
  adminAuth: {
    verifyIdToken: jest.fn().mockResolvedValue({
      uid: 'test-uid-123',
      email: 'test@quantumshield.com',
      email_verified: true
    })
  },
  admin: {
    firestore: () => ({
      collection: () => ({
        doc: () => ({
          get: jest.fn().mockResolvedValue({
            exists: true,
            data: () => ({ role: 'enterprise' })
          })
        })
      })
    })
  }
}));

describe('Engine 1 - Quantum Encryption API', () => {

  describe('POST /api/engine1/encrypt', () => {
    
    test('TC-E1-01: should encrypt valid text and return 200', async () => {
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({ text: 'Hello QuantumShield' });
      
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('encrypted');
      expect(res.body).toHaveProperty('key');
      expect(res.body).toHaveProperty('algorithm', 'CRYSTALS-Kyber-768');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body.encrypted).not.toBe('Hello QuantumShield');
    });

    test('TC-E1-02: should return 400 when text is empty', async () => {
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({ text: '' });
      
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    test('TC-E1-03: should return 400 when text field missing', async () => {
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({});
      
      expect(res.status).toBe(400);
    });

    test('TC-E1-04: should return 401 when no auth token', async () => {
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .send({ text: 'test' });
      
      expect(res.status).toBe(401);
    });

    test('TC-E1-05: should handle very long text input', async () => {
      const longText = 'A'.repeat(10000);
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({ text: longText });
      
      expect(res.status).toBe(200);
      expect(res.body.encrypted).toBeDefined();
    });

    test('TC-E1-06: should handle special characters and unicode', async () => {
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({ text: '!@#$%^&*() اردو 中文 emoji 🔐' });
      
      expect(res.status).toBe(200);
    });

    test('TC-E1-07: encrypted output should be different every call', async () => {
      const payload = { text: 'same text' };
      const res1 = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader).send(payload);
      const res2 = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader).send(payload);
      
      expect(res1.body.encrypted).not.toBe(res2.body.encrypted);
    });

    test('TC-E1-08: response should include SHA-256 checksum', async () => {
      const res = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({ text: 'integrity test' });
      
      expect(res.body).toHaveProperty('checksum');
      expect(res.body.checksum).toMatch(/^[a-f0-9]{64}$/);
    });
  });

  describe('POST /api/engine1/decrypt', () => {

    test('TC-E1-09: should decrypt and return original text', async () => {
      const encryptRes = await request(app)
        .post('/api/engine1/encrypt')
        .set(authHeader)
        .send({ text: 'Decrypt me correctly' });
      
      const decryptRes = await request(app)
        .post('/api/engine1/decrypt')
        .set(authHeader)
        .send({
          encrypted: encryptRes.body.encrypted,
          key: encryptRes.body.key
        });
      
      expect(decryptRes.status).toBe(200);
      expect(decryptRes.body.decrypted).toBe('Decrypt me correctly');
    });

    test('TC-E1-10: should return 400 with wrong key', async () => {
      const res = await request(app)
        .post('/api/engine1/decrypt')
        .set(authHeader)
        .send({ encrypted: 'abc123', key: 'wrongkey' });
      
      expect(res.status).toBe(400);
    });

    test('TC-E1-11: should return 400 with missing fields', async () => {
      const res = await request(app)
        .post('/api/engine1/decrypt')
        .set(authHeader)
        .send({ encrypted: 'abc123' });
      
      expect(res.status).toBe(400);
    });
  });
});
