<?php
namespace PrestaShop\RtlCss\Transformation;

use PrestaShop\RtlCss\Transformation\Operation\SizeFlipper;
use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\CSSFunction;
use Sabberworm\CSS\Value\RuleValueList;

/**
 * Flips values of transform
 */
class FlipTransform implements TransformationInterface
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
        return (preg_match('/^(?!text\-).*?transform$/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $functions = $this->extractFunctions($rule);

        foreach ($functions as $i => $function) {
            if ($function instanceof CSSFunction) {
                $functions[$i] = $this->flipTransformation($function);
            }
        }

        return $this->replaceFunctions($rule, $functions);
    }

    /**
     * Returns the CSS functions inside the transform property
     *
     * @param Rule $rule
     *
     * @return CSSFunction[] Array of CSS functions
     */
    private function extractFunctions(Rule $rule)
    {
        $value = $rule->getValue();

        if ($value instanceof RuleValueList) {
            return $value->getListComponents();
        }

        return [$value];
    }

    /**
     * Replaces the functions inside the transform property
     *
     * @param Rule $rule
     * @param CSSFunction[] $functions
     *
     * @return Rule
     */
    private function replaceFunctions(Rule $rule, $functions)
    {
        $value = $rule->getValue();

        if ($value instanceof RuleValueList) {
            $value->setListComponents($functions);
        } else {
            $rule->setValue($functions[0]);
        }

        return $rule;
    }

    /**
     * Performs the horizontal flip on the provided function
     *
     * @param CSSFunction $function
     *
     * @return CSSFunction The flipped function
     */
    private function flipTransformation(CSSFunction $function)
    {
        $functionName = $function->getName();

        switch ($functionName) {
            case 'translate':
            case 'translateX':
                return $this->flipTranslateFunction($function);
        }

        return $function;
    }

    /**
     * Flips a translate() or translateX() CSS function
     *
     * @param CSSFunction $function
     *
     * @return CSSFunction The flipped function
     */
    private function flipTranslateFunction(CSSFunction $function)
    {
        $arguments = $function->getArguments();

        $arguments[0] = $this->sizeFlipper->invertSize($arguments[0]);

        return new CSSFunction($function->getName(), $arguments);
    }
}
