<?php
namespace PrestaShop\RtlCss\Transformation;

use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\RuleValueList;

/**
 * Flips values of cursor
 */
class FlipCursor implements TransformationInterface
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/cursor/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $value = $rule->getValue();

        $hasList = false;

        $parts = [$value];
        if ($value instanceof RuleValueList) {
            $hastList = true;
            $parts = $value->getListComponents();
        }

        foreach ($parts as $key => $part) {
            if (!is_object($part)) {
                $parts[$key] = preg_replace_callback(
                    '/\b([news]{1,4})(?=-resize)/',
                    function($matches) {
                        $token = $matches[1];
                        if (strlen($token) <= 2) {
                            // "ew" should not be flipped
                            if ($token !== 'ew') {
                                return strtr($token, ['e' => 'w', 'w' => 'e']);
                            }
                        } else if ($token === 'nesw') {
                            return 'nwse';
                        } else if ($token === 'nwse') {
                            return 'nesw';
                        }

                        // no change
                        return $token;
                    },
                    $part
                );
            }
        }

        if ($hasList) {
            $value->setListComponents($parts);
        } else {
            $rule->setValue($parts[0]);
        }
    }

}
