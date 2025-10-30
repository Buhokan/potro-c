(function() {
  // Efecto reveal con Intersection Observer
  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  };

  onReady(function() {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new window.IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    reveals.forEach(rev => observer.observe(rev));
  });

  // Lightbox para galería
  onReady(function() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const btnClose = lightbox.querySelector('.lightbox-close');
    const btnPrev = lightbox.querySelector('.lightbox-prev');
    const btnNext = lightbox.querySelector('.lightbox-next');
    const images = Array.from(document.querySelectorAll('.gallery .gallery-item img'));
    let currentIndex = -1;

    function openLightbox(index) {
      if (index < 0 || index >= images.length) return;
      currentIndex = index;
      updateImage();
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      currentIndex = -1;
    }

    function updateImage() {
      const img = images[currentIndex];
      if (!img) return;
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '';
      lightboxImage.setAttribute('src', src);
      lightboxImage.setAttribute('alt', alt);
      const nextIdx = (currentIndex + 1) % images.length;
      const prevIdx = (currentIndex - 1 + images.length) % images.length;
      [images[nextIdx], images[prevIdx]].forEach(el => { const i = new Image(); i.src = el.getAttribute('src'); });
    }

    function showNext() {
      if (images.length === 0) return;
      currentIndex = (currentIndex + 1) % images.length;
      updateImage();
    }

    function showPrev() {
      if (images.length === 0) return;
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateImage();
    }

    images.forEach((img, idx) => {
      img.addEventListener('click', () => openLightbox(idx));
    });

    btnClose.addEventListener('click', closeLightbox);
    btnNext.addEventListener('click', showNext);
    btnPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') return closeLightbox();
      if (e.key === 'ArrowRight') return showNext();
      if (e.key === 'ArrowLeft') return showPrev();
    });

    let startX = 0; let endX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      startX = e.changedTouches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const delta = endX - startX;
      if (Math.abs(delta) > 50) {
        if (delta < 0) showNext(); else showPrev();
      }
    });
  });
})();
