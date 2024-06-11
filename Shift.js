/**
 * Shift JS
 * A Dependency free and light weight slider plugin for Javascript
 */

class Shift {
  /**
   * @param {string} selectors
   * @param {object} config
   */
  constructor(selectors, config) {
    this.config = config;
    this.initCount = 0;

    // Selectors
    this.selectors = typeof selectors === 'string' 
      ? document.querySelectorAll(selectors) 
      : console.error('Selector not defined or invalid on [ new Shift() ]');

    // Default Options
    this.defaultOptions = {
      autoplay: true,
      autoplaySpeed: 1000,
      showDots: true,
      showProgressBar: true,
      showArrows: true,
      nextArrow: 'Next',
      prevArrow: 'Previous',
      adaptiveHeight: true,
      // dotsPosition: 'center-bottom',
      // arrowPosition: 'left-bottom', // center-left right-center left-bottom right-bottom left-top right-top
      slideDirection: 'right',
      draggable: true,
      fade: false,
      infinite: true,
      pauseOnFocus: false,
      pauseOnHover: false,
      pauseOnDotsHover: false,
      slidesToShow: 1,
      slidesToScroll: 1,
      speed: 1000,
      swipe: true,
      responsive: false,
      unshift: false,
      remove: false,
    };

    if(typeof config === 'object'){
      this.initialOptions = {...this.defaultOptions, ...this.config};
      this.options = this.initialOptions;
    } else {
      this.options = this.defaultOptions;
    }

    // Global strings
    this.GS = {
      arrowDefaultClass: 'shift-slider__arrow',
      dotsClass: 'shift-slider__dots',
      progressBarClass: 'shift-slider__progress-bar',
      sliderClass: 'shift-slider',
      sliderWrapperClass: 'shift-slider__wrapper',
      slideClass: 'shift-slider__slide',
      slideDataId: 'data-slide-id',
      sliderContainerClass: 'shift-slider-container',
      sliderContainerID: null,
      unshiftClass: 'un-shifted',
    };

    this.init();

    window.addEventListener('resize', () => {
      this.init();
    })
  }


  /**
   * Plugin initialization
   */
  init() {
    this.initOptionsAndDOM();
    this.initCount += 1; // This should be tha last item in init() method
  }


  /**
   * Setup the slider
   */
  initOptionsAndDOM() {
    this.selectors.forEach((shiftDOM, index) => {
      this.setFinalOptionsPerSlider(shiftDOM);

      // This slider container ID
      this.GS.sliderContainerID = `shift-slider-container-${index}`;

      // Unshift slider
      if(this.TDO.remove === false){
        if(this.TDO.unshift === true){
          this.unShift(shiftDOM);
        } else {
          this.reShift(shiftDOM);
        }

        const thisSliderContainer = document.getElementById(this.GS.sliderContainerID) ? document.getElementById(this.GS.sliderContainerID) : false;
        thisSliderContainer ? thisSliderContainer.appendChild(shiftDOM) : false;
        this.state__removed = false;
      } else {
        this.reShift(shiftDOM);
        shiftDOM.remove();
        this.state__removed = true;
      }

      // Setup Slider DOM
      if(this.state__removed === false && this.state__unShifted === false){
        this.setUpShiftSlider(shiftDOM, index);
      }
    });
  }


  /**
   * Un-shift Slider
   * @param {DOM} shiftDOM
   */
  unShift(shiftDOM) {
    const thisSliderContainer = document.getElementById(this.GS.sliderContainerID);

    if(thisSliderContainer){
      shiftDOM.classList.add(this.GS.unshiftClass);
      shiftDOM.classList.contains(this.GS.sliderClass) ? shiftDOM.classList.remove(this.GS.sliderClass) : false;

      const
        arrows      = thisSliderContainer.querySelector(`.${this.GS.arrowDefaultClass}s`),
        dots        = thisSliderContainer.querySelector(`.${this.GS.dotsClass}`),
        progressBar = thisSliderContainer.querySelector(`.${this.GS.progressBarClass}`),
        slides      = thisSliderContainer.querySelectorAll(`.${this.GS.sliderWrapperClass} > *`),
        wrapper     = thisSliderContainer.querySelector(`.${this.GS.sliderWrapperClass}`),
        baseDOM     = Array.from(thisSliderContainer.children);

      arrows ? arrows.remove() : false;
      dots ? dots.remove() : false;
      progressBar ? progressBar.remove() : false;

      // Remove slide class and data attribute from each slide
      slides.forEach((slide) => {
        if(slide.classList.contains(this.GS.slideClass)){
          slide.classList.remove(this.GS.slideClass);
          slide.removeAttribute(this.GS.slideDataId);
        }
      });

      // Unwrap the slider wrapper DOM
      if(wrapper){
        const baseSlideContent = Array.from(wrapper.children);
        wrapper.replaceWith(...baseSlideContent);
      }

      // Unwrap the slider container DOM
      thisSliderContainer.replaceWith(...baseDOM);
    }
    this.state__unShifted = true;
  }


  /**
   * Re-shift Slider
   * @param {DOM} shiftDOM
   */
  reShift(shiftDOM) {
    // Shift slider container (wrap slider inside this)
    if(this.initCount == 0 || (this.state__unShifted === true && this.TDO.unshift === false) || (this.state__removed === true && this.TDO.remove === false)){
      // Add slider class
      shiftDOM.classList.contains(this.GS.sliderClass) === false ? shiftDOM.classList.add(this.GS.sliderClass) : false;
      shiftDOM.classList.contains(this.GS.unshiftClass) ? shiftDOM.classList.remove(this.GS.unshiftClass) : false;

      // Wrap the DOM and set-up slider tools
      if(document.getElementById(this.GS.sliderContainerID) === null){
        // Slider tools
        let
          arrows = '',
          prevArrowDOM = '',
          nextArrowDOM = '',
          sliderDots = '',
          progressBar = '';

        if(this.TDO.showArrows === true){
          prevArrowDOM = this.TDO.prevArrow !== false ? `<button class="${this.GS.arrowDefaultClass} ${this.GS.arrowDefaultClass}--prev">${typeof this.TDO.prevArrow === 'string' ? this.TDO.prevArrow : 'Previous'}</button>` : '';
          nextArrowDOM = this.TDO.nextArrow !== false ? `<button class="${this.GS.arrowDefaultClass} ${this.GS.arrowDefaultClass}--next">${typeof this.TDO.nextArrow === 'string' ? this.TDO.nextArrow : 'Next'}</button>` : '';
          arrows = `<div class="${this.GS.arrowDefaultClass}s">${prevArrowDOM + nextArrowDOM}</div>`;
        }

        if(this.TDO.showDots === true){
          sliderDots = `<div class="${this.GS.dotsClass}"></div>`;
        }

        if(this.TDO.showProgressBar === true){
          progressBar = `<div class="${this.GS.progressBarClass}"><span class="${this.GS.progressBarClass} ${this.GS.progressBarClass}--completed"></span></div>`;
        }

        const shiftSliderContainer = document.createElement('div');
        shiftSliderContainer.classList.add(this.GS.sliderContainerClass);
        shiftSliderContainer.setAttribute('id', this.GS.sliderContainerID);
        shiftDOM.innerHTML = `<div class="${this.GS.sliderWrapperClass}">${shiftDOM.innerHTML}</div>${arrows + sliderDots + progressBar}`;
        shiftDOM.parentNode.insertBefore(shiftSliderContainer, shiftDOM);
        shiftSliderContainer.appendChild(shiftDOM);

        const slides = shiftDOM.querySelectorAll(`.${this.GS.sliderWrapperClass} > *`);
        slides.forEach((slide, ind) => {
          slide.setAttribute(this.GS.slideDataId, ind);
          if(slide.classList.contains(this.GS.slideClass) === false){
            slide.classList.add(this.GS.slideClass);
          }
        });
      }
    }
    this.state__unShifted = false;
  }


  /**
   * Set up final options per each slider
   * @param {DOM} shiftDOM 
   */
  setFinalOptionsPerSlider(shiftDOM) {
    this.TDO = this.options;

    // Set options from data attribute (if exists)
    if(shiftDOM.getAttribute('data-shift-options') !== null){
      this.TDO = {...this.options, ...JSON.parse(shiftDOM.getAttribute('data-shift-options'))};
    }

    // Set up options per breakpoint
    if(typeof this.TDO.responsive === 'object'){
      this.TDO.responsive.forEach(obj => {
        if(window.innerWidth <= obj.breakpoint){
          this.TDO = {...this.TDO, ...obj};
        } else {
          this.TDO = this.TDO;
        }
      });
    }
  }


  /**
   * Setup shift slider DOM
   * @param {DOM} sliderDOM
   * @param {int} index
   */
  setUpShiftSlider(sliderDOM, index) {
    this.__track = sliderDOM.querySelector(`.${this.GS.sliderWrapperClass}`);
    this.__slides = sliderDOM.querySelectorAll(`.${this.GS.sliderWrapperClass} > *`);
    this.__slideWidth = this.__slides[0].offsetWidth;
    this.__prevButton = sliderDOM.querySelector(`.${this.GS.arrowDefaultClass}--prev`);
    this.__nextButton = sliderDOM.querySelector(`.${this.GS.arrowDefaultClass}--next`);
    this.__trackWidth = this.__track.offsetWidth;

    this.state__arrowTriggered = false;

    if(this.__prevButton){
      this.__prevButton.addEventListener('click', (ev) => {
        if(this.state__arrowTriggered === false) {
          this.state__arrowTriggered = true;
          this.slideTo( this.__slideWidth, 'r' );
        }
      });
    }

    if(this.__nextButton){
      this.__nextButton.addEventListener('click', (ev) => {
        if(this.state__arrowTriggered === false) {
          this.state__arrowTriggered = true;          
          this.slideTo( this.__slideWidth );
        }
      });
    }
  }


  /**
   * Slide to specific place (px)
   * @param {int} to 
   */
  slideTo(to, dir='l') {
    const
    trackPos = this.__track.getBoundingClientRect(),
    currentPos = parseInt(trackPos.left || 0);

    if(dir == 'r'){
      to = currentPos + to;
    } else {
      to = currentPos - to;
    }

    this.__track.style.transition = this.TDO.speed+'ms';
    this.__track.style.transform = `translate3d(${to}px, 0px, 0px)`;

    setTimeout(() => {
      this.state__arrowTriggered = false;
    }, this.TDO.speed);
  }

}

// Initialize by data attribute
const dataAttrSelectors = document.querySelectorAll('[data-shift-init]');
if(dataAttrSelectors.length > 0){
  const shiftSliders = new Shift('[data-shift-init]');
}
