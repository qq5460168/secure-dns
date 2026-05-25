#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const vendorsConfigDir = path.join(__dirname, '..', 'vendors-config');

console.log('🔍 Watching vendors-config directory for changes...');
console.log('Press Ctrl+C to stop\n');

fs.watch(vendorsConfigDir, (eventType, filename) => {
  if (filename && filename.endsWith('.txt')) {
    console.log(`\n📝 Detected change in: ${filename}`);
    console.log('🔄 Running generate script...\n');
    
    try {
      execSync('node scripts/generate-profiles-from-txt.js', {
        stdio: 'inherit'
      });
      console.log('\n✅ Generation complete!\n');
    } catch (error) {
      console.error('\n❌ Generation failed!\n');
    }
  }
});
