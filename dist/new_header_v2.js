"use strict";

$(function () {
  let activeImage = null; // Stores the permanently selected image
  let hoverEnabled = true; // Flag to track hover effect state
  let activeElement = null; // Stores the currently active element
  let $pageBody = $('html, body');
  let $accordionHeader = $('.accordion-header');
  let $menuColumn = $('.menu-column');
  let resizeTimeout;

  // Function to fade images based on targetId
  function fadeImage(targetId) {
    $('.img-wrapper').find('picture').each(function () {
      if ($(this).data('hash') === targetId) {
        $(this).fadeIn(400).siblings().fadeOut(800);
      }
    });
  }

  // Function to fade text based on targetId
  function fadeText(targetId) {
    $('.text-wrapper > div').each(function () {
      if ($(this).data('hash') === targetId) {
        $(this).fadeIn(400).siblings().fadeOut(400);
      } else if (targetId === 'hide') {
        $(this).fadeOut(400);
      }
    });
  }

  // Function to handle mouse enter event on menu items
  function handleMouseEnter() {
    if (hoverEnabled && !activeImage) {
      let targetId = $(this).data('hash');
      fadeImage(targetId);
      fadeText(targetId);
      $('.text-wrapper > div').fadeOut(400); // Fade out .text-wrapper
    }
  }

  // Function to handle mouse leave event on header
  function handleHeaderMouseLeave() {
    if (!activeImage) {
      fadeImage('item-00'); // Bring back the default image
      fadeText('item-00'); // Bring back the default text
      $('.text-wrapper').fadeIn(400); // Fade in .text-wrapper
    }
  }

  // Function to handle click event on the document
  function handleDocumentClick(event) {
    if (!$(event.target).closest('.fancy-header').length || !$(event.target).closest('.menu-column.hover').length) {
      activeImage = null;
      hoverEnabled = true; // Re-enable hover effect
      let itemContent = $('.item-content');
      if (!$(event.target).closest('.fancy-header').length) {
        fadeImage('item-00'); // Bring back the default image
        fadeText('item-00'); // Bring back the default text
      }
      if (itemContent.hasClass('active')) {
        $menuColumn.removeClass('hover'); // Remove hover class from all columns
        itemContent.removeClass('active').removeClass('overflow');
        $('.item-header').removeClass('active');
        $('.item').removeClass('active');
      }
      activeElement = null; // Reset the active element
    }

    // Close accordion if clicked outside '.menu'
    if ($(window).width() > 768) {
      if (!$(event.target).closest('.menu').length) {
        $('.accordion-content').slideUp(400);
        $accordionHeader.removeClass('accordion-open');
      }
    }
  }

  // Function to handle click event on accordion headers
  function accordionHandle(button, accordionContent, classToToggle) {
    $(button).off('click').on('click', function (event) {
      event.stopPropagation();
      event.preventDefault();

      // Toggle the visibility of the associated accordion content
      if ($(this).next(accordionContent).length) {
        $(accordionContent).not($(this).next(accordionContent)).slideUp(400);
        $(button).not($(this)).removeClass(classToToggle);
        $(this).next(accordionContent).slideToggle(400);
        $(this).toggleClass(classToToggle); // Add a class to indicate the active state
      }
    });
  }

  // Function to activate targets on button click
  function activateTargetsOnClick(button, targetNext, targetParent, activeClass) {
    $(button).off('click').on('click', function (event) {
      event.stopPropagation();
      hoverEnabled = false; // Disable hover effect

      // Fade images and text based on data0-hash
      activeImage = $(this).data('hash');
      fadeImage(activeImage);
      // fadeText(activeImage);
      fadeText('hide');
      $menuColumn.removeClass('hover');
      $(this).addClass(activeClass);
      $(this).parents(targetParent).addClass(activeClass);
      $(this).parents('.menu-column').addClass('hover');
      if ($(window).width() > 768) {
        setTimeout(() => {
          $(this).next(targetNext).addClass(activeClass).addClass('overflow');
        }, 800);
      } else {
        $(this).next(targetNext).addClass(activeClass).addClass('overflow');

        // Add 'no-scroll' class to prevent scrolling when the mobile menu is opened
        if (!$pageBody.hasClass('no-scroll')) {
          $pageBody.addClass('no-scroll');
        }
      }
    });
  }

  // Function to handle click event on back buttons
  function backButtonHandle(button, classToRemove, removeHover) {
    $(button).off('click').on('click', function (event) {
      event.stopPropagation();
      event.preventDefault();
      activeImage = null;
      hoverEnabled = true; // Re-enable hover effect
      fadeImage('item-00'); // Bring back the default image
      fadeText('item-00'); // Bring back the default text
      $(this).parents().removeClass(classToRemove);
      $(this).parents().siblings('.item-header').removeClass(classToRemove);
      $('.item-content').removeClass('overflow');
      if (removeHover) {
        setTimeout(function () {
          $menuColumn.removeClass('hover');
        }, 200); // Timeout is the same as the duration of the .item-content slide animation
      }
      if ($(this).hasClass('level-01')) {
        $pageBody.removeClass('no-scroll');
      }
    });
  }
  function initializeAccordion(windowWidth) {
    if (windowWidth > 768) {
      accordionHandle('.accordion-header', '.accordion-content', 'accordion-open');
    } else {
      activateTargetsOnClick('.accordion-header', '.accordion-content', '.item-content', 'menu-open');
    }
  }
  function initializeImageText(windowWidth) {
    if (windowWidth > 768) {
      $menuColumn.on('mouseenter', handleMouseEnter); // Disable hiding when mouseleave menu-column
      $('.fancy-header').on('mouseleave', handleHeaderMouseLeave);
    }
  }

  // Attach event handlers
  $(document).on('click', function (event) {
    handleDocumentClick(event);
  });

  // Initialize functions
  initializeAccordion($(window).width());
  initializeImageText($(window).width());
  activateTargetsOnClick('.menu-base', '.item-content', '.item', 'active');
  backButtonHandle('.back-button.level-01', 'active', true);
  backButtonHandle('.back-button.level-02', 'menu-open', false);

  // Throttle resize event using requestAnimationFrame
  $(window).on('resize', function () {
    if (resizeTimeout) {
      cancelAnimationFrame(resizeTimeout);
    }
    resizeTimeout = requestAnimationFrame(function () {
      resizeTimeout = null;
      $menuColumn.removeClass('hover');
      $('.item-content').removeClass('active');
      $('.item-header').removeClass('active');
      $('.item').removeClass('active');
      $('.accordion-header').removeClass('accordion-open');
      $('.accordion-content').removeAttr('style');
      initializeAccordion($(window).width());
      initializeImageText($(window).width());
      fadeImage('item-00'); // Bring back the default image
      fadeText('item-00'); // Bring back the default text
      $pageBody.removeClass('no-scroll');
    });
  });

  /* Removed by client request */
  /*   $(window).on('scroll', function () {
      if ($(this).scrollTop() > 100) {
        if (resizeTimeout) {
          cancelAnimationFrame(resizeTimeout);
        }
        resizeTimeout = requestAnimationFrame(function () {
          resizeTimeout = null;
          $menuColumn.removeClass('hover');
          $('.item-content').removeClass('active');
          $('.item-header').removeClass('active');
          $('.item').removeClass('active');
          $('.accordion-header').removeClass('accordion-open');
          $('.accordion-content').removeAttr('style');
          initializeAccordion($(window).width());
          initializeImageText($(window).width());
          fadeImage('item-00'); // Bring back the default image
          fadeText('item-00'); // Bring back the default text
        });
      }
    }); */
});