<?php
namespace PrestaShop\RtlCss\Transformation;

use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\RuleValueList;

/**
 * Flips values of border-radius
 */
class FlipBorderRadius implements TransformationInterface
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/border-radius/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $value = $rule->getValue();

        if ($value instanceof RuleValueList) {

            // Border radius can contain two lists separated by a slash.
            $groups = $value->getListComponents();
            if ($value->getListSeparator() !== '/') {
                $groups = [$value];
            }
            foreach ($groups as $group) {
                if ($group instanceof RuleValueList) {
                    $values = $group->getListComponents();
                    switch (count($values)) {
                        case 2:
                            $group->setListComponents(array_reverse($values));
                            break;
                        case 3:
                            $group->setListComponents([$values[1], $values[0], $values[1], $values[2]]);
                            break;
                        case 4:
                            $group->setListComponents([$values[1], $values[0], $values[3], $values[2]]);
                            break;
                    }
                }
            }
        }
    }
}
