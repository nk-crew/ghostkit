<?php
namespace PrestaShop\RtlCss\Transformation\Operation;

use Sabberworm\CSS\Value\Size;

/**
 * Flips sizes
 */
class SizeFlipper
{
    /**
     * Inverts a size by multiplying it by -1
     *
     * @param Size $size
     *
     * @return Size Flipped size
     */
    public function invertSize(Size $size)
    {
        $scalarSize = $size->getSize();
        if ($scalarSize === 0.0) {
            return $size;
        }

        return new Size(-1 * $scalarSize, $size->getUnit(), $size->isColorComponent());
    }
}
