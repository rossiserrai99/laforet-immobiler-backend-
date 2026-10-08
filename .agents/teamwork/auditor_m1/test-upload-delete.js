const path = require('path');
const backendDir = path.resolve(__dirname, '../../../backend');
require('dotenv').config({ path: path.join(backendDir, '.env') });
const https = require('https');
const { uploadToImageKit, deleteFromImageKit, getAuthenticationParameters } = require(path.join(backendDir, 'src/config/imagekit'));

async function testUploadAndDelete() {
  console.log('Testing ImageKit live API methods (authentic implementation test)...');

  // Test 1: getAuthenticationParameters
  console.log('Test 1: Testing getAuthenticationParameters()...');
  const authParams = getAuthenticationParameters();
  console.log('Auth parameters received:', {
    hasToken: Boolean(authParams.token),
    hasExpire: Boolean(authParams.expire),
    hasSignature: Boolean(authParams.signature),
    tokenType: typeof authParams.token
  });

  if (!authParams.token || !authParams.expire || !authParams.signature) {
    throw new Error('getAuthenticationParameters failed to return complete signature object');
  }
  console.log('PASS: getAuthenticationParameters generated valid auth token/signature.');

  // Test 2: Live Upload to ImageKit
  console.log('\nTest 2: Testing uploadToImageKit with synthetic buffer...');
  // 1x1 transparent PNG buffer
  const samplePngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  );

  const testFileName = `audit_test_${Date.now()}.png`;
  const uploadResult = await uploadToImageKit(samplePngBuffer, testFileName, '/laforet_test_audit');
  console.log('Upload result received from ImageKit:', {
    fileId: uploadResult.fileId,
    name: uploadResult.name,
    url: uploadResult.url,
    filePath: uploadResult.filePath
  });

  if (!uploadResult.fileId || !uploadResult.url) {
    throw new Error('uploadToImageKit did not return fileId or url');
  }
  console.log('PASS: uploadToImageKit successfully uploaded buffer to ImageKit CDN.');

  // Test 3: Verify HTTP 200 on uploaded URL
  console.log('\nTest 3: Verifying HTTP 200 on new upload...');
  const httpStatus = await new Promise((resolve) => {
    https.get(uploadResult.url, (res) => {
      resolve(res.statusCode);
    }).on('error', () => resolve(500));
  });
  console.log(`HTTP Status for uploaded file: ${httpStatus}`);
  if (httpStatus !== 200) {
    throw new Error(`Uploaded file did not return HTTP 200, got ${httpStatus}`);
  }
  console.log('PASS: Uploaded file is accessible via CDN.');

  // Test 4: Delete from ImageKit
  console.log('\nTest 4: Testing deleteFromImageKit...');
  await deleteFromImageKit(uploadResult.fileId);
  console.log('Delete call completed.');

  console.log('\nALL AUTHENTIC IMPLEMENTATION TESTS PASSED!');
}

testUploadAndDelete().catch((err) => {
  console.error('FAIL during upload/delete test:', err);
  process.exit(1);
});
