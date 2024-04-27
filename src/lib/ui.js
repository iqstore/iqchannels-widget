export function hexToHSL(hex) {
    // Проверка валидности HEX-кода
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        throw new Error('Неверный HEX-код: ' + hex);
    }

    // Разделение HEX-кода на компоненты RGB
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Преобразование RGB в HSL
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;
    const d = max - min;
    let s = 0;
    let h = 0;

    if (d === 0) {
        h = 0; // Без насыщенности (оттенок не имеет значения)
    } else {
        s = d / (l <= 0.5 ? max : 2 - max);
        h = Math.round(60 * (
            r === max ? g - b :
                g === max ? b - r + 120 :
                    r - g + 240
        ) / d);
        if (h < 0) {
            h += 360;
        }
    }

    return { h, s, l };
}
