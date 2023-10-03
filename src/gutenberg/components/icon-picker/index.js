/* eslint-disable react/no-unstable-nested-components */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { List, CellMeasurer, CellMeasurerCache, AutoSizer } from 'react-virtualized';
import 'react-virtualized/styles.css';

/**
 * Internal dependencies
 */
import dashCaseToTitle from '../../utils/dash-case-to-title';
import { maybeEncode, maybeDecode } from '../../utils/encode-decode';

const { GHOSTKIT } = window;

/**
 * WordPress dependencies
 */
const { Fragment, useRef, useEffect, useState } = wp.element;

const { __ } = wp.i18n;

const { Button, Dropdown, Tooltip, BaseControl, TextControl, TextareaControl, G, Path, SVG } =
  wp.components;

/**
 * Go over each icon.
 *
 * @param {Function} callback callback.
 */
function eachIcons(callback) {
  const { icons, settings } = GHOSTKIT;

  Object.keys(icons).forEach((key) => {
    const allow =
      typeof settings[`icon_pack_${key}`] === 'undefined' || settings[`icon_pack_${key}`];

    if (allow) {
      callback(icons[key]);
    }
  });
}

/**
 * Get Icon Tip.
 *
 * @param {Object} iconData icon data.
 *
 * @return {String} tip
 */
function getIconTip(iconData) {
  let result = '';

  if (iconData.keys) {
    result = dashCaseToTitle(iconData.keys.split(',')[0]);
  }

  return result;
}

// we need this lazy loading component to prevent a huge lags while first loading SVG icons
function Icon(props) {
  const { iconData, onClick, active } = props;

  return (
    <IconPicker.Preview
      className={classnames(
        'ghostkit-component-icon-picker-button',
        active ? 'ghostkit-component-icon-picker-button-active' : ''
      )}
      onClick={onClick}
      data={iconData}
    />
  );
}

const hiddenIconCategories = {};

/**
 * Dropdown
 */
function IconPickerDropdown(props) {
  const cellMCache = useRef();

  const { onChange, value, label, className, renderToggle } = props;

  const [search, setSearch] = useState('');
  const [hiddenCategories, setHiddenCategories] = useState(hiddenIconCategories);
  const [customizeIcon, setCustomizeIcon] = useState(false);

  // Mounted.
  useEffect(() => {
    cellMCache.current = new CellMeasurerCache({
      defaultHeight: 65,
      fixedWidth: true,
    });
  }, []);

  // Mounted and updated.
  useEffect(() => {
    if (cellMCache.current) {
      cellMCache.current.clearAll();
    }
  });

  function getDropdownContent() {
    const rows = [
      {
        key: 'form',
        render: (
          <Fragment key="form">
            <TextControl
              label={__('Search Icon', '@@text_domain')}
              value={maybeDecode(search)}
              onChange={(searchVal) => setSearch(maybeEncode(searchVal))}
              placeholder={__('Type to Search...', '@@text_domain')}
              autoComplete="off"
              autoFocus
            />
            <div className="ghostkit-component-icon-picker-input-output">
              {customizeIcon ? (
                <TextareaControl
                  label={__('Icon Output', '@@text_domain')}
                  value={value}
                  onChange={(newData) => {
                    onChange(newData);
                  }}
                  placeholder={__('Icon Output', '@@text_domain')}
                  autoComplete="off"
                />
              ) : (
                <Button
                  isSmall
                  isSecondary
                  onClick={() => setCustomizeIcon(true)}
                  style={{
                    marginRight: 5,
                  }}
                >
                  {__('Customize Icon', '@@text_domain')}
                </Button>
              )}
              <Button isSmall isSecondary disabled={!value} onClick={() => onChange('')}>
                {__('Reset', '@@text_domain')}
              </Button>
            </div>
          </Fragment>
        ),
      },
    ];

    eachIcons((iconsData) => {
      const showCategory =
        typeof hiddenCategories[iconsData.name] !== 'undefined'
          ? hiddenCategories[iconsData.name]
          : true;
      const searchString = search.toLowerCase();

      // prepare all icons.
      const allIcons = iconsData.icons
        .filter((iconData) => {
          if (
            !searchString ||
            (searchString && iconData.keys.indexOf(searchString.toLowerCase()) > -1)
          ) {
            return true;
          }

          return false;
        })
        .map((iconData) => {
          const iconTip = getIconTip(iconData);

          const result = (
            <Icon
              active={maybeDecode(iconData.svg) === maybeDecode(value)}
              iconData={iconData}
              onClick={() => {
                onChange(maybeDecode(iconData.svg));
              }}
            />
          );

          if (iconTip) {
            return (
              <Tooltip key={maybeDecode(iconData.svg)} text={iconTip}>
                {/* We need this <div> just because Tooltip don't work without it */}
                <div>{result}</div>
              </Tooltip>
            );
          }

          return result;
        });

      if (!allIcons.length) {
        return;
      }

      // prepare icons category toggle title.
      rows.push({
        key: `title-${iconsData.name}`,
        render: (
          // Used PanelBody https://github.com/WordPress/gutenberg/blob/master/packages/components/src/panel/body.js.
          <div
            className={classnames(
              'components-panel__body ghostkit-component-icon-picker-list-panel-toggle',
              showCategory ? 'is-opened' : ''
            )}
          >
            <h2 className="components-panel__body-title">
              <Button
                className="components-panel__body-toggle"
                onClick={() => {
                  setHiddenCategories({
                    ...hiddenCategories,
                    [iconsData.name]: !showCategory,
                  });
                }}
                aria-expanded={showCategory}
              >
                {/*
                    Firefox + NVDA don't announce aria-expanded because the browser
                    repaints the whole element, so this wrapping span hides that.
                */}
                <span aria-hidden="true">
                  {showCategory ? (
                    <SVG
                      className="components-panel__arrow"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <G>
                        <Path fill="none" d="M0,0h24v24H0V0z" />
                      </G>
                      <G>
                        <Path d="M12,8l-6,6l1.41,1.41L12,10.83l4.59,4.58L18,14L12,8z" />
                      </G>
                    </SVG>
                  ) : (
                    <SVG
                      className="components-panel__arrow"
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <G>
                        <Path fill="none" d="M0,0h24v24H0V0z" />
                      </G>
                      <G>
                        <Path d="M7.41,8.59L12,13.17l4.59-4.58L18,10l-6,6l-6-6L7.41,8.59z" />
                      </G>
                    </SVG>
                  )}
                </span>
                {iconsData.name}
              </Button>
            </h2>
          </div>
        ),
      });

      if (!showCategory) {
        return;
      }

      let currentIcons = [];

      allIcons.forEach((icon, i) => {
        currentIcons.push(icon);

        if (currentIcons.length === 3 || allIcons.length === i + 1) {
          rows.push({
            key: 'icons',
            render: <div className="ghostkit-component-icon-picker-list">{currentIcons}</div>,
          });

          currentIcons = [];
        }
      });
    });

    // No icons.
    if (rows.length === 1) {
      rows.push({
        key: 'icons',
        render: __('No icons found.', '@@text_domain'),
      });
    }

    const result = (
      <AutoSizer key={`autosizer-${customizeIcon ? '1' : '0'}`}>
        {({ width, height }) => (
          <List
            className="ghostkit-component-icon-picker-list-wrap"
            width={width}
            height={height}
            rowCount={rows.length}
            rowHeight={cellMCache?.current?.rowHeight}
            rowRenderer={(data) => {
              const { index, style, parent, key } = data;

              return (
                <CellMeasurer
                  cache={cellMCache?.current}
                  columnIndex={0}
                  key={key}
                  rowIndex={index}
                  parent={parent}
                >
                  {() => <div style={style}>{rows[index].render || ''}</div>}
                </CellMeasurer>
              );
            }}
          />
        )}
      </AutoSizer>
    );

    return (
      <Fragment>
        <div className="ghostkit-component-icon-picker-sizer" />
        <div className="ghostkit-component-icon-picker">{result}</div>
      </Fragment>
    );
  }

  const dropdown = (
    <Dropdown
      className={className}
      contentClassName="ghostkit-component-icon-picker-content"
      renderToggle={renderToggle}
      focusOnMount={false}
      renderContent={() => getDropdownContent()}
    />
  );

  return label ? (
    <BaseControl label={label} className={className}>
      {dropdown}
    </BaseControl>
  ) : (
    dropdown
  );
}

export default function IconPicker(props) {
  const { value, label, onChange } = props;

  return (
    <IconPicker.Dropdown
      label={label}
      className="ghostkit-component-icon-picker-wrapper"
      onChange={(val) => onChange(maybeEncode(val))}
      value={maybeDecode(value)}
      renderToggle={({ isOpen, onToggle }) => (
        <Tooltip text={__('Icon Picker', '@@text_domain')}>
          {/* We need this <div> just because Tooltip don't work without it */}
          <div>
            <IconPicker.Preview
              className="ghostkit-component-icon-picker-button hover"
              aria-expanded={isOpen}
              onClick={onToggle}
              name={maybeDecode(value)}
              alwaysRender
            />
          </div>
        </Tooltip>
      )}
    />
  );
}

// dropdown
IconPicker.Dropdown = IconPickerDropdown;

// preview icon.
IconPicker.Preview = function (props) {
  const { onClick, className, alwaysRender = false } = props;

  let { data, name } = props;

  if (!data && name) {
    eachIcons((iconsData) => {
      iconsData.icons.forEach((iconData) => {
        if (
          !data &&
          iconData.svg &&
          (iconData.svg === name ||
            (iconData.fallback && iconData.fallback === name && iconData.svg))
        ) {
          if (iconData.svg) {
            data = iconData;
          } else {
            name = iconData.class;
          }
        }
      });
    });
  }

  let result = '';

  if (data && data.svg) {
    result = data.svg;
  } else if (name || (data && data.class)) {
    result = name || data.class;
  }

  return result || alwaysRender ? (
    <IconPicker.Render
      name={maybeDecode(result)}
      tag="span"
      className={classnames(
        className,
        'ghostkit-component-icon-picker-preview',
        onClick ? 'ghostkit-component-icon-picker-preview-clickable' : ''
      )}
      onClick={onClick}
      onKeyPress={() => {}}
      role="button"
      tabIndex={0}
      alwaysRender={alwaysRender}
    />
  ) : (
    ''
  );
};

// render icon.
IconPicker.Render = function (props) {
  const {
    tag = 'span',
    className,
    onClick,
    onKeyPress,
    role,
    tabIndex,
    alwaysRender = false,
  } = props;

  let { name } = props;

  const Tag = tag;
  let result = '';

  name = maybeDecode(name);

  if (name && /^</g.test(name)) {
    result = name;
  } else if (name) {
    result = `<span class="${name}"></span>`;
  }

  if (!result && !alwaysRender) {
    return null;
  }

  return (
    <Tag
      dangerouslySetInnerHTML={{ __html: result }}
      className={className}
      onClick={onClick}
      onKeyPress={onKeyPress}
      role={role}
      tabIndex={tabIndex}
    />
  );
};
