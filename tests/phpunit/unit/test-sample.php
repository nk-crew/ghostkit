<?php
/**
 * Tests for SampleTest
 *
 * @package Visual Portfolio
 */

/**
 * Sample test case.
 */
class SampleTest extends WP_UnitTestCase {
    /**
     * Set up our mocked WP functions. Rather than setting up a database we can mock the returns of core WordPress functions.
     *
     * @return void
     */
    public function set_up() {
        parent::set_up();
    }

    /**
     * Tear down WP Mock.
     *
     * @return void
     */
    public function tear_down() {
		parent::tear_down();
    }

    /**
     * A single example test.
     */
    public function test_sample() {
        // Replace this with some actual testing code.
        $this->assertTrue( true );
    }
}
