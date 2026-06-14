import React from 'react';

// Matches http/https, www, and common domains like .com, .io, .dev, .app, .net, .org, .in, .me
const URL_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9.-]+\.(?:com|org|net|io|dev|app|me|in|co)(?:\/[^\s]*)?)/gi;

export function linkify(text: string) {
  if (!text) return text;
  
  // Splitting by a regex with a capture group includes the matched parts in the array
  const parts = text.split(URL_REGEX);
  
  return (
    <>
      {parts.map((part, i) => {
        // If this part matches the URL regex, render an anchor tag
        if (part && part.match(URL_REGEX)) {
          let href = part;
          if (!href.startsWith('http')) {
            href = `https://${href}`;
          }
          
          // Remove trailing punctuation from the visible text and the href if it got caught
          const trailingPunctuationMatch = href.match(/[.,;!?]+$/);
          let trailingChar = '';
          if (trailingPunctuationMatch) {
            trailingChar = trailingPunctuationMatch[0];
            href = href.replace(/[.,;!?]+$/, '');
            part = part.replace(/[.,;!?]+$/, '');
          }

          return (
            <React.Fragment key={i}>
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-primary)', textDecoration: 'underline', textUnderlineOffset: '2px' }}
                className="hover-link"
              >
                {part}
              </a>
              {trailingChar}
            </React.Fragment>
          );
        }
        
        // Otherwise, just render the plain text
        return <React.Fragment key={i}>{part}</React.Fragment>;
      })}
    </>
  );
}
