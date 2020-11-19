<?php
namespace PrestaShop\RtlCss\Transformation;

use PrestaShop\RtlCss\Transformation\Value\TransformableStringValue;
use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\CSSFunction;
use Sabberworm\CSS\Value\RuleValueList;
use Sabberworm\CSS\Value\Size;

/**
 * Flips values of transform-origin
 */
class FlipTransformOrigin implements TransformationInterface
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/transform-origin/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $value = $rule->getValue();

        $foundLeftOrRight = false;

        // Search for left or right.
        $parts = [$value];
        if ($value instanceof RuleValueList) {
            $parts = $value->getListComponents();
            $isInList = true;
        }
        foreach ($parts as $key => $part) {
            if (!is_object($part) && preg_match('/left|right/i', $part)) {
                $foundLeftOrRight = true;
                $parts[$key] = (new TransformableStringValue($part))
                    ->swapLeftRight()
                    ->toString();
            }
        }

        if ($foundLeftOrRight) {
            // We need to reconstruct the value because left/right are not represented by an object.
            $list = new RuleValueList(' ');
            $list->setListComponents($parts);
            $rule->setValue($list);

        } else {

            $value = $parts[0];
            // The first value may be referencing top or bottom (y instead of x).
            if (!is_object($value) && preg_match('/top|bottom/i', $value) && isset($parts[1])) {
                $value = $parts[1];
            }

            // Flip the value.
            if ($value instanceof Size) {

                if ($value->getSize() == 0) {
                    $value->setSize(100);
                    $value->setUnit('%');

                } else if ($value->getUnit() === '%') {
                    $this->complement($value);
                }

            } else if ($value instanceof CSSFunction && strpos($value->getName(), 'calc') !== false) {
                // TODO Fix upstream calc parsing.
                $this->complement($value);
            }
        }

        return $rule;
    }

    /**
     * @param Size|CSSFunction $value
     */
    protected function complement($value) {
        if ($value instanceof Size) {
            $value->setSize(100 - $value->getSize());

        } else if ($value instanceof CSSFunction) {
            $arguments = implode($value->getListSeparator(), $value->getArguments());
            $arguments = "100% - ($arguments)";
            $value->setListComponents([$arguments]);
        }
    }
}
