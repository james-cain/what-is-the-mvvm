# Introduce the principle analysis of mvvm
> I`ll achieve my goal about reading the source of vue.js from v1 to v2.

If you want to achieve the goal in version 1, you should understand the following tips:

1. Realizing a data observer. Once the data changes, observer will update all related-data real time and notice to the Watcher meanwhile.
2. Realizing a directive compile.It will do something, like scaning all element nodes, analysing them according the directive function to change the template data.It also create a Watcher when recursion all element nodes, it aims to bind data when data updated.
3. Realizing a Watcher.Purpose to relate observer and compile, you should create a bridge — the data watcher.When the data changed whatever it happened, it would run the callback that binding in running directive, and update the view.
4. When realizing above, you should realize last steps about mvvm-entry to init the obsever, compile and watcher.

To be perfected：

- Using proxy to realize the data watcher(vue 3).
- Computed
- Watch
- Virtual dom
- Diff
- Event detection

