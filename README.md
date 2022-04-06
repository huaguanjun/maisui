# 麦穗

#### 介绍

该插件基于了element-ui进行二次封装，旨在给使用者提供更好、更完善的ui组件。
该插件将会实现如下两个重点：一、使用面向对象的形式提供数据操作服务与集成。二、完善element-ui组件中不足、存在BUG的地方。

对于第一点，我们知道，在vue2框架下使用element-ui组件时，不仅需要在template中实现具体的组件代码，而且需要通过对data、methods、computed等配置项中实现对应的数据定义与逻辑。这样当然没什么问题，但往往我们的单页面逻辑是复杂的，其中可能包含了多个组件与各种逻辑。在这种情况下，我们的逻辑将会在这几个配置项中被切分的支离破碎，当然这并不是element-ui的问题。在vue3的开发日志中尤大也详细的指出vue2的optionApi确实是会存在这种问题，但这个问题只能在vue3中使用compositionApi才能解决。我们希望能够将vue3中的compositionApi概念吸纳过来，通过定义数据模型来尽可能的降低代码的耦合程度，将原先需要写在各个配置项中的数据、逻辑统一的配置在数据模型中，在将数据模型传递给核心组件，通过数模的反射来实现数据的双向绑定。

使用模型的好处不仅仅是能够降低代码耦合程度。通过对模型使用装饰、链式、管道等设计模式能使使用者获得非常良好的OOP体验。同时对模型进行抽象、继承、组合可以使模型的兼容性进一步提升，能够轻易的设计出高内聚、低耦合的业务性模型。

#### 软件架构
软件架构说明


#### 安装教程

1.  xxxx
2.  xxxx
3.  xxxx

#### 使用说明

1.  xxxx
2.  xxxx
3.  xxxx

#### 参与贡献

1.  Fork 本仓库
2.  新建 Feat_xxx 分支
3.  提交代码
4.  新建 Pull Request


#### 特技

1.  使用 Readme\_XXX.md 来支持不同的语言，例如 Readme\_en.md, Readme\_zh.md
2.  Gitee 官方博客 [blog.gitee.com](https://blog.gitee.com)
3.  你可以 [https://gitee.com/explore](https://gitee.com/explore) 这个地址来了解 Gitee 上的优秀开源项目
4.  [GVP](https://gitee.com/gvp) 全称是 Gitee 最有价值开源项目，是综合评定出的优秀开源项目
5.  Gitee 官方提供的使用手册 [https://gitee.com/help](https://gitee.com/help)
6.  Gitee 封面人物是一档用来展示 Gitee 会员风采的栏目 [https://gitee.com/gitee-stars/](https://gitee.com/gitee-stars/)
