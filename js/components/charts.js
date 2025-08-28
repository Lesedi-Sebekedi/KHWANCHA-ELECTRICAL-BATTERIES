import { debounce, isInViewport } from '../utils/helpers.js';

let chartAnimated = false;

/**
 * Initialize chart animations
 */
export function initCharts() {
    const chartSection = document.querySelector('.market-chart');
    if (!chartSection) return;
    
    // Animate chart when in viewport
    function checkChartVisibility() {
        if (isInViewport(chartSection) && !chartAnimated) {
            animateChartBars();
            chartAnimated = true;
        }
    }
    
    // Initial check
    checkChartVisibility();
    
    // Listen for scroll and resize events
    window.addEventListener('scroll', debounce(checkChartVisibility, 100));
    window.addEventListener('resize', debounce(initCharts, 250));
}

/**
 * Animate chart bars
 */
export function animateChartBars() {
    const chartBars = document.querySelectorAll('.chart-bar');
    chartBars.forEach(bar => {
        const height = bar.getAttribute('data-height');
        bar.style.height = height + 'px';
        bar.style.animation = 'grow 1.5s ease-in-out';
    });
}