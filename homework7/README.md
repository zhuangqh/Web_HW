# 作业说明

## 迷宫

**优化前后LoC**
  - 优化前：168行
  - 优化后：124行

**Toolkits使用心得**

1. 框架的引入，使得代码变得简洁许多，可读性也增强了。把原来繁杂的getElementById替换成了简单易懂的
类css选择器的语法，非常方便。addClass, removeClass免去对字符串进行操作的麻烦。
尤其是Lodash的一些方法，如_.random和_.sample，代替了原生非常长的实现，而且非常语义化。

2. 在不熟悉框架的一些细节的时候，使用起来还是有点不顺手的。jQuery对象少了一些原生的方法，
多了一些jQuery的东西，而且一些方法的返回值类型也不是很清楚，刚开始在DOM对象和jQuery对象之间切换
有点不适应。

3. jQuery的引入，会带来性能的损失。 写代码的时候一直在纠结这个东西...觉得一些非常方便的方法，
对性能的影响可能比较大。自己做了些许优化，如动态生成迷宫的块的时候，用的是一个数组，将字符串暂存
起来，然后在调用join，加入到DOM中；暂存jQuery对象，减少DOM查询。

4. 框架的引入，会带来一些变量污染，如我们使用的jQuery和Lodash，那么$, _就不能用了。我的解决方法
是用一个IIFE包装起来，这样就不会污染其他代码。

## Table sorter
**notes:** 本人的mysticCode是按课程网站上说的——按字符串顺序排序

可使用的网站列表：
- [swust ranklist](http://acm.swust.edu.cn/user/ranklist/)
- [swust contest](http://acm.swust.edu.cn/contest/list/)
- [smartoj](http://www.smartoj.com/p)
- [smartoj set](http://www.smartoj.com/set/1)
- [jobdu ranklist](http://ac.jobdu.com/ranklist.php)
