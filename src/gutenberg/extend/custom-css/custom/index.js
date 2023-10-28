/* eslint-disable react/no-danger */
/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import useStyles from '../../../hooks/use-styles';
import CodeEditor from '../../../components/code-editor';
import { maybeEncode, maybeDecode } from '../../../utils/encode-decode';

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

function CustomCSSCustomTools(props) {
  const [defaultPlaceholder, setDefaultPlaceholder] = useState(placeholder);

  const { getStyle, hasStyle, setStyles } = useStyles(props);

  const hasCustom = hasStyle('custom');

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
        if (hasStyle('custom')) {
          setStyles({ custom: undefined });
        }
      }}
      isShownByDefault={false}
    >
      <BaseControl label={__('Custom', '@@text_domain')}>
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
                value={maybeDecode(getStyle('custom') || defaultPlaceholder)}
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
              <CodeEditor
                mode="css"
                onChange={(value) => {
                  if (value !== placeholder) {
                    setStyles({ custom: maybeEncode(value) });
                  }

                  // Reset placeholder.
                  if (defaultPlaceholder) {
                    setDefaultPlaceholder('');
                  }
                }}
                value={maybeDecode(getStyle('custom') || defaultPlaceholder)}
                maxLines={20}
                minLines={5}
                height="300px"
              />
              <p style={{ marginBottom: 20 }} />
              <p
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
