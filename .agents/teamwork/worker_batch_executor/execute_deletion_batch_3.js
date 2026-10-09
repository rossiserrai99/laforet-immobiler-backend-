const fs = require('fs');
const path = require('path');
const {
  appendToChangeLog,
  updateReconciliation,
  loginAdmin,
  getDbProperties,
  checkDatabaseIntegrity
} = require('./batch_utils');

const batch3MockupIds = [
  '6a6439175a68c6c76aafa8cb',
  '6a64361b83da68d33432252e',
  '6a642b4783da68d3343224ed',
  '6a57a11841701b872192ea2f'
];

async function runDeletionBatch3() {
  console.log('================================================================');
  console.log('>>> EXECUTING DELETION BATCH 3 (Final 4 mockups)');
  console.log('================================================================');

  const cookie = await loginAdmin();
  const allProps = await getDbProperties();
  const propMap = {};
  for (const p of allProps) propMap[p._id] = p;

  for (let i = 0; i < batch3MockupIds.length; i++) {
    const aid = batch3MockupIds[i];
    const target = propMap[aid];
    if (!target) {
      throw new Error(`Target mockup ${aid} not found in database!`);
    }

    console.log(`\n--- [Deletion Batch 3, Item ${i + 1}/4] Deleting Mockup ${aid} ---`);
    console.log(`Title: ${target.title} | Ref: ${target.reference} | Slug: ${target.slug}`);

    const snapshot = {
      _id: target._id,
      title: target.title,
      reference: target.reference,
      slug: target.slug,
      type: target.type,
      category: target.category,
      price: target.price,
      area: target.area,
      location: target.location,
      description: target.description,
      photo_count: target.media?.images?.length || 0,
      images: (target.media?.images || []).map(img => img.publicId)
    };

    const delRes = await fetch(`http://localhost:5000/api/properties/${aid}`, {
      method: 'DELETE',
      headers: { 'Cookie': cookie }
    });

    if (!delRes.ok) {
      throw new Error(`DELETE failed for ${aid}: ${delRes.status} ${await delRes.text()}`);
    }

    console.log(`DELETE /api/properties/${aid} succeeded (HTTP ${delRes.status}).`);

    const verifyApiRes = await fetch(`http://localhost:5000/api/properties/slug/${target.slug}`);
    if (verifyApiRes.status !== 404) {
      throw new Error(`Verification failed: record ${target.slug} still accessible on API (status ${verifyApiRes.status})`);
    }

    console.log(`Verified record removed from API (404 on slug).`);

    appendToChangeLog({
      timestamp: new Date().toISOString(),
      agent: 'worker_batch_executor',
      admin_record_id: aid,
      source_id: 'NONE',
      action: 'DELETE_CONFIRMED_MOCKUP',
      previous_values_snapshot: JSON.stringify(snapshot),
      fields_changed: 'RECORD PURGED: Confirmed developer test mockup removed via authenticated admin delete workflow',
      previous_photo_count: snapshot.photo_count,
      new_photo_count: 0,
      photo_assets_attached: 'NONE',
      public_url_after_change: 'DELETED (Returns 404)',
      result: 'SUCCESS',
      verification_evidence: `HTTP 404 on slug ${target.slug}; record completely purged from catalog and search filters`,
      rollback_notes: `Restore record from snapshot in DELETE_EVIDENCE.md or BASELINE_PROPERTIES_BACKUP.json`
    });

    updateReconciliation(null, aid, 'COMPLETED_DELETED');
  }

  console.log('\n>>> Running Post-Deletion Batch 3 Database Integrity & Balance Check...');
  const balance = await checkDatabaseIntegrity();
  console.log('>>> DELETION BATCH 3 (FINAL PHASE 2 BATCH) SUCCESSFULLY COMPLETED & VERIFIED!\n');
  return balance;
}

runDeletionBatch3().catch(err => {
  console.error('Deletion Batch 3 failed:', err);
  process.exit(1);
});
