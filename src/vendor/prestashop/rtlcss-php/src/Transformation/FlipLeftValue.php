<?php
namespace PrestaShop\RtlCss\Transformation;

/**
 * Flips values that are exactly 'left' to 'right'
 */
class FlipLeftValue extends AbstractFlipLeftRight
{
    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/float|clear|text-align/i', $property) === 1);
    }
}
