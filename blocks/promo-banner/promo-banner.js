import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Loads and decorates the promo-banner block.
 *
 * Expected authored structure (one row with three cells + optional CTA row):
 *   Row 0: Eyebrow | Title | Body Text
 *   Row 1: CTA Link (optional)
 *
 * Background colour variant is applied via block style class, e.g. "Promo Banner (blue)".
 *
 * @param {Element} block The block element
 */
export default function decorate(block) {
  // 1. Read rows delivered by the UE / EDS backend
  const rows = [...block.children];

  // Row 0: eyebrow | title | body text
  const contentRow = rows[0];
  // Row 1 (optional): CTA link
  const ctaRow = rows[1];

  // 2. Extract individual cells
  const [eyebrowCell, titleCell, textCell] = [...(contentRow?.children || [])];
  const linkCell = ctaRow?.children[0];

  // 3. Build the new DOM structure
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

  // CTA button
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

  // 4. Replace block children with the new structure
  block.replaceChildren(banner);
}
