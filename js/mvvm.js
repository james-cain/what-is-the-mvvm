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
    Observer(data, this);
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
    }
};
