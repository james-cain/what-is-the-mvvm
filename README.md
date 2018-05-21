##Introduce analysis of the principle of mvvm 

> I am catching my goal that read the source code of vuejs from v1 to v2. 

If you want to achieve the goal in version 1, you should understand the following tips:

1. Realizing a data observer. Once the data changes, observer will update all related-data real time and notice to the watcher meanwhile.
2. Realizing a directive compile.It will do something like scaning all element nodes, and analysing them according to the directive function to change the template data.It will also create a watcher when recursion all element nodes, it aims to bind data when data updated.
3. Realizing a watcher.In order to build the link between observer and compile, you should create a bridge — the data watcher.Whatever the data changed at anytime, it would run the callback binding in running directive, and update the view.
4. After realizing these tips above, you should realize the last step about mvvm-entry to initialize the obsever, compile and watcher.

To be perfected：

- Using proxy to realize the data watcher(vue 3).
- ~~Computed~~
- <u>Watch</u>（complete, not refer to official method）
- Virtual dom
- Diff
- Event detection
- vm.$set or Vue.set
- Props
- v-if
- v-for
- Component
- Slot
- Server-render

