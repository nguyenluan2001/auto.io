import { IconifyIconHTMLElement } from 'iconify-icon';

interface Props extends Partial<IconifyIconHTMLElement> {
  style: any;
}

function Iconify({ style, ...props }: Props) {
  return (
    <iconify-icon {...props} style={style as unknown as CSSStyleDeclaration} />
  );
}
export default Iconify;
