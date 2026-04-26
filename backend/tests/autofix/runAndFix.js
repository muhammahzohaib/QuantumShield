const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const runTests = () => {
  try {
    const result = execSync('npm run test:server -- --json', {
      encoding: 'utf8',
      stdio: 'pipe'
    });
    return JSON.parse(result);
  } catch (error) {
    try {
        return JSON.parse(error.stdout);
    } catch (e) {
        return { output: error.stdout, error: error.message };
    }
  }
};

const fixes = {
  'Cannot find module': (file) => {
    console.log('Fix: Missing import detected in', file);
    console.log('Action: Check all import paths are correct');
  },

  'Expected 200 received 401': () => {
    console.log('Fix: Auth middleware blocking test request');
    console.log('Action: Ensure mock token is attached to all requests');
    const indexPath = path.resolve(__dirname, '../../index.js');
    if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, 'utf8');
        if (!content.includes('test-token-bypass')) {
          console.log('Suggestion: Add test environment bypass in auth middleware');
        }
    }
  },

  'Expected 400 received 200': (testName) => {
    console.log('Fix: Validation not rejecting bad input in:', testName);
    console.log('Action: Check express-validator rules in route handler');
  },

  'Expected 403 received 200': () => {
    console.log('Fix: Role guard not applied correctly');
    console.log('Action: Check verifyRole middleware is mounted on route');
  },

  'ECONNREFUSED': () => {
    console.log('Fix: Server not running during tests');
    console.log('Action: supertest should import app directly not connect to port');
  },

  'rate limit': () => {
    console.log('Fix: Rate limiter too strict for test environment');
    console.log('Action: Set NODE_ENV=test and skip rate limiting in test mode');
    const indexPath = path.resolve(__dirname, '../../index.js');
    if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath, 'utf8');
        if (!indexContent.includes("NODE_ENV === 'test'")) {
          const fix = `
if (process.env.NODE_ENV !== 'test') {
  app.use('/api/', globalLimiter)
  app.use('/api/engine1', engineLimiter)
  app.use('/api/engine2', engineLimiter)
  app.use('/api/engine3', engineLimiter)
}
          `;
          console.log('Suggested fix for index.js:');
          console.log(fix);
        }
    }
  }
};

console.log('Running QuantumShield QA Test Suite...');
const results = runTests();

console.log('Analyzing failures and suggesting fixes...');
const resultString = JSON.stringify(results);

let foundIssues = false;
Object.entries(fixes).forEach(([errorPattern, fixFn]) => {
  if (resultString.includes(errorPattern)) {
    console.log('\nIssue detected:', errorPattern);
    fixFn(errorPattern);
    foundIssues = true;
  }
});

if (!foundIssues) {
    if (results.success === true) {
        console.log('\n✨ All tests passed perfectly! No issues detected.');
    } else {
        console.log('\n⚠️ Tests failed, but no predefined fix pattern was matched.');
    }
}

console.log('\nQA Run Complete. Check above for fix suggestions.');
