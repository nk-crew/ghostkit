<?php

/**
 * 2007-2017 PrestaShop
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * https://opensource.org/licenses/OSL-3.0
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade PrestaShop to newer
 * versions in the future. If you wish to customize PrestaShop for your
 * needs please refer to http://www.prestashop.com for more information.
 *
 * @author    PrestaShop SA <contact@prestashop.com>
 * @copyright 2007-2017 PrestaShop SA
 * @license   https://opensource.org/licenses/OSL-3.0 Open Software License (OSL 3.0)
 * International Registered Trademark & Property of PrestaShop SA
 */

namespace PrestaShop\RtlCss\Transformation\Value;

use PrestaShop\RtlCss\Transformation\TransformationException;

class TransformableStringValue
{

    private $value;

    /**
     * @param string $value
     *
     * @throws \Exception
     */
    public function __construct($value)
    {
        if (!is_string($value)) {
            throw new \Exception(
                sprintf(
                    "Invalid value: %s should be a string",
                    print_r($value, true)
                )
            );
        }

        $this->value = $value;
    }

    /**
     * @return string
     */
    public function toString()
    {
        return $this->value;
    }

    /**
     * @return string
     */
    public function __toString()
    {
        return $this->toString();
    }

    /**
     * @param string $what
     * @param string $to
     * @param bool $ignoreCase
     *
     * @return bool
     */
    protected function compare($what, $to, $ignoreCase)
    {
        if ($ignoreCase) {
            return strtolower($what) === strtolower($to);
        }
        return $what === $to;
    }

    /**
     * @param string $a
     * @param string $b
     * @param array $options
     *
     * @return string
     * @throws TransformationException
     */
    protected function swap($a, $b, $options = ['scope' => '*', 'ignoreCase' => true])
    {
        $expr = preg_quote($a).'|'.preg_quote($b);
        if (!empty($options['greedy'])) {
            $expr = '\\b('.$expr.')\\b';
        }
        $flags = !empty($options['ignoreCase']) ? 'im' : 'm';
        $expr = "/$expr/$flags";

        $return = preg_replace_callback(
            $expr,
            function ($matches) use ($a, $b, $options) {
                return $this->compare($matches[0], $a, !empty($options['ignoreCase'])) ? $b : $a;
            },
            $this->value
        );

        if ($return === null && PREG_NO_ERROR !== $pregErrorCode = preg_last_error()) {
            throw new TransformationException("Swap failed. Preg error code: $pregErrorCode");
        }

        return $return;
    }

    /**
     * Swaps 'left' and 'right'
     *
     * @return $this
     * @throws TransformationException
     */
    public function swapLeftRight()
    {
        return new self($this->swap('left', 'right'));
    }

    /**
     * Swaps 'ltr' and 'rtl'
     *
     * @return $this
     * @throws TransformationException
     */
    public function swapLtrRtl()
    {
        return new self($this->swap('ltr', 'rtl'));
    }
}
