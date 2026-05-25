const fs = require('fs');
const path = require('path');

// 配置目录路径
const CUSTOM_DNS_DIR = path.join(__dirname, 'dns-vendors');
const CORE_VENDORS_FILE = path.join(__dirname, 'vendors', 'vendors.json');

/**
 * 解析单个config.txt配置文件
 * @param {string} configPath config.txt路径
 * @returns {object} 解析后的供应商配置
 */
function parseConfigFile(configPath) {
  try {
    const content = fs.readFileSync(configPath, 'utf8');
    const config = {};
    // 按行解析
    content.split('\n').forEach(line => {
      line = line.trim();
      // 跳过注释和空行
      if (!line || line.startsWith('#')) return;
      const [key, ...valueArr] = line.split('=');
      if (!key || !valueArr.length) return;
      const value = valueArr.join('=').trim(); // 处理值包含=的情况
      config[key] = value;
    });
    // 校验必填字段
    const requiredFields = ['dot链接', 'doh链接', '供应商唯一标识符', '供应商名称'];
    const missingFields = requiredFields.filter(field => !config[field]);
    if (missingFields.length) {
      throw new Error(`缺失必填字段：${missingFields.join(', ')}`);
    }
    return config;
  } catch (err) {
    console.error(`解析配置文件 ${configPath} 失败：`, err.message);
    return null;
  }
}

/**
 * 加载所有自定义DNS供应商配置
 * @returns {array} 配置列表
 */
function loadCustomDnsVendors() {
  const vendors = [];
  // 检查自定义目录是否存在
  if (!fs.existsSync(CUSTOM_DNS_DIR)) {
    fs.mkdirSync(CUSTOM_DNS_DIR, { recursive: true });
    console.log(`已创建自定义DNS供应商目录：${CUSTOM_DNS_DIR}`);
    return vendors;
  }
  // 读取目录下的所有文件夹（每个文件夹对应一个供应商）
  const vendorFolders = fs.readdirSync(CUSTOM_DNS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  // 解析每个供应商的配置文件
  vendorFolders.forEach(folderName => {
    const configPath = path.join(CUSTOM_DNS_DIR, folderName, 'config.txt');
    if (!fs.existsSync(configPath)) {
      console.warn(`供应商文件夹 ${folderName} 中未找到config.txt配置文件`);
      return;
    }
    const vendorConfig = parseConfigFile(configPath);
    if (vendorConfig) {
      vendors.push(vendorConfig);
    }
  });

  return vendors;
}

/**
 * 合并自定义配置到核心vendors.json（可选：也可仅运行时加载，不写入文件）
 */
function mergeToCoreVendors() {
  const customVendors = loadCustomDnsVendors();
  if (customVendors.length === 0) return;

  // 读取核心配置文件
  let coreVendors = [];
  if (fs.existsSync(CORE_VENDORS_FILE)) {
    try {
      coreVendors = JSON.parse(fs.readFileSync(CORE_VENDORS_FILE, 'utf8')) || [];
    } catch (err) {
      console.error('读取核心vendors.json失败：', err.message);
      coreVendors = [];
    }
  }

  // 去重（按供应商唯一标识符）
  const vendorMap = new Map();
  // 先加核心配置
  coreVendors.forEach(vendor => {
    if (vendor['供应商唯一标识符']) {
      vendorMap.set(vendor['供应商唯一标识符'], vendor);
    }
  });
  // 再加自定义配置（覆盖同名标识符）
  customVendors.forEach(vendor => {
    vendorMap.set(vendor['供应商唯一标识符'], vendor);
  });
  // 转换回数组
  const mergedVendors = Array.from(vendorMap.values());

  // 写入核心配置文件
  try {
    fs.writeFileSync(
      CORE_VENDORS_FILE,
      JSON.stringify(mergedVendors, null, 2),
      'utf8'
    );
    console.log(`已合并 ${customVendors.length} 个自定义DNS供应商到核心配置`);
  } catch (err) {
    console.error('写入核心vendors.json失败：', err.message);
  }
}

// 示例：运行时加载（推荐，不修改核心文件）
const customDnsVendors = loadCustomDnsVendors();
console.log('加载的自定义DNS供应商：', customDnsVendors);

// 可选：合并到核心文件（如需持久化）
// mergeToCoreVendors();