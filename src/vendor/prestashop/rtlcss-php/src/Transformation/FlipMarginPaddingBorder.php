<?php
namespace PrestaShop\RtlCss\Transformation;

use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\RuleValueList;

/**
 * Flips values of margin, padding and border
 */
class FlipMarginPaddingBorder implements TransformationInterface
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/^(margin|padding|border-(color|style|width))$/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $value = $rule->getValue();

        if ($value instanceof RuleValueList) {
            $values = $value->getListComponents();
            $count = count($values);
            if ($count == 4) {
                $right = $values[3];
                $values[3] = $values[1];
                $values[1] = $right;
            }
            $value->setListComponents($values);
        }

        return $rule;
    }
}
