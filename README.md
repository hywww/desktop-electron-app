# 启动和打包详见package.json即可

# 如何解决mac下安装ffi-napi时报“No Xcode or CLT version detected!”的错误

1. `sudo rm -rf $(xcode-select -p)`
2. `sudo xcode-select --install`
3. 若第二步安装不成功，报网络错误，则手动安装xcode-select，参考这篇文章 https://www.macwk.com/article/macos-command-line-tools-cannot-be-installed

# ffi-napi github地址
https://github.com/node-ffi-napi/node-ffi-napi

windows 安装如有报错，可参考文档安装相关配置项

# 签名和公证参考文章
https://mp.apipost.cn/a/4b137555c8bdbc05