<?php

namespace PrestaShop\RtlCss;

/**
 * Options for RTL CSS
 */
class FlipOptions
{

    /**
     * Indicates if length units (as opposed to percentages) of background-position should be flipped or not
     * @var bool
     */
    private $shouldFlipBackgroundPositionLengthValue = true;

    /**
     * Indicates if background-position of '0' should be treated as a length (as opposed to a percentage)
     * @var bool
     */
    private $shouldTreatBackgroundPositionZeroAsLengthValue = true;

    /**
     * Indicates if length units (as opposed to percentages) of background-position should be flipped or not
     *
     * @return bool
     */
    public function shouldFlipBackgroundPositionLengthValue()
    {
        return $this->shouldFlipBackgroundPositionLengthValue;
    }

    /**
     * Indicates if length units (as opposed to percentages) of background-position should be flipped or not
     *
     * @param bool $toggle
     *
     * @return $this
     */
    public function setShouldFlipBackgroundPositionLengthValue($toggle)
    {
        $this->shouldFlipBackgroundPositionLengthValue = $toggle;
        return $this;
    }

    /**
     * Indicates if background-position of '0' should be treated as a length (as opposed to a percentage)
     * @return bool
     */
    public function shouldTreatBackgroundPositionZeroAsLengthValue()
    {
        return $this->shouldTreatBackgroundPositionZeroAsLengthValue;
    }

    /**
     * Indicates if background-position of '0' should be treated as a length (as opposed to a percentage)
     *
     * @param bool $toggle
     *
     * @return $this
     */
    public function setShouldTreatBackgroundPositionZeroAsLengthValue($toggle)
    {
        $this->shouldTreatBackgroundPositionZeroAsLengthValue = $toggle;

        return $this;
    }
}
