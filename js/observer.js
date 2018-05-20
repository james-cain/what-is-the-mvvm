function observe(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    // 取出所有的属性遍历
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key]);
    })
}

function defineReactive(data, key, val) {
    var dep = new Dep();
    observe(val); // 监听子属性
    Object.defineProperty(data, key, {
        enumerable: true, // 可枚举
        configurable: false, // 不能define
        get: function() {
            // 通过Dep定义一个全局target属性，暂存watcher，添加完移除
            Dep.target && dep.addSub(Dep.target);
            return val;
        },
        set: function(newVal) {
            if (val === newVal) return;
            console.log('变化：', val, '-->', newVal);
            val = newVal;
            dep.notify(); // 通知所有订阅者
        }
    });
}

function Dep() {
    this.subs = [];
}

Dep.prototype = {
    addSub: function(sub) {
        this.subs.push(sub);
    },
    notify: function() {
        this.subs.forEach(function (sub) {
            sub.update();
        });
    }
}

// test
var data = { name: 'xielei'};
observe(data);
data.name = 'jamescain';
