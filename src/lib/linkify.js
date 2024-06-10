export function linkify(plainText) {
    let processedText = plainText;

    // Email pattern
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/gim;
    // Phone pattern (only digits and common phone characters, not starting with "tel" or "mailto" to avoid conflicts with URLs)
    const phonePattern = /(^|\s)[\+]?[\d\-\(\)\ ]{10,20}(?=\s|$)/gim;
    // URL pattern (refined)
    const urlPattern = /\b(?:https?:\/\/)?[^\s<>\[\]]+?\.[^\s<>\[\]]+?(?=[.,?!]*(?:["'\]]?\s|$))/gim;

    // Replace emails first
    processedText = processedText.replace(emailPattern, (match) => `[[[EMAIL_${match}]]]`);
    // Replace phone numbers next
    processedText = processedText.replace(phonePattern, (match, p1) => `${p1}[[[PHONE_${match.trim()}]]]`);
    // Replace URLs last
    processedText = processedText.replace(urlPattern, (match) => {
        // Add http protocol if missing
        const url = match.startsWith('http') ? match : `http://${match}`;
        return `[[[URL_${url}|${match}]]]`;
    });

    // Restore replaced texts with proper tags
    processedText = processedText.replace(/\[\[\[EMAIL_(.*?)\]\]\]/g, (match, p1) => `<a href="mailto:${p1}">${p1}</a>`);
    processedText = processedText.replace(/\[\[\[PHONE_(.*?)\]\]\]/g, (match, p1) => `<a href="tel:${p1}">${p1}</a>`);
    processedText = processedText.replace(/\[\[\[URL_(.*?)\|(.*?)\]\]\]/g, (match, p1, p2) => `<a href="${p1}" target="_blank">${p2}</a>`);

    return processedText;
}
