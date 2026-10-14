[<kbd>**`* 简体中文 *`**</kbd>](https://github.com/francis-zhao/secure-dns#readme) | [<kbd>繁體中文</kbd>](https://github.com/francis-zhao/secure-dns/blob/master/README.cmn-TW.md) | [<kbd>English</kbd>](https://github.com/francis-zhao/secure-dns/blob/master/README.en.md)

# 安全 DNS

## 简介

此仓库是 [paulmillr/encrypted-dns](https://github.com/paulmillr/encrypted-dns) 的一个分支，主要存放了用于苹果设备的 [DNS over HTTPS (DoH)](https://zh.wikipedia.org/wiki/DNS_over_HTTPS) 和 [DNS over TLS (DoT)](https://zh.wikipedia.org/wiki/DNS_over_TLS) 配置描述文件。

相比原仓库，此分支的所有描述文件均重新分配了独立的 UUID，且将同一供应商的所有 DoH 和 DoT 配置集成在一个文件中，可以更方便地在系统设置中随时切换和管理。

### 注意事项

根据谷歌[这篇文章](https://security.googleblog.com/2022/07/dns-over-http3-in-android.html)的介绍，在支持 HTTP/3 的设备上，DNS over HTTP/3 (DoH3) 比 DoT 的性能更优。

从 iOS 和 iPadOS 15.5 开始，为了简化咖啡厅、宾馆、机场等公共场所无线网络的身份认证，苹果将这些无线网络的[强制登录门户](https://zh.wikipedia.org/wiki/%E5%BC%BA%E5%88%B6%E9%97%A8%E6%88%B7)加入到了加密 DNS 排除规则中。这是个好消息，但还有一些其他问题我们无法修复，只有等苹果来解决：

- 无法启用加密 DNS：[Little Snitch & Lulu](https://github.com/paulmillr/encrypted-dns/issues/13)、[VPN](https://github.com/paulmillr/encrypted-dns/issues/18)
- 部分流量绕过加密 DNS：[终端和 App Store](https://github.com/paulmillr/encrypted-dns/issues/22)、[Chrome 浏览器](https://github.com/paulmillr/encrypted-dns/issues/19)

如果你需要更进一步的隐私保护，请查看[使用 Tor 网络的加密 DNS](https://github.com/alecmuffett/dohot)。

## 供应商

“`审查=是`”表示描述文件不会发送某些主机“`主机名=IP`”关系的真实信息。

| 名称                                             | 区域  | 审查 | 备注                                                               | 安装链接                            |
| ------------------------------------------------ | ----- | ---- | ------------------------------------------------------------------ | ----------------------------------- |
| [360 安全 DNS][360-security-dns]                 | 🇨🇳    | 是   | 由 360 数字安全集团运营                                            | [DoH/DoT][360-security-dns-profile] |
| [AdGuard DNS 默认][adguard-dns-default]          | 🇷🇺    | 是   | 由 AdGuard 运营，拦截广告、跟踪器和钓鱼网站                        | [DoH/DoT][adguard-dns-profile]      |
| [AdGuard DNS 家庭保护][adguard-dns-family]       | 🇷🇺    | 是   | 由 AdGuard 运营，除默认规则外，额外拦截恶意软件和成人内容          | [DoH/DoT][adguard-dns-profile]      |
| [AdGuard DNS 无过滤][adguard-dns-unfiltered]     | 🇷🇺    | 否   | 由 AdGuard 运营，无过滤                                            | [DoH/DoT][adguard-dns-profile]      |
| [Alekberg 加密 DNS][alekberg-dns]                | 🇳🇱    | 否   | 由个人提供                                                         | [DoH][alekberg-dns-profile]         |
| [阿里云公共 DNS][aliyun-dns]                     | 🇨🇳    | 否   | 由阿里云计算运营                                                   | [DoH/DoT][aliyun-dns-profile]       |
| [BlahDNS CDN 过滤][blahdns]                      | 🇺🇸    | 是   | 由个人提供，拦截广告、跟踪器和恶意软件                             | [DoH/DoT][blahdns-profile]          |
| [BlahDNS CDN 无过滤][blahdns]                    | 🇺🇸    | 否   | 由个人提供，无过滤                                                 | [DoH/DoT][blahdns-profile]          |
| [BlahDNS 芬兰][blahdns]                          | 🇫🇮    | 是   | 由个人提供，拦截广告、跟踪器和恶意软件                             | [DoH/DoT][blahdns-profile]          |
| [BlahDNS 德国][blahdns]                          | 🇩🇪    | 是   | 由个人提供，拦截广告、跟踪器和恶意软件                             | [DoH/DoT][blahdns-profile]          |
| [BlahDNS 日本][blahdns]                          | 🇯🇵    | 是   | 由个人提供，拦截广告、跟踪器和恶意软件                             | [DoH/DoT][blahdns-profile]          |
| [BlahDNS 新加坡][blahdns]                        | 🇸🇬    | 是   | 由个人提供，拦截广告、跟踪器和恶意软件                             | [DoH/DoT][blahdns-profile]          |
| [BlahDNS 瑞士][blahdns]                          | 🇨🇭    | 是   | 由个人提供，拦截广告、跟踪器和恶意软件                             | [DoH/DoT][blahdns-profile]          |
| [Canadian Shield 隐私][canadian-shield]          | 🇨🇦    | 否   | 由加拿大互联网注册局 (CIRA) 运营                                   | [DoH/DoT][canadian-shield-profile]  |
| [Canadian Shield 保护][canadian-shield]          | 🇨🇦    | 是   | 由加拿大互联网注册局 (CIRA) 运营，拦截恶意软件和钓鱼网站           | [DoH/DoT][canadian-shield-profile]  |
| [Canadian Shield 家庭][canadian-shield]          | 🇨🇦    | 是   | 由加拿大互联网注册局 (CIRA) 运营，拦截恶意软件、钓鱼网站和成人内容 | [DoH/DoT][canadian-shield-profile]  |
| [Cloudflare 1.1.1.1][cloudflare-dns]             | 🇺🇸    | 否   | 由 Cloudflare 运营                                                 | [DoH/DoT][cloudflare-dns-profile]   |
| [Cloudflare 1.1.1.1 安全][cloudflare-dns-family] | 🇺🇸    | 是   | 由 Cloudflare 运营，拦截恶意软件和钓鱼网站                         | [DoH/DoT][cloudflare-dns-profile]   |
| [Cloudflare 1.1.1.1 家庭][cloudflare-dns-family] | 🇺🇸    | 是   | 由 Cloudflare 运营，拦截恶意软件、钓鱼网站和成人内容               | [DoH/DoT][cloudflare-dns-profile]   |
| [DNSPod 公共 DNS][dnspod-dns]                    | 🇨🇳    | 否   | 由腾讯云计算旗下 DNSPod 运营                                       | [DoH/DoT][dnspod-dns-profile]       |
| [谷歌公共 DNS][google-dns]                       | 🇺🇸    | 否   | 由谷歌运营                                                         | [DoH/DoT][google-dns-profile]       |
| [keweonDNS][keweondns]                           | 🇩🇪    | 否   | 由 Aviontex. 拦截广告和跟踪器                                      | [DoH/DoT][keweondns-profile]        |
| [Mullvad DNS][mullvad-dns]                       | 🇸🇪    | 是   | 由 Mullvad VPN 运营                                                | [DoH/DoT][mullvad-dns-profile]      |
| [Mullvad DNS 广告过滤][mullvad-dns]              | 🇸🇪    | 是   | 由 Mullvad VPN 运营，拦截广告和跟踪器                              | [DoH/DoT][mullvad-dns-profile]      |
| [NextDNS][nextdns]                               | 🇺🇸    | 否   | 由 NextDNS 运营，可自定义拦截                                      | [DoH/DoT][nextdns-profile]          |
| [OpenDNS 标准][opendns]                          | 🇺🇸    | 否   | 由思科 OpenDNS 运营                                                | [DoH][opendns-profile]              |
| [OpenDNS 家庭防护][opendns]                      | 🇺🇸    | 是   | 由思科 OpenDNS 运营，拦截恶意软件和成人内容                        | [DoH][opendns-profile]              |
| [Quad9][quad9-dns]                               | 🇨🇭    | 是   | 由 Quad9 基金会运营，拦截恶意软件                                  | [DoH/DoT][quad9-dns-profile]        |
| [Quad9 ECS][quad9-dns]                           | 🇨🇭    | 是   | 由 Quad9 基金会运营，支持 ECS，拦截恶意软件                        | [DoH/DoT][quad9-dns-profile]        |
| [Quad101][quad101-dns]                           | 🇹🇼    | 否   | 由台湾网络资讯中心 (TWNIC) 运营                                    | [DoH/DoT][quad101-dns-profile]      |
| [Tiarap][tiarap-dns]                             | 🇸🇬 🇺🇸 | 是   | 由 Tiarap 运营，拦截广告、跟踪器、钓鱼网站和恶意软件               | [DoH/DoT][tiarap-dns-profile]       |
| [我的加密DNS合集][personal-dns]                  | 🇨🇳    | 否   | 个人常用 DoH/DoT 合集（19 条线路，含去广告节点）                  | [DoH/DoT][personal-dns-profile]      |

## 安装

要使设置在 **iOS**、**iPadOS** 和 **macOS** 中所有的应用程序上生效，你需要安装配置描述文件。此文件将指引操作系统使用 DoH 或 DoT。注意：只在系统无线局域网设置中设置 DNS 服务器 IP 是不够的——你需要安装描述文件。

iOS / iPadOS：使用 Safari 浏览器（其他浏览器只会下载该文件，不会弹出安装提示）打开 GitHub 上的 mobileconfig 文件，然后点击“允许”按钮，描述文件将完成下载。打开 **系统设置 => 通用 => VPN、DNS 与设备管理**，选择已下载的描述文件并点击“安装”按钮。

macOS [（官方文档）](https://support.apple.com/zh-cn/guide/mac-help/mh35561/)：

1. 下载并保存描述文件，将其重命名为 `NAME.mobileconfig`，而不是 txt 之类的扩展名。
2. 选取苹果菜单 >“系统设置”，点按边栏中的“隐私和安全性” ，然后点按右侧的“描述文件”。（你可能需要向下滚动。）
   安装期间，系统可能会要求你提供密码或其他信息。
3. 在“已下载”部分中，连按描述文件。
4. 检查描述文件内容，然后点按“继续”、“安装”或“注册”以安装描述文件。

   如果 Mac 上已安装了较早版本的描述文件，其设置将替换为更新版本中的设置。

## 生效范围

目前所有的描述文件都被配置为系统全局范围生效，如果你想尝试用户范围生效，请将描述文件中下面两行内容删除，或将 `System` 改为 `User`。

```xml
<key>PayloadScope</key>
<string>System</string>
```

## 签名版描述文件

目前没有提供任何签名版的描述文件，如果你对描述文件安装界面的绿色签名认证图标有执念，可以考虑前往[这里](https://github.com/paulmillr/encrypted-dns/tree/master/signed)下载由 [@Candygoblen123](https://github.com/Candygoblen123) 提供的签名版描述文件，但内容可能会更新不及时。

如要验证 DNS 解析器的 IP 和主机名，请将描述文件内容与其官方网站的文档进行比对，描述文件内部结构和属性在[苹果开发者网站](https://developer.apple.com/documentation/devicemanagement/dnssettings)上有详细讲解。如要验证签名版的描述文件，请将其下载到本地后用文本编辑器打开，因为 GitHub 会将签名版描述文件视为二进制文件而无法直接查看。

## 创建新描述文件

你可以使用这个[工具](https://dns.notjakob.com/tool.html)在线创建你自己的描述文件。

描述文件本质上是 XML 文本文件，如果你有兴趣提交新的描述文件，将现有的描述文件复制一份并修改其 UUID 即可，请确保在本 README 文件中更新描述文件的相关信息。

随机 UUID 除了可以通过网站在线生成，还有很多其他获取方法：

- 在浏览器中按下 `F12` 打开“开发人员工具”，在控制台中运行这段代码

```javascript
crypto.randomUUID();
```

- 在 macOS / Linux 终端中运行此命令

```sh
# 适用于 macOS 和 Linux
uuidgen

# 适用于 Linux
cat /proc/sys/kernel/random/uuid
```

- 在 Powershell 中运行此命令

```powershell
New-Guid
```

[360-security-dns]: https://sdns.360.net/dnsPublic.html
[360-security-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/360-security-dns.mobileconfig
[adguard-dns-default]: https://adguard-dns.io/kb/general/dns-providers/#default
[adguard-dns-family]: https://adguard-dns.io/kb/general/dns-providers/#family-protection
[adguard-dns-unfiltered]: https://adguard-dns.io/kb/general/dns-providers/#non-filtering
[adguard-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/adguard-dns.mobileconfig
[alekberg-dns]: https://alekberg.net
[alekberg-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/alekberg-dns.mobileconfig
[aliyun-dns]: https://www.alidns.com/
[aliyun-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/aliyun-dns.mobileconfig
[blahdns]: https://blahdns.com/
[blahdns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/blahdns.mobileconfig
[canadian-shield]: https://www.cira.ca/cybersecurity-services/canadian-shield/configure/summary-cira-canadian-shield-dns-resolver-addresses
[canadian-shield-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/canadian-shield.mobileconfig
[cloudflare-dns]: https://developers.cloudflare.com/1.1.1.1/encryption/
[cloudflare-dns-family]: https://developers.cloudflare.com/1.1.1.1/setup/#1111-for-families
[cloudflare-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/cloudflare-dns.mobileconfig
[dnspod-dns]: https://www.dnspod.cn/products/publicdns
[dnspod-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/dnspod-dns.mobileconfig
[google-dns]: https://developers.google.com/speed/public-dns/docs/secure-transports
[google-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/google-dns.mobileconfig
[keweondns]: https://forum.xda-developers.com/t/keweondns-info-facts-and-what-is-keweon-actually.4576651/
[keweondns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/keweondns.mobileconfig
[mullvad-dns]: https://mullvad.net/help/dns-over-https-and-dns-over-tls/
[mullvad-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/mullvad-dns.mobileconfig
[nextdns]: https://nextdns.io/
[nextdns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/nextdns.mobileconfig
[opendns]: https://support.opendns.com/hc/articles/360038086532
[opendns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/opendns.mobileconfig
[quad9-dns]: https://www.quad9.net/news/blog/doh-with-quad9-dns-servers/
[quad9-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/quad9-dns.mobileconfig
[quad101-dns]: https://101.101.101.101/
[quad101-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/quad101-dns.mobileconfig
[tiarap-dns]: https://doh.tiar.app
[tiarap-dns-profile]: https://github.com/francis-zhao/secure-dns/raw/master/profiles/tiarap-dns.mobileconfig
[personal-dns]: https://github.com/qq5460168/secure-dns
[personal-dns-profile]: https://github.com/qq5460168/secure-dns/raw/master/profiles/personal-dns.mobileconfig
