# Introduce the principle analysis of mvvm
要实现mvvm的双向绑定，要实现以下：

1. 实现一个数据监听器Observer，对数据对象的所有属性进行监听，如有变动可拿到最新值并通知订阅者
2. 实现一个指令解析器Compile，对每个元素节点的指令进行扫描和解析，根据指令替换模板替换数据，以及绑定相应的更新函数
3. 实现一个Watcher，作为Observer和Compile的桥梁，能够订阅并收到每个属性变动的通知，执行指令绑定的响应回调函数，从而更新视图
4. mvvm入口函数，整合以上三者



1. 实现Observer

