const request = require('supertest');
const app = require('../../index.js');

const authHeader = { 
  Authorization: 'Bearer mock-token-xyz' 
};

// Mock the Firebase admin verifyIdToken
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
            data: () => ({ role: 'pro' })
          })
        })
      })
    })
  }
}));

describe('Engine 3 - Anti-AI Scraping Shield API', () => {

  test('TC-E3-01: should return shielded text with 200', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-text')
      .set(authHeader)
      .send({ text: 'This is my article content to protect' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('original');
    expect(res.body).toHaveProperty('shielded');
    expect(res.body).toHaveProperty('protectionScore');
    expect(res.body).toHaveProperty('perturbationsCount');
  });

  test('TC-E3-02: shielded text should look similar but not identical', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-text')
      .set(authHeader)
      .send({ text: 'protect this content from AI scrapers' });
    
    expect(res.body.shielded).not.toBe(res.body.original);
    expect(res.body.shielded.length).toBeGreaterThan(0);
  });

  test('TC-E3-03: protection score should be between 0 and 100', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-text')
      .set(authHeader)
      .send({ text: 'test content' });
    
    expect(res.body.protectionScore).toBeGreaterThanOrEqual(0);
    expect(res.body.protectionScore).toBeLessThanOrEqual(100);
  });

  test('TC-E3-04: should block SSRF attempt in shield-url', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-url')
      .set(authHeader)
      .send({ url: 'http://localhost:3000/admin' });
    
    expect(res.status).toBe(403);
    expect(res.body.error).toContain('SSRF');
  });

  test('TC-E3-05: should block private IP in shield-url', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-url')
      .set(authHeader)
      .send({ url: 'http://192.168.1.1/data' });
    
    expect(res.status).toBe(403);
  });

  test('TC-E3-06: should accept valid public URL', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-url')
      .set(authHeader)
      .send({ url: 'https://example.com' });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('headers');
    expect(res.body).toHaveProperty('robotsTxt');
  });

  test('TC-E3-07: should reject empty text', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-text')
      .set(authHeader)
      .send({ text: '' });
    
    expect(res.status).toBe(400);
  });

  test('TC-E3-08: should reject invalid URL format', async () => {
    const res = await request(app)
      .post('/api/engine3/shield-url')
      .set(authHeader)
      .send({ url: 'not-a-url' });
    
    expect(res.status).toBe(400);
  });
});
