#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""根据仓库根目录的 dns.txt 重新生成 profiles/多个DNS.mobileconfig。

dns.txt 每行格式（空格分隔）：  名称 DoH/DoT 地址
  - DoH 地址填完整 https URL
  - DoT 地址填域名即可，默认 853 端口（也可写 域名:端口）
  - 以 # 开头或空行忽略

每个节点的 PayloadUUID 由「名称|协议|地址」确定性生成（uuid5），
这样同一个节点多次重建 UUID 不变，iOS 不会当成新配置重复安装。

用法：python scripts/build_profiles.py
"""
import os
import uuid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "dns.txt")
OUT = os.path.join(ROOT, "profiles", "多个DNS.mobileconfig")

OUTER_UUID = "e63b30e4-dadb-4005-bfcf-c9ff40e434ef"
OUTER_ID = "660db1b9-de9c-48bb-bb46-a64d827d9a40"
NS = uuid.UUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")  # DNS 命名空间


def parse_line(line):
    line = line.strip()
    if not line or line.startswith("#"):
        return None
    parts = line.split()
    # 找到 DoH / DoT 所在的位置：前面是名称（可含空格），后面是地址
    proto_idx = None
    for i, p in enumerate(parts):
        if p.upper() in ("DOH", "DOT"):
            proto_idx = i
            break
    if proto_idx is None or proto_idx < 1 or proto_idx >= len(parts) - 1:
        return None
    name = " ".join(parts[:proto_idx])
    proto = parts[proto_idx].upper()
    addr = " ".join(parts[proto_idx + 1:])
    return name, proto, addr


def inner_payload(name, proto, addr):
    # DoT 未写端口时补 853，保持与历史 UUID 种子一致
    if proto != "DOH" and ":" not in addr:
        addr = addr + ":853"
    ident = "{}|{}|{}".format(name, proto, addr)
    u = str(uuid.uuid5(NS, ident))
    out = []
    out.append("      <!-- {} -->".format(name))
    out.append("      <dict>")
    out.append("        <key>DNSSettings</key>")
    out.append("        <dict>")
    if proto == "DOH":
        out.append("          <key>DNSProtocol</key>")
        out.append("          <string>HTTPS</string>")
        out.append("          <key>ServerURL</key>")
        out.append("          <string>{}</string>".format(addr))
    else:
        host, _, port = addr.partition(":")
        port = port or "853"
        out.append("          <key>DNSProtocol</key>")
        out.append("          <string>TLS</string>")
        out.append("          <key>ServerName</key>")
        out.append("          <string>{}</string>".format(host))
        out.append("          <key>ServerPort</key>")
        out.append("          <integer>{}</integer>".format(port))
    out.append("          <key>ProxiesAllowed</key>")
    out.append("          <true/>")
    out.append("        </dict>")
    out.append("        <key>PayloadDescription</key>")
    out.append("        <string>{} 加密DNS</string>".format(name))
    out.append("        <key>PayloadDisplayName</key>")
    out.append("        <string>{}</string>".format(name))
    out.append("        <key>PayloadIdentifier</key>")
    out.append("        <string>com.apple.dnsSettings.managed.{}</string>".format(u))
    out.append("        <key>PayloadType</key>")
    out.append("        <string>com.apple.dnsSettings.managed</string>")
    out.append("        <key>PayloadUUID</key>")
    out.append("        <string>{}</string>".format(u))
    out.append("        <key>PayloadVersion</key>")
    out.append("        <integer>1</integer>")
    out.append("      </dict>")
    return "\n".join(out)


def main():
    entries = []
    with open(SRC, encoding="utf-8") as f:
        for line in f:
            p = parse_line(line)
            if p:
                entries.append(p)
    bodies = "\n".join(inner_payload(*e) for e in entries)
    plist = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n'
        '<plist version="1.0">\n'
        "  <dict>\n"
        "    <key>PayloadContent</key>\n"
        "    <array>\n"
        "{bodies}\n"
        "    </array>\n"
        "    <key>PayloadDescription</key>\n"
        "    <string>多组DoH/DoT加密DNS解析配置，兼容WiFi/蜂窝网络</string>\n"
        "    <key>PayloadDisplayName</key>\n"
        "    <string>加密DNS合集</string>\n"
        "    <key>PayloadIdentifier</key>\n"
        "    <string>{outer_id}</string>\n"
        "    <key>PayloadRemovalDisallowed</key>\n"
        "    <false/>\n"
        "    <key>PayloadType</key>\n"
        "    <string>Configuration</string>\n"
        "    <key>PayloadUUID</key>\n"
        "    <string>{outer_uuid}</string>\n"
        "    <key>PayloadVersion</key>\n"
        "    <integer>1</integer>\n"
        "  </dict>\n"
        "</plist>\n"
    ).format(bodies=bodies, outer_id=OUTER_ID, outer_uuid=OUTER_UUID)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(plist)
    print("wrote {} with {} resolvers".format(OUT, len(entries)))


if __name__ == "__main__":
    main()
