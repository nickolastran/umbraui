import { forwardRef, lazy } from 'react';
import type { HTMLAttributes } from 'react';
import { cx } from '../../utils/cx';
import type { Scene3DProps } from '../stage/types';
import { StageLayer, mergeRefs, useStage } from '../stage/useStage';
import { UMBRA_MARK } from './mark';

const Scene = lazy(() => import('./Logo3D.scene'));

/** Props for {@link Logo3D}. */
export interface Logo3DProps extends Omit<HTMLAttributes<HTMLDivElement>, 'aria-label'>, Scene3DProps {
  /** Accessible name: what the logo says or represents. Required because the canvas itself has no text. */
  'aria-label': string;
  /** SVG path data (`d`) to extrude, drawn in a 100×100 box. Defaults to the Umbra mark. */
  path?: string;
  /** Text to extrude instead of a path. Needs `font`. */
  text?: string;
  /** three.js typeface: a URL to a `.typeface.json` file or the parsed JSON. Required with `text`. */
  font?: string | object;
  /** Extrusion depth relative to the logo's size. @default 0.18 */
  depth?: number;
}

/**
 * An extruded, lit 3D logo that floats and turns toward the pointer. Give it an SVG path, or text plus a
 * three.js typeface. Exposed to assistive tech as a single image named by `aria-label`.
 */
export const Logo3D = forwardRef<HTMLDivElement, Logo3DProps>(function Logo3D(
  { quality = 'medium', fallback, reducedMotion, path = UMBRA_MARK, text, font, depth = 0.18, className, ...rest },
  ref,
) {
  const stage = useStage({ reducedMotion });
  const builtIn =
    text && font ? (
      <span className="umbra-logo-3d__text" aria-hidden="true">
        {text}
      </span>
    ) : (
      <svg className="umbra-logo-3d__mark" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <path d={path} fillRule="evenodd" />
      </svg>
    );
  return (
    <div ref={mergeRefs(ref, stage.setEl)} role="img" className={cx('umbra-stage umbra-logo-3d', className)} {...rest}>
      <StageLayer stage={stage} fallback={fallback ?? builtIn}>
        <Scene {...stage.sceneProps} quality={quality} path={path} text={text} font={font as never} depth={depth} />
      </StageLayer>
    </div>
  );
});
