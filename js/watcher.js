// 订阅者作为Observer和Compile之间通信的桥梁，主要做的事情是：
// 1. 在自身实例化时王属性订阅器（dep）里面添加自己
// 2. 自身必须有一个update方法
// 3. 待属性变动dep.notice() 通知时，能调用自身的update()方法，并触发Compile中绑定的回调，over

// expOrFn 有可能是watch或者computed或者属性
function Watcher(vm, expOrFn, cb) {
    var me = this;
    this.cb = cb;
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.depIds = {};

    if (typeof expOrFn === 'function') {
        this.getter = expOrFn;
    } else {
        this.getter = this.parseGetter(expOrFn); // 返回取得属性方法的函数
        // 增加watch监听
        Object.keys(vm.$options.watch).forEach(function(key) {
            if (key === expOrFn) {
                console.log('watched...');
                me.watchcb = vm.$options.watch[key];
            }
        });
    }
    // 为了触发属性的getter，目的在dep中添加自己
    this.value = this.get();
}

Watcher.prototype = {
    get: function(key) {
        Dep.target = this; // 将当前订阅者指向自己
        var value = this.getter.call(this.vm, this.vm);// 第二个this.vm是必须要的，作为参数传递到方法中 遍历查找发生变化的属性
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
            this.watchcb&&this.watchcb.call(this.vm, value, oldVal); // watchcb存在，则执行
        }
    },
    parseGetter: function(exp) {
        if (/[^\w.$]/.test(exp)) return;
        var exps = exp.split('.');

        return function(obj) {
            for (var i = 0, len = exps.length; i < len; i++) {
                if (!obj) return;
                obj = obj[exps[i]];
            }
            return obj;
        }
    },
    addDep: function(dep) {
        if (!this.depIds.hasOwnProperty(dep.id)) {
            dep.addSub(this);
            this.depIds[dep.id] = dep;
        }
    }
}