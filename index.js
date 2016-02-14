var ReactPerf = require('react/lib/ReactPerf');

function reactPerfTrace(objName, fnName, func) {
  return function(component) {
    if (objName === 'ReactCompositeComponent') {
      var instName = this.getName() || 'Unknown';
      var label = fnName === 'mountComponent' || fnName === 'updateComponent' ? instName : instName + '.' + fnName;
    } else {
      return func.apply(this, arguments);
    }

    var trace = window && window.wtf && window.wtf.trace;
    var scope = trace && trace.enterScope(label.replace(/[^a-z0-9\.\_]/gi, '__'));
    var ret = func.apply(this, arguments);
    scope && trace.leaveScope(scope);

    return ret;
  };
}

module.exports.inject = function() {
  if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
    if (window.wtf) {
      ReactPerf.injection.injectMeasure(reactPerfTrace);
      ReactPerf.enableMeasure = true;
    } else {
      console.error(
        'Cannot find Web Tracing Framework. ' +
        'Install it from http://google.github.io/tracing-framework/' +
        'and enable tracing for this page.'
      );
    }
  }
}

