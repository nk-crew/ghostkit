<?php
namespace PrestaShop\RtlCss\Transformation;

use PrestaShop\RtlCss\Transformation\Operation\SizeFlipper;
use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\RuleValueList;
use Sabberworm\CSS\Value\Size;

class FlipShadow implements TransformationInterface
{
    /**
     * @var SizeFlipper
     */
    private $sizeFlipper;

    public function __construct()
    {
        $this->sizeFlipper = new SizeFlipper();
    }

    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/shadow/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $value = $rule->getValue();

        // Flip X offset
        if ($value instanceof RuleValueList) {
            $parameters = $value->getListComponents();
            $index = $this->getOffsetXIndex($rule);
            if ($index >= 0) {
                /** @var Size $oldX */
                $oldX = $parameters[$index];
                $parameters[$index] = $this->sizeFlipper->invertSize($oldX);

                $value->setListComponents($parameters);
            }
        }

        return $value;
    }

    /**
     * Retrieve the index of the X offset within the rule values
     *
     * @param Rule $rule
     *
     * @return int
     */
    private function getOffsetXIndex(Rule $rule)
    {
        $value = $rule->getValue();
        if ($value instanceof RuleValueList) {
            $parameters = $value->getListComponents();
            // the offset X parameter can be either the 1st or 2nd parameter
            foreach ([0, 1] as $i) {
                if (isset($parameters[$i]) && $parameters[$i] instanceof Size) {
                    return $i;
                }
            }
        }

        // handle other types like RuleValueList gracefully
        return -1;
    }
}
