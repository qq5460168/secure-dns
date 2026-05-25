import os

# ===================== 配置项（可根据你的仓库修改） =====================
INPUT_ROOT = "dns-providers"       # 供应商根目录
OUTPUT_FILENAME = "description.txt" # 要生成的描述文件名
# ======================================================================

def generate_description_from_metadata(provider_folder: str):
    """
    从 metadata.txt 读取内容，自动生成新描述文件
    """
    metadata_path = os.path.join(provider_folder, "metadata.txt")
    
    # 1. 检查文件是否存在
    if not os.path.exists(metadata_path):
        print(f"❌ 未找到 {metadata_path}")
        return

    # 2. 读取并解析 metadata.txt
    config = {}
    with open(metadata_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            # 跳过注释、空行
            if line.startswith("#") or not line:
                continue
            # 解析 键=值
            if "=" in line:
                key, value = line.split("=", 1)
                config[key.strip()] = value.strip()

    # 3. 取出需要的字段
    dot = config.get("dot链接", "")
    doh = config.get("doh链接", "")
    pid = config.get("供应商唯一标识符", "")
    name = config.get("供应商名称", "")
    desc = config.get("详细描述", "")

    # 4. 生成新的描述文件内容（你可以自定义格式）
    new_content = f"""# DNS 供应商描述文件
供应商ID = {pid}
供应商名称 = {name}
DOT = {dot}
DOH = {doh}
描述 = {desc}
"""

    # 5. 写入新文件
    output_path = os.path.join(provider_folder, OUTPUT_FILENAME)
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ 已生成：{output_path}")

def scan_all_providers():
    """
    扫描所有供应商，批量生成描述文件
    """
    if not os.path.exists(INPUT_ROOT):
        print(f"❌ 目录 {INPUT_ROOT} 不存在")
        return

    # 遍历每个供应商文件夹
    for folder_name in os.listdir(INPUT_ROOT):
        folder_path = os.path.join(INPUT_ROOT, folder_name)
        if os.path.isdir(folder_path):
            generate_description_from_metadata(folder_path)

    print("\n🎉 所有描述文件生成完成！")

if __name__ == "__main__":
    scan_all_providers()