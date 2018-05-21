// 数据绑定入口，整合Observer、Compile、Watcher，通过Observer来监听自己的model数据变化
// 通过Compile来解析编译模板指令，利用Watcher搭起Observer和Compile的通信桥梁，达到数据变化->视图更新
// 视图交互变化（input）->数据model变更的双向绑定效果
function MVVM(options) {
    this.$options = options;
    var data = this._data = this.$options.data, me = this;
    // 添加属性代理
    Object.keys(data).forEach(function(key) {
        me._proxy(key);
    });
    this._initComputed();
    // this._initWatch();
    observe(data, this);
    this.$compile = new Compile(options.el || document.body, this);
}

MVVM.prototype = {
    _proxy: function(key) {
        var me = this;
        Object.defineProperty(me, key, {
            enumerable: true,
            configurable: false,
            get: function proxyGetter() {
                return me._data[key];
            },
            set: function proxySetter(newVal) {
                me._data[key] = newVal;
            }
        });
    },
    _initComputed: function() {
        var me = this;
        var computed = this.$options.computed;
        if (typeof computed === 'object') {
            Object.keys(computed).forEach(function(key) {
                Object.defineProperty(me, key, {
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set: function() {}
                });
            });
        }
    },
    // _initWatch: function() {
    //     var me = this;
    //     var watch = this.$options.watch;
    //     console.log('watching...');
    //     if (typeof watch === 'object') {
    //         Object.keys(watch).forEach(function(key) {
    //             me.$watch(key, watch[key], me.$options);
    //         });
    //     }
    // },
    // $watch: function(key, cb, options) {
    //     console.log('watched...', key);
    //     new Watcher(this, key, cb, 'test');
    // }
};
