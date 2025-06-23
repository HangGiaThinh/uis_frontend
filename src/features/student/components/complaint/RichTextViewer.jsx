import React from 'react';
import './RichTextViewer.css';

const RichTextViewer = ({ content, className = "" }) => {
    if (!content) {
        return <div className={`rich-text-viewer ${className}`}>Không có nội dung</div>;
    }

    // Check if content contains HTML tags
    const isHTML = /<[a-z][\s\S]*>/i.test(content);
    
    if (isHTML) {
        // Render as HTML
        return (
            <div 
                className={`rich-text-viewer ${className}`}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    } else {
        // Render as plain text with line breaks converted to <br>
        const formattedContent = content.replace(/\n/g, '<br />');
        return (
            <div 
                className={`rich-text-viewer ${className}`}
                dangerouslySetInnerHTML={{ __html: formattedContent }}
            />
        );
    }
};

export default RichTextViewer; 