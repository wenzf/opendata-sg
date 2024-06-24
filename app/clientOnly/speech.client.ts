/**
 * convert html markup to speakable SpeechSynthesisVoice text
 */
export function convertToSpeakableText(htmlText: string): string {
   if (typeof window !== 'object') return ''
    const textParser = new DOMParser();
    const doc = textParser.parseFromString(htmlText, "text/html");

    function processElement(element: HTMLElement): string {
        let textContent = "";

        console.log({ element })

        switch (element.tagName.toLowerCase()) {
            case "p":
                textContent = element.textContent + " \n ";
                break;
            case "h1":
            case "h2":
                textContent = element.textContent + "  \n   ";
                break;
            case "b":
            case "strong":
                textContent = `**${processElement(element.firstChild as HTMLElement)}**`;
                break;
            case "span":
            case "li":
                textContent = processElement(element.firstChild as HTMLElement) + "  ";
                break;
            case "body":
            case "ul":
            case "ol":
                textContent = Array.from(element.childNodes) // Convert NodeList to array
                    .reduce((acc, child) => {
                        if (child.nodeType === Node.ELEMENT_NODE) {
                            return acc + processElement(child as HTMLElement);
                        }
                        return acc;
                    }, "");
                break;
            default:
                // Ignore unsupported elements and their content
                break;
        }
        console.log({ textContent })

        return textContent;
    }

    // Process the root element (body)
    const processedText = processElement(doc.body);
console.log({ processedText })
    // Remove any leading/trailing whitespace
    return processedText.trim();
}