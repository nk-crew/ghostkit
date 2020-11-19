<?php
namespace PrestaShop\RtlCss\Transformation;

use Sabberworm\CSS\Rule\Rule;

/**
 * Flips properties containing 'right' to 'left'
 */
class FlipRightProperty implements TransformationInterface
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/\bright\b/im', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $property = $rule->getRule();

        $rule->setRule(str_replace('right', 'left', $property));

        return $rule;
    }
}
