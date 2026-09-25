const axios = require('axios');
const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function runApiTests() {
  console.log('📡 Starting Weather Sentinel AI API Integration Tests...\n');

  try {
    // 1. Health check
    const health = await axios.get('http://localhost:5000/health');
    assert.strictEqual(health.status, 200);
    assert.strictEqual(health.data.status, 'healthy');
    console.log('  ✅ PASS: Server health endpoint operational');

    // 2. Login test
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'operator@weathersentinel.ai',
      password: 'Operator@123'
    });
    assert.strictEqual(loginRes.status, 200);
    assert.ok(loginRes.data.token, 'Must return JWT token');
    const token = loginRes.data.token;
    console.log('  ✅ PASS: Authentication & JWT token issuance');

    // 3. Station inventory test
    const stationsRes = await axios.get(`${BASE_URL}/stations`);
    assert.strictEqual(stationsRes.status, 200);
    assert.ok(stationsRes.data.data.length >= 25, 'Must contain 25 AWS stations');
    console.log(`  ✅ PASS: Station inventory returned ${stationsRes.data.data.length} AWS stations`);

    // 4. Primary Demo Station AWS-042 details
    const aws042Res = await axios.get(`${BASE_URL}/stations/AWS-042`);
    assert.strictEqual(aws042Res.status, 200);
    assert.strictEqual(aws042Res.data.data.station.stationId, 'AWS-042');
    assert.ok(aws042Res.data.data.profile, 'Must have learned station personality');
    console.log('  ✅ PASS: Station AWS-042 forensic metadata & personality loaded');

    // 5. Simulator injection test
    const injectRes = await axios.post(`${BASE_URL}/simulator/inject`, {
      stationId: 'AWS-042',
      anomalyType: 'TEMPERATURE_SPIKE'
    });
    assert.strictEqual(injectRes.status, 200);
    assert.strictEqual(injectRes.data.success, true);
    assert.ok(injectRes.data.pipelineResult.fusion, 'Must execute evidence fusion');
    console.log('  ✅ PASS: Anomaly simulator live injection & evidence fusion executed');

    // 6. Quarantine verification test
    const quarantineRes = await axios.get(`${BASE_URL}/quarantine`);
    assert.strictEqual(quarantineRes.status, 200);
    assert.ok(quarantineRes.data.data.length > 0, 'Quarantined observations must exist');
    console.log(`  ✅ PASS: Data quarantine holds ${quarantineRes.data.data.length} isolated records`);

    console.log('\n🎉 ALL API INTEGRATION TESTS PASSED SUCCESSFULLY (6/6)');
  } catch (err) {
    console.error('API Test Error:', err.response?.data || err.message);
    process.exit(1);
  }
}

runApiTests();
