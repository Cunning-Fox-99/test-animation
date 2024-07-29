import React, { useEffect, useState } from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

// Компонент для волны
const Wave = () => (
    <svg className="svg" width="925" height="464" viewBox="0 0 925 464" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            className="wave-path"
            d="M3 462.5C109.647 219.157 284.5 3 462.5 3C640.5 3 872.719 208.923 922 462.5"
            stroke="#76F706"
            strokeWidth="5"
        />
    </svg>
);

const WaveAnimation = () => {
    const frame = useCurrentFrame();
    const { fps, width, height } = useVideoConfig();
    const [showNewWord, setShowNewWord] = useState(false);

    // Время для каждой фазы анимации
    const phase1 = fps * 0.5;  // Зум к первому слову
    const phase2 = fps * 1;  // Зум ко второму слову
    const phase3 = fps * 1.5;  // Зум к третьему слову
    const phase4 = fps * 2;  // Возврат к начальной позиции

    // Координаты слов
    const positions = [
        { left: 90, top: 160 },
        { left: 430, top: 10 },
        { left: 800, top: 160 },
    ];

    // Установить задержку для показа нового слова
    useEffect(() => {
        if (frame >= phase4) {
            setShowNewWord(true);
        }
    }, [frame, phase4]);

    // Определение текущей фазы анимации с эффектом "boancing"
    let zoom = 1;
    let moveX = 0;
    let moveY = 0;

    if (frame < phase1) {
        zoom = interpolate(frame, [0, phase1], [1, 2], { extrapolateRight: 'clamp' }) + 0.2 * Math.sin((frame / phase1) * Math.PI);
        moveX = interpolate(frame, [0, phase1], [0, -positions[0].left + width / 2 - 50 / 2], { extrapolateRight: 'clamp' });
        moveY = interpolate(frame, [0, phase1], [0, -positions[0].top + height / 2 - 24 / 2], { extrapolateRight: 'clamp' });
    } else if (frame < phase2) {
        zoom = interpolate(frame - phase1, [0, phase2 - phase1], [1, 2], { extrapolateRight: 'clamp' }) + 0.2 * Math.sin(((frame - phase1) / (phase2 - phase1)) * Math.PI);
        moveX = interpolate(frame - phase1, [0, phase2 - phase1], [-positions[0].left + width / 2 - 50 / 2, -positions[1].left + width / 2 - 50 / 2], { extrapolateRight: 'clamp' });
        moveY = interpolate(frame - phase1, [0, phase2 - phase1], [-positions[0].top + height / 2 - 24 / 2, -positions[1].top + height / 2 - 24 / 2], { extrapolateRight: 'clamp' });
    } else if (frame < phase3) {
        zoom = interpolate(frame - phase2, [0, phase3 - phase2], [1, 2], { extrapolateRight: 'clamp' }) + 0.2 * Math.sin(((frame - phase2) / (phase3 - phase2)) * Math.PI);
        moveX = interpolate(frame - phase2, [0, phase3 - phase2], [-positions[1].left + width / 2 - 50 / 2, -positions[2].left + width / 2 - 50 / 2], { extrapolateRight: 'clamp' });
        moveY = interpolate(frame - phase2, [0, phase3 - phase2], [-positions[1].top + height / 2 - 24 / 2, -positions[2].top + height / 2 - 24 / 2], { extrapolateRight: 'clamp' });
    } else {
        zoom = interpolate(frame - phase3, [0, phase4 - phase3], [1, 1], { extrapolateRight: 'clamp' });
        moveX = interpolate(frame - phase3, [0, phase4 - phase3], [-positions[2].left + width / 2 - 50 / 2, 0], { extrapolateRight: 'clamp' });
        moveY = interpolate(frame - phase3, [0, phase4 - phase3], [-positions[2].top + height / 2 - 24 / 2, 0], { extrapolateRight: 'clamp' });
    }

    return (
        <div style={{ position: 'relative', width: '800px', height: '200px', transform: `scale(${zoom}) translate(${moveX}px, ${moveY}px)`, overflow: 'hidden' }}>
            {/* Основной контейнер с волной и анимацией */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: '-52px',
                    width: '800px',
                    height: '200px',
                    transformOrigin: 'center center',
                }}
            >
                <Wave />
                <div className="word" style={{ position: 'absolute', top: '160px', left: '90px', fontSize: '24px', color: 'black' }}>Begin</div>
                <div className="word" style={{ position: 'absolute', top: '10px', left: '430px', fontSize: '24px', color: 'black' }}>Middle</div>
                <div className="word" style={{ position: 'absolute', top: '160px', left: '800px', fontSize: '24px', color: 'black' }}>End</div>
            </div>

            {/* Отдельный контейнер для слова "New Word" */}
            <div className="word" style={{ position: 'absolute', top: '60px', left: '360px', fontSize: '24px', color: 'black', opacity: showNewWord ? 1 : 0 }}>
                New Word
            </div>
        </div>
    );
};

export default WaveAnimation;
