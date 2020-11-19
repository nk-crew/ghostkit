<?php
namespace PrestaShop\RtlCss\Transformation;

use PrestaShop\RtlCss\Transformation\Value\TransformableStringValue;
use Sabberworm\CSS\Rule\Rule;

/**
 * Transforms 'direction' rules from 'ltr' to 'rtl'
 */
class FlipDirection implements TransformationInterface
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/direction$/im', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $newValue = (new TransformableStringValue($rule->getValue()))
            ->swapLtrRtl()
            ->toString();

        $rule->setValue($newValue);

        return $rule;
    }
}
