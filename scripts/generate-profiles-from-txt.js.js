#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const vendorsConfigDir = path.join(__dirname, '..', 'vendors-config');
const profilesDir = path.join(__dirname, '..', 'profiles');

if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function parseVendorConfig(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const config = {};
  
  const lines = content.split('\n');
  let currentKey = null;
  let currentValue = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }
    
    if (trimmedLine.includes(':') && !trimmedLine.startsWith('  ')) {
      if (currentKey) {
        config[currentKey] = currentValue.join('\n').trim();
      }
      
      const colonIndex = trimmedLine.indexOf(':');
      const key = trimmedLine.substring(0, colonIndex).trim();
      const value = trimmedLine.substring(colonIndex + 1).trim();
      
      currentKey = key;
      currentValue = value ? [value] : [];
    } else if (currentKey && trimmedLine) {
      currentValue.push(trimmedLine);
    }
  }
  
  if (currentKey) {
    config[currentKey] = currentValue.join('\n').trim();
  }
  
  return config;
}

function validateConfig(config, fileName) {
  const required = ['供应商唯一标识符', '供应商名称', '详细描述'];
  
  for (const field of required) {
    if (!config[field] || config[field].trim() === '') {
      throw new Error(`Missing required field: ${field} in ${fileName}`);
    }
  }
  
  if (!config['DoH 链接'] && !config['DoT 链接']) {
    throw new Error(`Missing DoH or DoT configuration in ${fileName}`);
  }
}

function parseServers(dohConfig, dotConfig) {
  const servers = [];
  
  if (dohConfig) {
    const lines = dohConfig.split('\n').filter(l => l.trim());
    for (const line of lines) {
      if (line.trim().startsWith('https://') || line.trim().startsWith('http://')) {
        servers.push({
          protocol: 'HTTPS',
          url: line.trim()
        });
      }
    }
  }
  
  if (dotConfig) {
    const lines = dotConfig.split('\n').filter(l => l.trim());
    for (const line of lines) {
      if (!line.trim().startsWith('http')) {
        servers.push({
          protocol: 'TLS',
          hostname: line.trim()
        });
      }
    }
  }
  
  return servers;
}

function generateMobileConfig(config) {
  const vendorId = config['供应商唯一标识符'].trim();
  const vendorName = config['供应商名称'].trim();
  const description = config['详细描述'].trim();
  const parentUUID = generateUUID().toUpperCase();
  const dnsUUID = generateUUID().toUpperCase();
  
  const servers = parseServers(
    config['DoH 链接'],
    config['DoT 链接']
  );
  
  let serverEntries = '';
  for (const server of servers) {
    if (server.protocol === 'HTTPS') {
      serverEntries += `
        <dict>
          <key>DNSProtocol</key>
          <string>HTTPS</string>
          <key>ServerURL</key>
          <string>${escapeXml(server.url)}</string>
          <key>SupplementalMatchDomains</key>
          <array/>
        </dict>`;
    } else if (server.protocol === 'TLS') {
      serverEntries += `
        <dict>
          <key>DNSProtocol</key>
          <string>TLS</string>
          <key>ServerName</key>
          <string>${escapeXml(server.hostname)}</string>
          <key>SupplementalMatchDomains</key>
          <array/>
        </dict>`;
    }
  }
  
  const protocols = [...new Set(servers.map(s => s.protocol))];
  let protocolArray = '';
  for (const protocol of protocols) {
    protocolArray += `
          <string>${protocol}</string>`;
  }
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadContent</key>
  <array>
    <dict>
      <key>DNSSettings</key>
      <dict>
        <key>DNSProtocols</key>
        <array>${protocolArray}
        </array>
        <key>Servers</key>
        <array>${serverEntries}
        </array>
        <key>SupplementalMatchDomains</key>
        <array>
          <string>*</string>
        </array>
      </dict>
      <key>PayloadDescription</key>
      <string>${escapeXml(description)}</string>
      <key>PayloadDisplayName</key>
      <string>${escapeXml(vendorName)}</string>
      <key>PayloadIdentifier</key>
      <string>com.apple.dnsSettings.managed.${vendorId}</string>
      <key>PayloadType</key>
      <string>com.apple.dnsSettings.managed</string>
      <key>PayloadUUID</key>
      <string>${dnsUUID}</string>
      <key>PayloadVersion</key>
      <integer>1</integer>
    </dict>
  </array>
  <key>PayloadDescription</key>
  <string>${escapeXml(vendorName)} DNS Configuration</string>
  <key>PayloadDisplayName</key>
  <string>${escapeXml(vendorName)}</string>
  <key>PayloadIdentifier</key>
  <string>com.apple.dns.${vendorId}</string>
  <key>PayloadRemovalDisallowed</key>
  <false/>
  <key>PayloadScope</key>
  <string>System</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>${parentUUID}</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;
  
  return xml;
}

function main() {
  console.log('?? Generating DNS profiles from vendor configs...\n');
  
  if (!fs.existsSync(vendorsConfigDir)) {
    console.error('? vendors-config directory not found!');
    process.exit(1);
  }
  
  const files = fs.readdirSync(vendorsConfigDir)
    .filter(f => f.endsWith('.txt') && f !== 'TEMPLATE.txt');
  
  if (files.length === 0) {
    console.log('??  No vendor configuration files found.');
    return;
  }
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const filePath = path.join(vendorsConfigDir, file);
    const vendorId = path.basename(file, '.txt');
    const outputFile = path.join(profilesDir, `${vendorId}.mobileconfig`);
    
    try {
      console.log(`?? Processing: ${file}`);
      
      const config = parseVendorConfig(filePath);
      validateConfig(config, file);
      
      const mobileConfig = generateMobileConfig(config);
      fs.writeFileSync(outputFile, mobileConfig, 'utf8');
      
      console.log(`? Generated: ${vendorId}.mobileconfig\n`);
      successCount++;
    } catch (error) {
      console.error(`? Error processing ${file}: ${error.message}\n`);
      errorCount++;
    }
  }
  
  console.log(`\n?? Summary: ${successCount} succeeded, ${errorCount} failed`);
  
  if (errorCount > 0) {
    process.exit(1);
  }
}

main();