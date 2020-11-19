<?php
/**
 * RTLCSS.
 *
 * Based in original work by Frédéric Massart - FMCorz.net
 * @license   https://opensource.org/licenses/MIT MIT
 */

namespace PrestaShop\RtlCss;

use PrestaShop\RtlCss\Transformation\FlipBackground;
use PrestaShop\RtlCss\Transformation\FlipBorderRadius;
use PrestaShop\RtlCss\Transformation\FlipCursor;
use PrestaShop\RtlCss\Transformation\FlipDirection;
use PrestaShop\RtlCss\Transformation\FlipLeftProperty;
use PrestaShop\RtlCss\Transformation\FlipLeftValue;
use PrestaShop\RtlCss\Transformation\FlipMarginPaddingBorder;
use PrestaShop\RtlCss\Transformation\FlipRightProperty;
use PrestaShop\RtlCss\Transformation\FlipShadow;
use PrestaShop\RtlCss\Transformation\FlipTransform;
use PrestaShop\RtlCss\Transformation\FlipTransformOrigin;
use PrestaShop\RtlCss\Transformation\FlipTransition;
use PrestaShop\RtlCss\Transformation\TransformationInterface;
use Sabberworm\CSS\Comment\Comment;
use Sabberworm\CSS\CSSList\CSSBlockList;
use Sabberworm\CSS\CSSList\CSSList;
use Sabberworm\CSS\CSSList\Document;
use Sabberworm\CSS\Parser;
use Sabberworm\CSS\Rule\Rule;
use Sabberworm\CSS\RuleSet\DeclarationBlock;
use Sabberworm\CSS\RuleSet\RuleSet;

/**
 * Converts CSS to RTL
 */
class RtlCss {

    /**
     * @var Document
     */
    protected $tree;

    /**
     * @var array
     */
    protected $shouldAddCss = [];

    /**
     * @var bool
     */
    protected $shouldIgnore = false;

    /**
     * @var bool
     */
    protected $shouldRemove = false;

    /**
     * List of transformations to perform for each property, in order
     * @var TransformationInterface[]
     */
    protected $transformationQueue = [];

    /**
     * Options specifying opinionated flipping choices
     * @var FlipOptions
     */
    protected $options;

    /**
     * RTLCSS constructor.
     *
     * @param Document $tree
     * @param FlipOptions $options [default=null]
     */
    public function __construct(Document $tree, FlipOptions $options = null) {
        $this->tree = $tree;
        $this->options = ($options !== null) ? $options : new FlipOptions();
        $this->transformationQueue = [
            new FlipDirection(),
            new FlipLeftProperty(),
            new FlipRightProperty(),
            new FlipTransition(),
            new FlipLeftValue(),
            new FlipMarginPaddingBorder(),
            new FlipBorderRadius(),
            new FlipShadow(),
            new FlipTransformOrigin(),
            new FlipTransform(),
            new FlipBackground($this->options),
            new FlipCursor(),
        ];
    }

    /**
     * @return Document
     */
    public function flip() {
        $this->processBlock($this->tree);
        return $this->tree;
    }

    /**
     * @param Comment[] $comments
     */
    protected function parseComments(array $comments) {
        $startRule = '^(\s|\*)*!?rtl:';
        foreach ($comments as $comment) {
            $content = $comment->getComment();
            if (preg_match('/' . $startRule . 'ignore/', $content)) {
                $this->shouldIgnore = 1;
            } else if (preg_match('/' . $startRule . 'begin:ignore/', $content)) {
                $this->shouldIgnore = true;
            } else if (preg_match('/' . $startRule . 'end:ignore/', $content)) {
                $this->shouldIgnore = false;
            } else if (preg_match('/' . $startRule . 'remove/', $content)) {
                $this->shouldRemove = 1;
            } else if (preg_match('/' . $startRule . 'begin:remove/', $content)) {
                $this->shouldRemove = true;
            } else if (preg_match('/' . $startRule . 'end:remove/', $content)) {
                $this->shouldRemove = false;
            } else if (preg_match('/' . $startRule . 'raw:/', $content)) {
                $this->shouldAddCss[] = preg_replace('/' . $startRule . 'raw:/', '', $content);
            }
        }
    }


    /**
     * @param CSSBlockList|CSSList $block
     */
    protected function processBlock($block) {
        $contents = [];

        /** @var DeclarationBlock|CSSList|RuleSet $node */
        foreach ($block->getContents() as $node) {
            $this->parseComments($node->getComments());

            if ($toAdd = $this->shouldAddCss()) {
                foreach ($toAdd as $add) {
                    $parser = new Parser($add);
                    $contents[] = $parser->parse();
                }
            }

            if ($this->shouldRemoveNext()) {
                continue;
            }

            if (!$this->shouldIgnoreNext()) {
                if ($node instanceof CSSList) {
                    $this->processBlock($node);
                }
                if ($node instanceof RuleSet) {
                    $this->processDeclaration($node);
                }
            }

            $contents[] = $node;
        }

        $block->setContents($contents);
    }

    /**
     * @param DeclarationBlock|RuleSet $node
     */
    protected function processDeclaration($node) {
        $rules = [];

        /**
         * @var int $key
         * @var Rule $rule
         */
        foreach ($node->getRules() as $key => $rule) {
            $this->parseComments($rule->getComments());

            if ($toAdd = $this->shouldAddCss()) {
                foreach ($toAdd as $add) {
                    $parser = new Parser('.wrapper{' . $add . '}');
                    $tree = $parser->parse();
                    /** @var DeclarationBlock[] $contents */
                    $contents = $tree->getContents();
                    /** @var Rule $newRule */
                    foreach ($contents[0]->getRules() as $newRule) {
                        $rules[] = $newRule;
                    }
                }
            }

            if ($this->shouldRemoveNext()) {
                continue;
            }

            if (!$this->shouldIgnoreNext()) {
                $this->processRule($rule);
            }

            $rules[] = $rule;
        }

        $node->setRules($rules);
    }

    /**
     * @param Rule $rule
     */
    protected function processRule(Rule $rule) {
        $property = $rule->getRule();
        foreach ($this->transformationQueue as $transformation) {
            if ($transformation->appliesFor($property)) {
                $transformation->transform($rule);
                break;
            }
        }
    }

    /**
     * @return array
     */
    protected function shouldAddCss() {
        if (!empty($this->shouldAddCss)) {
            $css = $this->shouldAddCss;
            $this->shouldAddCss = [];
            return $css;
        }
        return [];
    }

    /**
     * @return bool
     */
    protected function shouldIgnoreNext() {
        if ($this->shouldIgnore) {
            if (is_int($this->shouldIgnore)) {
                $this->shouldIgnore--;
            }
            return true;
        }
        return false;
    }

    /**
     * @return bool
     */
    protected function shouldRemoveNext() {
        if ($this->shouldRemove) {
            if (is_int($this->shouldRemove)) {
                $this->shouldRemove--;
            }
            return true;
        }
        return false;
    }
}
