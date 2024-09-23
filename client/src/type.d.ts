import { IconifyIconHTMLElement } from 'iconify-icon';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon-2': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >; // The 'any' just for testing purposes
      'iconify-icon': Partial<IconifyIconHTMLElement>;
    }
  }
}
