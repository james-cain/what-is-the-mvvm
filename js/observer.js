function Observer(data) {
    if (!data || typeof data !== 'object') {
        return;
    }
    this.walk(data);
}

Observer.prototype = {
    walk: function(data) {
        var me = this;
        // 取出所有的属性遍历
        Object.keys(data).forEach(function(key) {
            me.defineReactive(data, key, data[key]);
        });
    },
    defineReactive: function(data, key, val) {
        var dep = new Dep();
        var childObj = observe(val); // 监听子属性
        Object.defineProperty(data, key, {
            enumerable: true, // 可枚举
            configurable: false, // 不能define
            get: function() {
                // 通过Dep定义一个全局target属性，暂存watcher，添加完移除
                if (Dep.target) {
                    dep.depend();
                }
                // Dep.target && dep.addSub(Dep.target);
                return val;
            },
            set: function(newVal) {
                if (val === newVal) return;
                console.log('变化：', val, '-->', newVal);
                val = newVal;
                // 如果新增加的值是object，需要监听
                childObj = observe(newVal);
                dep.notify(); // 通知所有订阅者
            }
        });
    }
}

function observe(value, vm) {
    if (!value || typeof value !== 'object') return;
    return new Observer(value);
}

var uid = 0;

function Dep() {
    this.id = uid++;
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
    },
    depend: function() {
        Dep.target.addDep(this);
    }
}

Dep.target = null;

// test
// var data = { name: 'xielei'};
// observe(data);
// data.name = 'jamescain';
