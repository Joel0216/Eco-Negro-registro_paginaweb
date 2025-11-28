// Control del video del trailer

document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('trailerVideo');
    const overlay = document.getElementById('videoOverlay');
    const playButton = document.getElementById('playButton');
    
    if (!video || !overlay || !playButton) return;
    
    // Función para reproducir el video
    function playVideo() {
        video.play();
        overlay.classList.add('hidden');
    }
    
    // Función para pausar el video
    function pauseVideo() {
        video.pause();
        overlay.classList.remove('hidden');
    }
    
    // Click en el botón de play
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideo();
    });
    
    // Click en el overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            playVideo();
        }
    });
    
    // Click en el video
    video.addEventListener('click', () => {
        if (video.paused) {
            playVideo();
        } else {
            pauseVideo();
        }
    });
    
    // Cuando el video se pausa
    video.addEventListener('pause', () => {
        if (!video.ended) {
            overlay.classList.remove('hidden');
        }
    });
    
    // Cuando el video se reproduce
    video.addEventListener('play', () => {
        overlay.classList.add('hidden');
    });
    
    // Cuando el video termina
    video.addEventListener('ended', () => {
        overlay.classList.remove('hidden');
    });
    
    // Efecto de resplandor en el contenedor cuando se reproduce
    video.addEventListener('play', () => {
        const container = video.closest('.video-container');
        container.style.boxShadow = '0 0 40px rgba(0, 217, 255, 0.8)';
    });
    
    video.addEventListener('pause', () => {
        const container = video.closest('.video-container');
        container.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
    });
    
    // Animación del borde mientras se reproduce
    let animationFrame;
    
    video.addEventListener('play', () => {
        const container = video.closest('.video-container');
        let hue = 180; // Cyan
        
        function animateBorder() {
            hue = (hue + 0.5) % 360;
            const color = `hsl(${hue}, 100%, 50%)`;
            container.style.borderColor = color;
            container.style.boxShadow = `0 0 40px ${color}80`;
            
            if (!video.paused) {
                animationFrame = requestAnimationFrame(animateBorder);
            }
        }
        
        animateBorder();
    });
    
    video.addEventListener('pause', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        const container = video.closest('.video-container');
        container.style.borderColor = 'var(--color-primary)';
        container.style.boxShadow = '0 0 20px rgba(0, 217, 255, 0.4)';
    });
});
