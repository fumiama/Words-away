# Words-away-simplified
## 这个东西是干什么的？
一个文本处理工具，用于防止对文本的敏感词检测。主要是因为酷安的折叠词太过蜜汁，**例如“申诉”也会被折叠（doge）**所以就有了这个工具。

设计目标为酷安，理论上所有完整支持Unicode的社区等 都能够使用，但效果不确定。实测对[网易易盾](https://dun.163.com/product/text-detection)的文本检测API有一定效果。

这是网页版，目前还有处于开发阶段的[Android版本](https://github.com/NitroRCr/WordsAway_Android)

## 注意
这是二刺螈化的精简版本，适合嵌入式系统部署。[演示站点](https://fumiama.github.io/Words-away-simplified/)

## 原理：
以下是不同选项的原理

+ 普通模式：在相隔的两个字符之间插入Unicode零宽间隔符（[U+200B](https://unicode.org/cldr/utility/character.jsp?a=200B)）以规避检测。
+ 每行双重反转模式：将一行内所有文字顺序反转（物理）再加入Unicode反转控制符([U+202E](https://unicode.org/cldr/utility/character.jsp?a=202E))从而实现增强的规避检测。
+ 每两字反转模式：另一种增强模式，这里不作过多解释~~（其实是懒）~~
+ 转为竖向排列：纯“物理”的处理方法，不使用`Unicode`控制符，仅把文本转为竖向排列。
+ 规避中括号和链接：遇到中括号和链接时不进行处理，以兼容表情符号和链接。
+ 同形字母替换：将部分普通拉丁文字母替换为其他语言中外形相同的字母
+ 链接转短链接：使用[is.gd](https://is.gd)的`API`，将文本中的`http/https`链接替换短连接，以避开对链接的域名检测
+ [幼女Code](https://github.com/RimoChan/unvcode)



### Example

以下展示了大致的处理方法

- 零宽间隔

```
"ABCD" => "A\u200bB\u200bC\u200bD\u200b"
```

- 每行双重反转

```
"ABCD" => "\u202eDCBA"
```

- 每两字双重反转

```
"ABCDEF" => "\u200eA\u202eC\u200bB\u202c\u200eD\u202eF\u200bE\u202c"
```

看详细原理的话，翻源码吧（没写注释别打我）

## 隐私：

基于JavaScript的网页实现，仅运行在浏览器端，不会将数据传到服务器~可以放心使用
## 已实现/将实现的功能：
+ [x] 增强模式
+ [x] 自动判断链接并绕行
+ [x] 竖向排列模式
+ [x] 更好看的界面
+ [x] Android APP
+ [x] 还原模式
## 已知的问题：
+ 由于U+202E的特性，用每行双重反转模式处理之后，当一行文本以多行的形式显示时，那几行的顺序会反转，暂时无法解决
+ 由于U+202E的特性，用每两字双重反转模式处理之后，当一行文本以多行的形式显示时，有三分之一的概率 上一行的最后一字与下一行的第一个字位置交换。暂时无法解决
## 使用：
+ [在线网页](https://wordsaway.krytro.com)
+ [Android应用](https://github.com/NitroRCr/WordsAway_Android)
>1. 打开网页或应用
>2. 输入或粘贴需要处理的文本  
>3. 根据需要选中相应的选项。  
>4. 处理，复制  
>5. 粘贴到酷安，能够正常发布（大多数情况）  
## 免责声明：
**过于敏感的词语即使反转也会被检测到**，因此这个工具并不是万能的  
另外虽然Unicode控制符不会被机器检测，**但是酷安小编本人说过用Unicode控制符发送严重违规消息直接永封不解。**  
因此虽然这是个好东西但是切勿滥用，*不然到时候某一天酷安算法可以识别控制符了对谁都不好*  

# WordsHide

一个加密隐藏文本的工具，通过将文本编码为不可见的`Unicode`控制符，实现对该段文本的隐藏。可将该文本插入到普通文本中，复制粘贴不会丢失，解码后可见。

## 使用

- [示例网页](https://words.seku.su/hide.html)
- 部署为静态网站
- JavaScript:

```javascript
//由于用到了seedrandom.js和pako.js，必须先引入它们
//然后引入WordsHide.js

//实例化WordsHide对象
var wh = new WordsHide();

var str = "Hello World";	//需要隐藏的文本
var password = "123";	//加密密码

//加密编码，返回隐藏文本
var hidden = wh.hideWithCompress(str, password);//压缩模式
var hidden2 = wh.hideWithUtf8(str, password);//UTF-8编码模式

console.log(hidden);	//输出: ""，不可见
console.log(hidden2);	//输出: ""，不可见

//用对应的方式解码
var str1 = wh.unhideWithCompress(hidden, password);
var str2 = wh.unhideWithUtf8(hidden2, password);

console.log(str1);	//输出: "Hello World"
console.log(str2);	//输出: "Hello World"
```

### 用途

编码隐藏后的文本通常不可见， 但在某些应用（如`QQ PC版`和`windows记事本`）上仍然可以看到控制符。

你可以用隐藏文本加密储存信息，秘密传达消息或是为文章添加隐藏水印等。

### 两种模式

`UTF-8`编码模式将文本以`UTF-8`格式编码为16进制后，再编码为Unicode控制符。

压缩模式会使用[pako.js](https://github.com/nodeca/pako)提供的`gzip`方法将文本压缩为二进制文本（`binaryString`）后，再编码为Unicode控制符。

隐藏后的文本，实际大小会比原文本大得多。对于一般的长文本(>5kB)，它们的大小关系大约如下：

| 文本类型 | 原文本大小 | UTF-8模式隐藏后大小 | 压缩模式隐藏后大小 |
| -------- | ---------- | ------------------- | ------------------ |
| 一般中文 | 1          | 6                   | 3                  |
| 一般英文 | 1          | 6                   | 2                  |

对于长文本，压缩模式可以显著减少隐藏后文本的实际大小；但对于短文本，压缩后文本往往会更长。对于长度大于50的文本，建议使用压缩模式。

### 加密

加密是必选的，你可以将任意文本作为密码。默认密码为空字符串。

加密后文本并不能保证绝对安全，不要尝试用它储存机密性信息。

## 原理

原理上面也有提及。将文本编码为不可见的`Unicode控制符`，实现对文本的隐藏。

所有用到的Unicode控制符：

`\u200b-\u200f`, `\u202a-\u202e`, `\u2060-\u206f`

关于编码和加密的原理，请翻阅源码

## 特别感谢

使用到的开源库：

- [pako](https://github.com/nodeca/pako)
- [seedrandom](https://github.com/davidbau/seedrandom)
