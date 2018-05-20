// 订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是：
// 1. 在自身实例化时王属性订阅器（dep）里面添加自己
// 2. 自身必须有一个update方法
// 3. 待属性变动dep.notice() 通知时，能调用自身的update()方法，并触发Compile中绑定的回调，over

function Watcher(vm, exp, cb) {
    this.cb = cb;
    this.vm = vm;
    this.exp = exp;
    // 为了触发属性的getter，目的在dep中添加自己
    this.value = this.get();
}

Watcher.prototype = {
    get: function(key) {
        Dep.target = this; // 将当前订阅者指向自己
        var value = this.vm[exp]; // 触发getter，添加自己到属性订阅器中 ？
        Dep.target = null; // 添加完毕后，重置为null
        return value;
    },
    update: function() {
        this.run(); // 属性值变化时收到通知
    },
    run: function() {
        var value = this.get(); // 取到最新值
        var oldVal = this.value;
        if (value !== oldVal) {
            this.value = value;
            this.cb.call(this.vm, value, oldVal); // 执行Compile中绑定的回调，更新视图
        }
    }
}