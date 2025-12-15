





/**
 * Random "Decode" effect for text.
 * Cycles through random characters before settling on the final text.
 */
export const decodeTextEffect = (element: HTMLElement, finalText: string) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
    const length = finalText.length;
    let iterations = 0;

    const interval = setInterval(() => {
        element.innerText = finalText
            .split('')
            .map((_, index) => {
                if (index < iterations) {
                    return finalText[index];
                }
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        if (iterations >= length) {
            clearInterval(interval);
        }

        iterations += 1 / 3; // Speed control
    }, 30);
};
