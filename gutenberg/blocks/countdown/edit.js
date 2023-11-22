/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import ColorPicker from '../../components/color-picker';
import DateTimePicker from '../../components/date-time-picker';
import RangeControl from '../../components/range-control';

import countDownApi from './api';
import { TIMEZONELESS_FORMAT } from './constants';

/**
 * WordPress dependencies
 */
const { GHOSTKIT, luxon } = window;

import { applyFilters } from '@wordpress/hooks';

import { __ } from '@wordpress/i18n';

import { useSelect } from '@wordpress/data';

import { Fragment, useEffect, useState, useRef } from '@wordpress/element';

import { PanelBody, SelectControl, ToolbarGroup, ToolbarButton } from '@wordpress/components';

import { InspectorControls, useBlockProps, useInnerBlocksProps, BlockControls } from '@wordpress/block-editor';

/**
 * Block Edit function.
 */
export default function BlockEdit(props) {
  const { attributes, setAttributes, clientId } = props;
  const { date, units, unitsAlign, numberFontSize, labelFontSize, numberColor, labelColor } =
    attributes;

  let { className = '' } = props;

  function parseData(newDate, newUnits) {
    const formattedDate = luxon.DateTime.fromISO(newDate).toFormat(TIMEZONELESS_FORMAT);
    const currentDate = new Date(
      luxon.DateTime.now().setZone(GHOSTKIT.timezone).toFormat(TIMEZONELESS_FORMAT)
    );

    const apiData = countDownApi(new Date(formattedDate), currentDate, newUnits, 0);

    return {
      formattedDate,
      delay: countDownApi.getDelay(newUnits),
      ...apiData,
    };
  }

  const [dateData, setDateData] = useState(date ? parseData(date, units) : false);
  const interval = useRef(false);

  const { isSelectedBlockInRoot } = useSelect(
    (select) => {
      const { isBlockSelected, hasSelectedInnerBlock } = select('core/block-editor');

      return {
        isSelectedBlockInRoot: isBlockSelected(clientId) || hasSelectedInnerBlock(clientId, true),
      };
    },
    [clientId]
  );

  function updateDate(newDate, newUnits) {
    const data = parseData(newDate, newUnits);

    setDateData(data);

    if (data.formattedDate !== date) {
      setAttributes({
        date: data.formattedDate,
      });
    }
  }

  // Mount.
  useEffect(() => {
    // generate date.
    if (!date) {
      const today = new Date();
      const newDate = new Date();
      newDate.setDate(today.getDate() + 1);

      const formattedDate = luxon.DateTime.fromJSDate(newDate).toFormat(TIMEZONELESS_FORMAT);

      updateDate(formattedDate, units);
    } else {
      updateDate(date, units);
    }
  }, []);

  // Changed date data and run interval.
  useEffect(() => {
    clearInterval(interval.current);

    if (!dateData) {
      return;
    }

    interval.current = setInterval(() => {
      if (!date || !units || !units.length) {
        return;
      }

      const data = parseData(date, units);

      setDateData(data);
    }, dateData.delay);
  }, [dateData]);

  className = classnames(
    'ghostkit-countdown',
    unitsAlign ? `ghostkit-countdown-units-align-${unitsAlign}` : '',
    className
  );

  className = applyFilters('ghostkit.editor.className', className, props);

  const blockProps = useBlockProps({ className });
  const innerBlockProps = useInnerBlocksProps(
    { className: 'ghostkit-countdown-expire-action-content' },
    {
      template: [
        [
          'core/paragraph',
          { content: __('This countdown has been ended already!', '@@text_domain') },
        ],
      ],
      templateLock: false,
    }
  );

  return (
    <Fragment>
      <InspectorControls>
        <PanelBody>
          <DateTimePicker
            label={__('End Date', '@@text_domain')}
            value={date}
            onChange={(value) => updateDate(value, units)}
          />
          <SelectControl
            label={__('Display Units', '@@text_domain')}
            value={units}
            onChange={(value) => {
              setAttributes({ units: value });
              updateDate(date, value);
            }}
            multiple
            options={[
              {
                label: __('Years', '@@text_domain'),
                value: 'years',
              },
              {
                label: __('Months', '@@text_domain'),
                value: 'months',
              },
              {
                label: __('Weeks', '@@text_domain'),
                value: 'weeks',
              },
              {
                label: __('Days', '@@text_domain'),
                value: 'days',
              },
              {
                label: __('Hours', '@@text_domain'),
                value: 'hours',
              },
              {
                label: __('Minutes', '@@text_domain'),
                value: 'minutes',
              },
              {
                label: __('Seconds', '@@text_domain'),
                value: 'seconds',
              },
            ]}
          />
        </PanelBody>
        <PanelBody>
          <RangeControl
            label={__('Number Font Size', '@@text_domain')}
            value={numberFontSize}
            onChange={(value) => setAttributes({ numberFontSize: value })}
            beforeIcon="editor-textcolor"
            afterIcon="editor-textcolor"
            allowCustomMax
          />
          <RangeControl
            label={__('Label Font Size', '@@text_domain')}
            value={labelFontSize}
            onChange={(value) => setAttributes({ labelFontSize: value })}
            beforeIcon="editor-textcolor"
            afterIcon="editor-textcolor"
            allowCustomMax
          />
          <ColorPicker
            label={__('Number Color', '@@text_domain')}
            value={numberColor}
            onChange={(val) => setAttributes({ numberColor: val })}
            alpha
          />
          <ColorPicker
            label={__('Label Color', '@@text_domain')}
            value={labelColor}
            onChange={(val) => setAttributes({ labelColor: val })}
            alpha
          />
        </PanelBody>
      </InspectorControls>
      <BlockControls>
        <ToolbarGroup>
          <ToolbarButton
            icon="align-left"
            title={__('Units Align Left', '@@text_domain')}
            onClick={() => setAttributes({ unitsAlign: 'left' })}
            isActive={unitsAlign === 'left'}
          />
          <ToolbarButton
            icon="align-center"
            title={__('Units Align Center', '@@text_domain')}
            onClick={() => setAttributes({ unitsAlign: 'center' })}
            isActive={unitsAlign === 'center'}
          />
          <ToolbarButton
            icon="align-right"
            title={__('Units Align Right', '@@text_domain')}
            onClick={() => setAttributes({ unitsAlign: 'right' })}
            isActive={unitsAlign === 'right'}
          />
        </ToolbarGroup>
      </BlockControls>
      <div {...blockProps}>
        {units.map((unitName) => {
          let formattedUnit = false;

          if (dateData && typeof dateData[unitName] !== 'undefined') {
            const isEnd = dateData.value >= 0;

            formattedUnit = countDownApi.formatUnit(isEnd ? 0 : dateData[unitName], unitName);
          }

          return (
            <div
              key={unitName}
              className={classnames(
                'ghostkit-countdown-unit',
                `ghostkit-countdown-unit-${unitName}`
              )}
            >
              <span className="ghostkit-countdown-unit-number">
                {formattedUnit ? formattedUnit.number : '00'}
              </span>
              <span className="ghostkit-countdown-unit-label">
                {formattedUnit ? formattedUnit.label : unitName}
              </span>
            </div>
          );
        })}
      </div>
      {isSelectedBlockInRoot ? (
        <div className="ghostkit-countdown-expire-action">
          <div className="ghostkit-countdown-expire-action-label">
            {__('Display content after expiration:', '@@text_domain')}
          </div>

          <div {...innerBlockProps} />
        </div>
      ) : (
        ''
      )}
    </Fragment>
  );
}
