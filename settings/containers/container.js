/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * Internal dependencies
 */
import getPages from '../pages';
import Logo from '../../gutenberg/icons/ghostkit-text-logo.svg';

/**
 * WordPress dependencies
 */
const { Fragment, useState, useEffect } = wp.element;

const { __ } = wp.i18n;

export default function Container(props) {
  const { data } = props;

  const [pages, setPages] = useState({});
  const [activePage, setActivePage] = useState('');

  // Mounted.
  useEffect(() => {
    // get variable.
    const $_GET = [];
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (a, name, value) => {
      $_GET[name] = value;
    });

    const newPages = getPages();

    setPages(newPages);
    setActivePage($_GET.sub_page ? $_GET.sub_page : Object.keys(newPages)[0]);
  }, []);

  // Changed page.
  useEffect(() => {
    // disable active links.
    document.querySelectorAll('.toplevel_page_ghostkit .current').forEach(($el) => {
      $el.classList.remove('current');
    });

    // find new active link.
    let $links = document.querySelectorAll(
      `.toplevel_page_ghostkit [href="admin.php?page=ghostkit&sub_page=${activePage}"]`
    );

    if (!$links || !$links.length) {
      $links = document.querySelectorAll(
        '.toplevel_page_ghostkit [href="admin.php?page=ghostkit"]'
      );
    }

    $links.forEach(($link) => {
      $link.parentNode.classList.add('current');
    });

    // change address bar link
    if ($links && $links.length) {
      window.history.pushState(document.title, document.title, $links[0].href);
    }
  }, [activePage]);

  const resultTabs = [];
  let resultContent = '';

  Object.keys(pages).forEach((k) => {
    resultTabs.push(
      <li key={k}>
        {/* eslint-disable-next-line react/button-has-type */}
        <button
          className={classnames(
            'ghostkit-admin-tabs-button',
            activePage === k ? 'ghostkit-admin-tabs-button-active' : ''
          )}
          onClick={() => {
            setActivePage(k);
          }}
        >
          {pages[k].label}
        </button>
      </li>
    );
  });

  if (activePage && pages[activePage]) {
    const NewBlock = pages[activePage].block;

    resultContent = (
      <Fragment>
        <h2>{pages[activePage].label}</h2>
        <NewBlock data={data} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <div className="ghostkit-admin-head">
        <div className="ghostkit-admin-head-wrap">
          <a
            href="https://ghostkit.io/?utm_source=plugin&utm_medium=settings&utm_campaign=logo&utm_content=@@plugin_version"
            aria-label={__('Ghost Kit', '@@text_domain')}
          >
            <Logo />
          </a>
          <ul className="ghostkit-admin-tabs">{resultTabs}</ul>
        </div>
      </div>
      <div className="ghostkit-admin-content">{resultContent}</div>
    </Fragment>
  );
}
