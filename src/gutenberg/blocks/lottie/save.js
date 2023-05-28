/**
 * Internal dependencies
 */
import metadata from './block.json';

/**
 * WordPress dependencies
 */
const { applyFilters } = wp.hooks;

const { useBlockProps } = wp.blockEditor;

const { name } = metadata;

/**
 * Block Save Class.
 */
export default function BlockSave(props) {
  const { fileUrl, fileWidth, fileHeight, trigger, loop, direction, speed, width } =
    props.attributes;

  let className = 'ghostkit-lottie';

  className = applyFilters('ghostkit.blocks.className', className, {
    ...{
      name,
    },
    ...props,
  });

  const blockProps = useBlockProps.save({
    className,
    'data-trigger': trigger,
    style:
      fileWidth && fileHeight
        ? {
            '--gkt-lottie__ar': `${fileWidth} / ${fileHeight}`,
            '--gkt-lottie__width': width,
          }
        : {},
  });

  return (
    <div {...blockProps}>
      <lottie-player
        src={fileUrl}
        speed={speed}
        direction={direction}
        background="transparent"
        mode="normal"
        {...(!trigger ? { autoplay: 'autoplay' } : {})}
        {...(loop ? { loop: 'loop' } : {})}
        {...(trigger === 'hover' ? { hover: 'hover' } : {})}
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
}
