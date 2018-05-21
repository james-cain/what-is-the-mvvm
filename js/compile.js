// compile主要做的事情是解析模板指令，将模板中的变量替换成数据，然后初始化渲染页面视图
// 并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，更新视图
function Compile(el, vm) {
    this.$vm = vm;
    this.$el = this.isElementNode(el) ? el : document.querySelector(el);
    if (this.$el) {
        this.$fragment = this.node2Fragment(this.$el);
        this.init();
        this.$el.appendChild(this.$fragment);
    }
}

Compile.prototype = {
    init: function() {
        this.compileElement(this.$fragment);
    },
    // 遍历所有节点及其子节点，进行扫描解析编译，调用对应的指令函数进行数据渲染，并调用对应的指令更新函数进行绑定
    compileElement: function(el) {
        var childNodes = el.childNodes, me = this;
        [].slice.call(childNodes).forEach(function(node) {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/; // 表达式文本
            // 按元素节点方式编译
            if (me.isElementNode(node)) {
                me.compile(node);
            } else if (me.isTextNode(node) && reg.test(text)) {
                me.compileText(node, RegExp.$1); // ?
            }
            // 遍历编译子节点
            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        })
    },
    compile: function(node) {
        var nodeAttrs = node.attributes, me = this;
        [].slice.call(nodeAttrs).forEach(function(attr) {
            // 规定：指令以v-xxx命名
            // 如 <span v-text="content"></span> 中指令为v-text
            var attrName = attr.name;
            // 判断是否是指令
            if (me.isDirective(attrName)) {
                var exp = attr.value; // content
                var dir = attrName.substring(2); // text
                if (me.isEventDirective(dir)) {
                    // 事件指令，如 v-on:click
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                } else {
                    // 普通指令
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }
            }
        })
    },
    compileText: function(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    },
    node2Fragment: function(el) {
        var fragment = document.createDocumentFragment(), child;

        while(child = el.firstChild) {
            fragment.appendChild(child);
        }
        return fragment;
    },
    isDirective: function(attr) {
        return attr.indexOf('v-') == 0;
    },
    isEventDirective: function(dir) {
        return dir.indexOf('on') == 0;
    },
    isElementNode: function(node) {
        return node.nodeType == 1;
    },
    isTextNode: function(node) {
        return node.nodeType == 3;
    }
}

// 指令处理集
var compileUtil = {
    text: function(node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    html: function(node, vm, exp) {
        this.bind(node, vm, exp, 'html');
    },
    model: function(node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        var me = this,
            val = this._getVMVal(vm, exp);
        node.addEventListener('input', function(e) {
            var newValue = e.target.value;
            if (val === newValue) return;
            me._setVMVal(vm, exp, newValue);
            val = newValue;
        });
    },
    class: function(node, vm, exp) {
        this.bind(node, vm, exp, 'class');
    },
    bind: function(node, vm, exp, dir) {
        var updaterFn = updater[dir + 'Updater'];
        var me = this;
        // 第一次初始化视图
        updaterFn && updaterFn(node, me._getVMVal(vm, exp));
        // 实例化订阅者，会在对应的属性消息订阅器中添加给订阅者watcher
        new Watcher(vm, exp, function(value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue);
        });
    },
    eventHandler: function(node, vm, exp, dir) {
        var eventType = dir.split(':')[1],
            fn = vm.$options.methods && vm.$options.methods[exp];
        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
    _getVMVal: function(vm, exp) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k) {
            val = val[k]; // 递归 找到叶子节点
        });
        return val;
    },
    _setVMVal: function(vm, exp, value) {
        var val = vm;
        exp = exp.split('.');
        exp.forEach(function(k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k];
            } else {
                val[k] = value;
            }
        })
    }
}

// 更新函数
var updater = {
    textUpdater: function(node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    htmlUpdater: function(node, value) {
        node.innerHTML = typeof value === 'undefined' ? '' : value;
    },
    classUpdater: function(node, value, oldValue) {
        var className = node.className;
        className = className.replace(oldValue, '').replace(/\s$/, ''); // 去除旧的class
        var space = className && String(value) ? ' ' : '';
        node.className = className + space + value;
    },
    modelUpdater: function(node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    }
};
