import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Loads and decorates the promo-banner block.
 *
 * Authored structure (4 cells max — xwalk/max-cells rule):
 *   Cell 1: Eyebrow label (text)
 *   Cell 2: Title (text)
 *   Cell 3: Body text (richtext)
 *   Cell 4: CTA link (aem-content picker — anchor element)
 *
 * Background colour variant via block name: "Promo Banner (Blue)"
 * EDS automatically adds "blue" as a CSS class on the block element.
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // 1. Read cells — UE delivers a single row with 4 cells
  const row = block.firstElementChild;
  const cells = row ? [...row.children] : [];

  const [eyebrowCell, titleCell, textCell, linkCell] = cells;

  // 2. Build the new DOM structure
  const banner = document.createElement('div');
  banner.className = 'promo-banner-inner';

  // Eyebrow (small label above the heading)
  if (eyebrowCell?.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'promo-banner-eyebrow';
    moveInstrumentation(eyebrowCell, eyebrow);
    eyebrow.textContent = eyebrowCell.textContent.trim();
    banner.append(eyebrow);
  }

  // Title
  if (titleCell) {
    const titleWrapper = document.createElement('div');
    titleWrapper.className = 'promo-banner-title';
    moveInstrumentation(titleCell, titleWrapper);

    const existingHeading = titleCell.querySelector('h1,h2,h3,h4,h5,h6');
    if (existingHeading) {
      titleWrapper.append(existingHeading);
    } else {
      const heading = document.createElement('h2');
      heading.textContent = titleCell.textContent.trim();
      titleWrapper.append(heading);
    }
    banner.append(titleWrapper);
  }

  // Body text
  if (textCell) {
    const text = document.createElement('div');
    text.className = 'promo-banner-text';
    moveInstrumentation(textCell, text);
    text.innerHTML = textCell.innerHTML;
    banner.append(text);
  }

  // CTA link — anchor comes directly from the aem-content picker
  if (linkCell) {
    const anchor = linkCell.querySelector('a');
    if (anchor) {
      const cta = document.createElement('div');
      cta.className = 'promo-banner-cta';
      moveInstrumentation(linkCell, cta);
      anchor.className = 'button primary';
      cta.append(anchor);
      banner.append(cta);
    }
  }

  // 3. Replace block children with the new structure
  block.replaceChildren(banner);
}
