# WebRTC in LAN

サーバーと同一ネットワークにあるデバイス同士をWebRTCで接続するWebサイト

想定用途はスマホのマイクをPCで使ったりスマホをPCのスピーカーとして使ったりすること。

~~本当は静的サイトにしたいが最低限のシグナリングサーバーはほしいので[CloudflareのWorkerd](https://github.com/cloudflare/workerd)でサーバー部分を用意するぞ。
~~

Caddyとgstreamer-plugins-rswebrtcのwhipserversrc使う

``` sh
./serve
```
