Error.stackTraceLimit = Infinity;

var testContext = require.context('./../../2.0', true, /\.spec\.js/);

function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

var modules = requireAll(testContext);