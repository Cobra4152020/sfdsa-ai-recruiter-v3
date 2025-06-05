const fs = require('fs');
const path = require('path');

// Simple markdown to Word conversion script
async function convertMarkdownToWord() {
  try {
    // Check if we have docx library available
    let docx;
    try {
      docx = require('docx');
    } catch (error) {
      console.log('docx library not found. Installing...');
      const { execSync } = require('child_process');
      execSync('npm install docx', { stdio: 'inherit' });
      docx = require('docx');
    }

    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = docx;

    // Read the markdown file
    const markdownPath = path.join(__dirname, '../SFDSA-Recruitment-Platform-White-Paper.md');
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');

    // Parse markdown content
    const lines = markdownContent.split('\n');
    const children = [];

    let currentSection = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('# ')) {
        // Main title
        children.push(
          new Paragraph({
            text: line.substring(2),
            heading: HeadingLevel.TITLE,
            spacing: { after: 200 }
          })
        );
      } else if (line.startsWith('## ')) {
        // Section headers
        children.push(
          new Paragraph({
            text: line.substring(3),
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 }
          })
        );
      } else if (line.startsWith('### ')) {
        // Subsection headers
        children.push(
          new Paragraph({
            text: line.substring(4),
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 }
          })
        );
      } else if (line.startsWith('#### ')) {
        // Sub-subsection headers
        children.push(
          new Paragraph({
            text: line.substring(5),
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 }
          })
        );
      } else if (line.startsWith('**') && line.endsWith('**')) {
        // Bold text paragraphs
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2, line.length - 2),
                bold: true
              })
            ],
            spacing: { after: 100 }
          })
        );
      } else if (line.startsWith('- ')) {
        // Bullet points
        children.push(
          new Paragraph({
            text: line.substring(2),
            bullet: { level: 0 },
            spacing: { after: 50 }
          })
        );
      } else if (line.startsWith('```')) {
        // Code blocks - collect until closing ```
        const codeLines = [];
        i++; // Skip opening ```
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        
        // Add code block as formatted text
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: codeLines.join('\n'),
                font: { name: 'Courier New' },
                size: 20 // 10pt
              })
            ],
            spacing: { before: 100, after: 100 }
          })
        );
      } else if (line.length > 0 && !line.startsWith('---')) {
        // Regular paragraphs
        children.push(
          new Paragraph({
            text: line,
            spacing: { after: 100 }
          })
        );
      } else if (line === '---') {
        // Section dividers
        children.push(
          new Paragraph({
            text: '',
            spacing: { after: 200 }
          })
        );
      }
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: children
      }]
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Write to file
    const outputPath = path.join(__dirname, '../SFDSA-Recruitment-Platform-White-Paper.docx');
    fs.writeFileSync(outputPath, buffer);

    console.log('✅ Word document created successfully!');
    console.log(`📄 File saved as: ${outputPath}`);
    
  } catch (error) {
    console.error('❌ Error converting to Word:', error.message);
    
    // Fallback: Create a simple RTF file
    console.log('🔄 Creating RTF fallback...');
    createRTFDocument();
  }
}

function createRTFDocument() {
  try {
    const markdownPath = path.join(__dirname, '../SFDSA-Recruitment-Platform-White-Paper.md');
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    
    // Convert markdown to RTF
    let rtfContent = '{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Times New Roman;}}';
    
    const lines = markdownContent.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('# ')) {
        rtfContent += `\\f0\\fs36\\b ${line.substring(2)}\\b0\\fs24\\par\\par`;
      } else if (line.startsWith('## ')) {
        rtfContent += `\\f0\\fs28\\b ${line.substring(3)}\\b0\\fs24\\par\\par`;
      } else if (line.startsWith('### ')) {
        rtfContent += `\\f0\\fs24\\b ${line.substring(4)}\\b0\\fs24\\par`;
      } else if (line.startsWith('#### ')) {
        rtfContent += `\\f0\\fs22\\b ${line.substring(5)}\\b0\\fs24\\par`;
      } else if (line.trim().length > 0 && !line.startsWith('```') && line !== '---') {
        rtfContent += `${line}\\par`;
      } else if (line === '---') {
        rtfContent += '\\par';
      }
    }
    
    rtfContent += '}';
    
    const outputPath = path.join(__dirname, '../SFDSA-Recruitment-Platform-White-Paper.rtf');
    fs.writeFileSync(outputPath, rtfContent);
    
    console.log('✅ RTF document created successfully!');
    console.log(`📄 File saved as: ${outputPath}`);
    console.log('💡 You can open this RTF file in Microsoft Word and save it as .docx');
    
  } catch (error) {
    console.error('❌ Error creating RTF:', error);
  }
}

// Run the conversion
convertMarkdownToWord(); 