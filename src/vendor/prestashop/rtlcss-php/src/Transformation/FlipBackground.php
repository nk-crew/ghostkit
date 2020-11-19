<?php
namespace PrestaShop\RtlCss\Transformation;

use PrestaShop\RtlCss\FlipOptions;
use PrestaShop\RtlCss\Transformation\Value\TransformableStringValue;
use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\Value\CSSFunction;
use Sabberworm\CSS\Value\RuleValueList;
use Sabberworm\CSS\Value\Size;

/**
 * Flips values of background
 */
class FlipBackground implements TransformationInterface
{
    /**
     * @var string
     */
    private $lastRule;

    /**
     * @var FlipOptions
     */
    private $options;

    /**
     * @param FlipOptions $options
     */
    public function __construct(FlipOptions $options)
    {
        $this->options = $options;
    }

    /**
     * @inheritDoc
     */
    public function appliesFor($property)
    {
        return (preg_match('/background(-position(-x)?|-image)?$/i', $property) === 1);
    }

    /**
     * @inheritDoc
     */
    public function transform(Rule $rule)
    {
        $value = $rule->getValue();
        $this->lastRule = $rule->getRule();

        // There can be multiple sets of properties per rule.
        // For example: `background-position: 18.75% 75%, 89.25% top`
        // The first set is `18.75% 75%` and the second `89.25% top`
        $hasSets = ($value instanceof RuleValueList && $value->getListSeparator() == ',');

        $sets = ($hasSets)
            ? $value->getListComponents()
            : [$value];

        foreach ($sets as $setIndex => $set) {

            // There can be multiple values in the same set.
            $hasParts = ($set instanceof RuleValueList);

            $values = ($hasParts)
                ? $set->getListComponents()
                : [$set];

            $processed = ($this->lastRule === 'background')
                ? $this->processBackgroundValues($values)
                : $this->processBackgroundPositionValues($values);

            if ($hasParts) {
                $set->setListComponents($processed);
            } else {
                $sets[$setIndex] = $processed[0];
            }
        }

        if ($hasSets) {
            $value->setListComponents($sets);
        } else {
            $rule->setValue($sets[0]);
        }
    }

    /**
     * Processes values for a background rule
     *
     * @param array $values Rule values
     *
     * @return array Transformed values
     * @throws TransformationException
     */
    private function processBackgroundValues($values)
    {
        $return = [];
        $valuesToProcess = [];

        $foundValuesToProcess = false;
        $stopLooking = false;
        $i = 0;

        // we need to find out the set of values that we can process, and only process that part.
        // those values are always together, so we just need to:
        // 1) analyze each value looking for a size or keyword
        // 2) stash them until we find one that is not
        // 3) flip them and add any other remaining value
        // 4) return the whole set in the original order

        foreach ($values as $value) {
            if (!$stopLooking && ($value instanceof Size || $this->isKeyword($value))) {
                $valuesToProcess[] = $value;
                $foundValuesToProcess = true;
            } else {
                if ($foundValuesToProcess) {
                    break;
                }
                $return[] = $value;
            }

            $i++;
        }

        if ($foundValuesToProcess) {
            return array_merge(
                $return,
                $this->processBackgroundPositionValues($valuesToProcess),
                // add any remaining values
                array_slice($values, $i)
            );
        }

        return $return;
    }

    /**
     * @param string $value
     *
     * @return bool
     */
    private function isKeyword($value)
    {
        $keywords = [
            'left',
            'right',
            'center',
            'top',
            'bottom',
        ];

        return (
            is_string($value)
            && in_array($value, $keywords)
        );
    }

    /**
     * Creates a right offset from a left offset.
     *
     * Right offset cannot be used without defining a vertical alignment.
     * By default, this method adds "center" as vertical alignment automatically. If the property list already defines
     * a vertical alignment, you need to set $hasVerticalComponent to TRUE to avoid adding it again.
     *
     * @param Size $size
     *
     * @param bool $verticalAlignHasBeenDefined [default=false] Indicates if the property list has already defined a vertical
     * alignment value.
     *
     * @return RuleValueList
     */
    private function createRightOffset(Size $size, $verticalAlignHasBeenDefined = false)
    {
        $newVal = new RuleValueList(' ');
        $components = [
            'right',
            $size,
        ];

        // vertical align value is mandatory (unless the property is background-position-x)
        if (!$verticalAlignHasBeenDefined && !$this->isHorizontalPosition()) {
            $components[] = 'center';
        }

        $newVal->setListComponents($components);

        return $newVal;
    }

    /**
     * Indicates if we are flipping background-position-x
     *
     * @return bool
     */
    private function isHorizontalPosition()
    {
        return (false !== strpos($this->lastRule, '-x'));
    }

    /**
     * @param Size|string $value
     *
     * @return CSSFunction|RuleValueList|Size|string
     * @throws TransformationException
     */
    private function processOneValue($value)
    {
        /**
         * Cases:
         * - Flippable keyword value
         * - X length value -> Needs to be replaced by an edge offset if option is activated, left as is otherwise
         * - X percentage value -> needs to be complemented
         */

        if ($value instanceof Size) {
            return $this->flipOffset($value, false);
        }

        if (!is_object($value)) {
            return $this->flipKeyword($value);
        }

        return $value;
    }

    /**
     * @param array $values
     *
     * @return array
     * @throws TransformationException
     */
    private function processTwoValues($values)
    {
        /**
         * Cases:
         * - The 1st value is an X percentage value
         *     -> needs to be complemented, second value is untouched
         * - The 1st value is an X length value
         *     -> Needs to be replaced by an edge offset if option is activated, left as is otherwise
         *        the 2nd value is left untouched (defaults to "center")
         * - The 1st value is a keyword value
         *     -> Needs to be flipped, 2nd argument is flipped only if keyword too, otherwise untouched
         */

        $firstValue = $values[0];

        if ($firstValue instanceof Size) {
            // per spec, the second parameter should be vertical align
            $values[0] = $this->flipOffset($firstValue, true);
        } else if (!is_object($firstValue)) {
            $values[0] = $this->flipKeyword($firstValue);

            if (!is_object($values[1])) {
                $values[1] = $this->flipKeyword($values[1]);
            }
        }

        return $values;
    }

    /**
     * @param array $values
     *
     * @return array
     * @throws TransformationException
     */
    private function processAtLeastThreeValues($values)
    {
        /**
         * Cases:
         * 1) keyword + offset + keyword [+ offset]
         * 2) keyword + keyword + offset
         */

        // whatever happens, the first value MUST be a keyword, otherwise it's invalid CSS
        if (is_object($values[0])) {
            return $values;
        }

        // if the 2nd item is a keyword (case 2), flip it,
        // otherwise flip the third (case 1)
        $flipIndex = (!is_object($values[1])) ? 1 : 2;

        foreach ([0, $flipIndex] as $i) {
            if (!is_object($values[$i])) {
                $values[$i] = $this->flipKeyword($values[$i]);
            }
        }

        return $values;
    }

    /**
     * @param array $values
     *
     * @return array
     * @throws TransformationException
     */
    private function processBackgroundPositionValues($values)
    {
        $numberOfValues = count($values);

        if ($numberOfValues === 1) {
            return [
                $this->processOneValue($values[0])
            ];
        }

        if ($numberOfValues === 2) {
            return $this->processTwoValues($values);
        }

        if ($numberOfValues > 0) {
            return $this->processAtLeastThreeValues($values);
        }

        return [];
    }

    /**
     * Flips a percentage value by replacing it by its complement (100 - value)
     *
     * @param Size|CSSFunction $value
     *
     * @return Size|CSSFunction
     */
    protected function complement($value) {
        if ($value instanceof Size) {
            $value->setSize(100 - $value->getSize());

        } else if ($value instanceof CSSFunction) {
            $arguments = implode($value->getListSeparator(), $value->getArguments());
            $arguments = "100% - ($arguments)";
            $value->setListComponents([$arguments]);
        }

        return $value;
    }

    /**
     * Flips an offset (percentage or length)
     *
     * @param Size $value
     * @param bool $verticalAlignHasBeenDefined [default=false] Indicates if the property list has already defined a vertical
     * alignment value. See {@see self::createRightOffset()}.
     *
     * @return CSSFunction|RuleValueList|Size
     */
    private function flipOffset(Size $value, $verticalAlignHasBeenDefined)
    {
        // transform 25% --> 75% and 100% -> 0%
        if ($value->getUnit() === '%') {
            return $this->complement($value);
        }

        // transform 0 -> 100%
        if (
            $value->getUnit() === null
            && $value->getSize() === 0.0
            && $this->options->shouldTreatBackgroundPositionZeroAsLengthValue()
        ) {
            return new Size(100, '%');
        }

        // transform 20px into "right 20px"
        if ($this->options->shouldFlipBackgroundPositionLengthValue()) {
            return $this->createRightOffset($value, $verticalAlignHasBeenDefined);
        }

        return $value;
    }

    /**
     * Flips horizontal keywords (left / right) while leaving other keywords as-is.
     *
     * @param string $keyword
     *
     * @return string
     * @throws TransformationException
     */
    private function flipKeyword($keyword)
    {
        return (new TransformableStringValue($keyword))
            ->swapLeftRight()
            ->toString();
    }
}
