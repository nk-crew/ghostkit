<?php
namespace PrestaShop\RtlCss\Transformation;

/**
 * Transforms 'transition' rules from 'left' to 'right'
 */
class FlipTransition extends AbstractFlipLeftRight
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/transition(-property)?$/i', $property) === 1);
    }
}
