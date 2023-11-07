/* eslint-disable react/no-danger */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';
import { addCompleter } from 'ace-builds/src-noconflict/ext-language_tools';

/**
 * Internal dependencies
 */
import ResponsiveToggle from '../../../components/responsive-toggle';
import useStyles from '../../../hooks/use-styles';
import useResponsive from '../../../hooks/use-responsive';
import CodeEditor from '../../../components/code-editor';

/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

const { addFilter } = wp.hooks;

const { useState } = wp.element;

const { hasBlockSupport } = wp.blocks;

const {
  BaseControl,
  Dropdown,
  Button,
  ToolsPanelItem: __stableToolsPanelItem,
  __experimentalToolsPanelItem,
} = wp.components;

const ToolsPanelItem = __stableToolsPanelItem || __experimentalToolsPanelItem;

const placeholder = 'selector {\n\n}';

/**
 * Autocomplete for `selector`.
 */
addCompleter({
  getCompletions(editor, session, pos, prefix, callback) {
    if (editor.id === 'gkt-custom-css-editor') {
      callback(null, [
        {
          caption: 'selector',
          value: 'selector',
          meta: __('Block Selector', '@@text_domain'),
        },
      ]);
    }
  },
  identifierRegexps: [/selector/],
});

function CustomCSSCustomTools(props) {
  const [defaultPlaceholder, setDefaultPlaceholder] = useState(placeholder);

  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const { device, allDevices } = useResponsive();

  let hasCustom = false;

  ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
    hasCustom = hasCustom || hasStyle('custom', thisDevice);
  });

  return (
    <ToolsPanelItem
      label={__('Custom', '@@text_domain')}
      hasValue={() => !!hasCustom}
      onSelect={() => {
        if (!hasStyle('custom')) {
          setStyles({ custom: '' });
        }
      }}
      onDeselect={() => {
        const propsToReset = {};

        ['', ...Object.keys(allDevices)].forEach((thisDevice) => {
          if (thisDevice) {
            propsToReset[`media_${thisDevice}`] = {};
          }

          if (thisDevice) {
            propsToReset[`media_${thisDevice}`].custom = undefined;
          } else {
            propsToReset.custom = undefined;
          }
        });

        setStyles(propsToReset);
      }}
      isShownByDefault={false}
    >
      <BaseControl
        label={
          <>
            {__('Custom', '@@text_domain')}
            <ResponsiveToggle
              checkActive={(checkMedia) => {
                return hasStyle('custom', checkMedia);
              }}
            />
          </>
        }
      >
        <Dropdown
          className="ghostkit-extension-customCSS-custom__dropdown"
          contentClassName="ghostkit-extension-customCSS-custom__dropdown-content"
          popoverProps={{
            placement: 'left-start',
            offset: 36,
            shift: true,
          }}
          renderToggle={({ isOpen, onToggle }) => (
            <Button
              className={classnames(
                'ghostkit-extension-customCSS-custom__dropdown-content-toggle',
                isOpen ? 'ghostkit-extension-customCSS-custom__dropdown-content-toggle-active' : ''
              )}
              onClick={() => {
                onToggle();
              }}
            >
              <span>{__('Edit CSS', '@@text_domain')}</span>
              <CodeEditor
                mode="css"
                value={getStyle('custom', device) || defaultPlaceholder}
                maxLines={7}
                minLines={3}
                height="200px"
                showPrintMargin={false}
                showGutter={false}
                highlightActiveLine={false}
                setOptions={{
                  enableBasicAutocompletion: false,
                  enableLiveAutocompletion: false,
                  enableSnippets: false,
                  showLineNumbers: false,
                }}
              />
            </Button>
          )}
          renderContent={() => (
            <>
              <BaseControl
                label={
                  <>
                    {__('Custom', '@@text_domain')}
                    <ResponsiveToggle
                      checkActive={(checkMedia) => {
                        return hasStyle('custom', checkMedia);
                      }}
                    />
                  </>
                }
              />
              <CodeEditor
                mode="css"
                onChange={(value) => {
                  if (value !== placeholder) {
                    setStyles({ custom: value }, device);
                  }

                  // Reset placeholder.
                  if (defaultPlaceholder) {
                    setDefaultPlaceholder('');
                  }
                }}
                value={getStyle('custom', device) || defaultPlaceholder}
                maxLines={20}
                minLines={5}
                height="300px"
                editorProps={{
                  id: 'gkt-custom-css-editor',
                }}
              />
              <p style={{ marginBottom: 20 }} />
              <details>
                <summary
                  label={__('Examples to use selector', '@@text_domain')}
                  dangerouslySetInnerHTML={{
                    __html: __('Use %s rule to change block styles.', '@@text_domain').replace(
                      '%s',
                      '<code>selector</code>'
                    ),
                  }}
                />
                <p>{__('Example:', '@@text_domain')}</p>
                <pre className="ghostkit-control-pre-custom-css">
                  {`selector {
  background-color: #2F1747;
}

selector p {
  color: #2F1747;
}`}
                </pre>
              </details>
            </>
          )}
        />
      </BaseControl>
    </ToolsPanelItem>
  );
}

addFilter(
  'ghostkit.extension.customCSS.tools',
  'ghostkit/extension/customCSS/tools/custom',
  (children, { props }) => {
    const hasCustomSupport = hasBlockSupport(props.name, ['ghostkit', 'customCSS', 'custom']);

    if (!hasCustomSupport) {
      return children;
    }

    return (
      <>
        {children}
        <CustomCSSCustomTools {...props} />
      </>
    );
  }
);
