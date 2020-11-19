<?php
namespace PrestaShop\RtlCss\Transformation;

use Sabberworm\CSS\Rule\Rule;

/**
 * Interface for CSS transformations
 */
interface TransformationInterface
{
    /**
     * Indicates if this transformation should be applied for a given property
     *
     * @param string $property CSS property (eg. margin-left)
     *
     * @return bool
     */
    public function appliesFor($property);

    /**
     * Performs a transformation on a given Rule
     *
     * @param Rule $rule CSS rule to transform
     *
     * @return Rule Transformed rule
     */
    public function transform(Rule $rule);
}
