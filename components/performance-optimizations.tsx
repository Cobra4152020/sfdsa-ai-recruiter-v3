"use client"

import { useEffect } from "react"

export function PerformanceOptimizations() {
  useEffect(() => {
    // Preload critical images
    const criticalImages = [
      "/sf-sheriff-deputies.png",
      "/male-law-enforcement-headshot.png",
      "/female-law-enforcement-headshot.png",
      "/asian-male-officer-headshot.png",
    ]

    criticalImages.forEach((src) => {
      const img = new Image()
      img.src = src
    })

    // Add intersection observer for lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]')
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          if (img.dataset.src) {
            img.src = img.dataset.src
            img.removeAttribute('data-src')
            observer.unobserve(img)
          }
        }
      })
    })

    lazyImages.forEach((img) => imageObserver.observe(img))

    // Prefetch next page data
    const prefetchLinks = document.querySelectorAll('a[data-prefetch="true"]')
    const linkObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const link = entry.target as HTMLAnchorElement
          const href = link.href
          
          // Prefetch the page if it's not already prefetched
          if (href && !prefetchedPages.has(href)) {
            const prefetchLink = document.createElement('link')
            prefetchLink.rel = 'prefetch'
            prefetchLink.href = href
            document.head.appendChild(prefetchLink)
            prefetchedPages.add(href)
          }
        }
      })
    })

    const prefetchedPages = new Set()
    prefetchLinks.forEach((link) => linkObserver.observe(link))

    // Add resource hints for external resources
    const resourceHints = [
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
    ]

    resourceHints.forEach(({ rel, href }) => {
      if (!document.querySelector(`link[rel="${rel}"][href="${href}"]`)) {
        const link = document.createElement('link')
        link.rel = rel
        link.href = href
        link.crossOrigin = 'anonymous'
        document.head.appendChild(link)
      }
    })

    // Monitor network conditions
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      
      const updateNetworkQuality = () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          document.documentElement.classList.add('slow-network')
        } else {
          document.documentElement.classList.remove('slow-network')
        }
      }

      connection.addEventListener('change', updateNetworkQuality)
      updateNetworkQuality()

      return () => {
        connection.removeEventListener('change', updateNetworkQuality)
      }
    }

    // Clean up observers
    return () => {
      imageObserver.disconnect()
      linkObserver.disconnect()
    }
  }, [])

  // Add event listeners for performance monitoring
  useEffect(() => {
    const reportPerformanceMetric = (metric: any) => {
      // Send metric to analytics or logging service
      console.log('Performance metric:', metric)
    }

    // Monitor First Input Delay (FID)
    const onFirstInput = (event: any) => {
      reportPerformanceMetric({
        name: 'FID',
        value: event.processingStart - event.startTime,
        rating: event.processingStart - event.startTime < 100 ? 'good' : 'needs-improvement'
      })
    }

    // Monitor Largest Contentful Paint (LCP)
    const onLargestContentfulPaint = (event: any) => {
      reportPerformanceMetric({
        name: 'LCP',
        value: event.startTime,
        rating: event.startTime < 2500 ? 'good' : 'needs-improvement'
      })
    }

    // Monitor Cumulative Layout Shift (CLS)
    let clsValue = 0
    const onLayoutShift = (event: any) => {
      if (!event.hadRecentInput) {
        clsValue += event.value
        reportPerformanceMetric({
          name: 'CLS',
          value: clsValue,
          rating: clsValue < 0.1 ? 'good' : 'needs-improvement'
        })
      }
    }

    // Add performance observers
    const fidObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        onFirstInput(entry)
      }
    })

    const lcpObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        onLargestContentfulPaint(entry)
      }
    })

    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        onLayoutShift(entry)
      }
    })

    // Start observing
    fidObserver.observe({ type: 'first-input', buffered: true })
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true })
    clsObserver.observe({ type: 'layout-shift', buffered: true })

    // Cleanup
    return () => {
      fidObserver.disconnect()
      lcpObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [])

  return null
} 