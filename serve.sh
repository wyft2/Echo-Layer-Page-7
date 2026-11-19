#!/bin/sh
cd "$(dirname "$0")"
echo "不要回复第七页"
echo "打开 http://127.0.0.1:8899/ 开始"
python3 -m http.server 8899
