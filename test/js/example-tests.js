YUI().use('test-console', 'test', function(Y) {
	var win = Y.config.win,
		Test = Y.Test,
		Assert = Test.Assert,
		exampleTestSuite = new Test.Suite('XBDD.ExampleTests');

	exampleTestSuite.add(new Test.Case({
		name: 'Example.Case',

		// setUp() runs every time before each test
		setUp: function() {
			this.foo = "bar";
		},

		// tearDown() runs every time after each test
		tearDown: function() {
			this.foo = null;
		},

		// each test should be in the format {function being tested}() should {what it should do} if {stuff happens}
		'theFunction() should "do something" if "something happens"': function() {
			Assert.areEqual(true, true);
		}
	}));

	new Test.Console().render();

	Test.Runner.add(exampleTestSuite).run();
});