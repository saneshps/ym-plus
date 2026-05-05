/**
 * components.js — Global Header & Footer Loader
 * ─────────────────────────────────────────────────────────────
 * Add to every page:
 *
 *   Inside .page-wrapper (first child):
 *     <div id="global-header"></div>
 *
 *   Outside .page-wrapper, before other <script> tags:
 *     <div id="global-footer"></div>
 *     <script src="assets/js/components.js"></script>
 *
 * NOTE: components.js must be included BEFORE script.js so that
 *       jQuery-dependent nav init can be re-run after inject.
 * ─────────────────────────────────────────────────────────────
 */

(function () {
    'use strict';

    /* ── Fetch a partial HTML file and replace a placeholder div ── */
    function loadComponent(url, targetId) {
        return fetch(url)
            .then(function (res) {
                if (!res.ok) throw new Error('Cannot load ' + url + ' (' + res.status + ')');
                return res.text();
            })
            .then(function (html) {
                var el = document.getElementById(targetId);
                if (el) {
                    el.outerHTML = html;
                } else {
                    console.warn('[components.js] Placeholder #' + targetId + ' not found.');
                }
            })
            .catch(function (err) { console.error('[components.js]', err); });
    }

    document.addEventListener('DOMContentLoaded', function () {

        /* Fetch both partials in parallel */
        Promise.all([
            loadComponent('header.html', 'global-header'),
            loadComponent('footer.html', 'global-footer')
        ]).then(function () {

            /* Tell other scripts the DOM is ready */
            document.dispatchEvent(new Event('componentsLoaded'));

            /* Re-run navigation setup (script.js runs before inject) */
            initNavigation();
        });
    });

    /**
     * initNavigation()
     * Mirrors the nav-setup block in script.js (lines 571-625).
     * Because header.html is fetched async, script.js has already
     * executed and found no header elements. We repeat the same
     * logic here after the markup is in the DOM.
     */
    function initNavigation() {
        if (typeof jQuery === 'undefined') {
            console.warn('[components.js] jQuery not available for nav init.');
            return;
        }

        var $ = jQuery;

        /* ── 1. Active page highlight ── */
        function dynamicCurrentMenuClass(selector) {
            var fileName = window.location.href.split('/').reverse()[0];
            selector.find('li').each(function () {
                if ($(this).find('a').attr('href') === fileName) {
                    $(this).addClass('current');
                }
            });
            selector.children('li').each(function () {
                if ($(this).find('.current').length) $(this).addClass('current');
            });
            if (fileName === '') selector.find('li').eq(0).addClass('current');
        }

        if ($('.main-menu__list').length) {
            dynamicCurrentMenuClass($('.main-menu__list'));
        }

        /* ── 2. Clone desktop nav list into mobile nav container ── */
        if ($('.main-menu__list').length && $('.mobile-nav__container').length) {
            document.querySelector('.mobile-nav__container').innerHTML =
                document.querySelector('.main-menu__list').outerHTML;
        }

        /* ── 3. Clone full menu into sticky header ── */
        if ($('.main-menu').length && $('.sticky-header__content').length) {
            document.querySelector('.sticky-header__content').innerHTML =
                document.querySelector('.main-menu').innerHTML;
        }

        /* ── 4. Add expand-toggle buttons to mobile dropdown items ── */
        var dropdownAnchors = $('.mobile-nav__container .main-menu__list .dropdown > a');
        dropdownAnchors.each(function () {
            var self = $(this);
            /* Guard against duplicate buttons if called multiple times */
            if (self.find('button[aria-label="dropdown toggler"]').length) return;

            var btn = document.createElement('BUTTON');
            btn.setAttribute('aria-label', 'dropdown toggler');
            btn.innerHTML = "<i class='fa fa-angle-down'></i>";
            self.append(btn);

            self.find('button').on('click', function (e) {
                e.preventDefault();
                var $b = $(this);
                $b.toggleClass('expanded');
                $b.parent().toggleClass('expanded');
                $b.parent().parent().children('ul').slideToggle();
            });
        });

        /* ── 5. Hamburger toggler ──────────────────────────────────────────────
         * Use event delegation on $(document) so the handler works even if the
         * element was not in the DOM when script.js first ran.
         * We namespace the events (.mobileNav) to allow clean re-binding.  */
        $(document).off('click.mobileNav', '.mobile-nav__toggler');
        $(document).on('click.mobileNav', '.mobile-nav__toggler', function (e) {
            e.preventDefault();
            $('.mobile-nav__wrapper').toggleClass('expanded');
            $('body').toggleClass('locked');
        });

        /* ── 6. Search popup toggler ── */
        $(document).off('click.searchToggle', '.search-toggler');
        $(document).on('click.searchToggle', '.search-toggler', function (e) {
            e.preventDefault();
            $('.search-popup').toggleClass('active');
            $('.mobile-nav__wrapper').removeClass('expanded');
            $('body').toggleClass('locked');
        });
    }

})();
