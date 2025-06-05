const fs = require('fs');
const path = require('path');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TableOfContents, StyleLevel } = require('docx');

async function createProfessionalWordDoc() {
  try {
    // Read the markdown file
    const markdownPath = path.join(__dirname, '../SFDSA-Recruitment-Platform-White-Paper.md');
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');

    // Parse markdown content with better formatting
    const lines = markdownContent.split('\n');
    const children = [];

    // Add title page
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SFDSA RECRUITMENT PLATFORM",
            bold: true,
            size: 48,
            color: "0A3C1F" // Sheriff green
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Strategic White Paper",
            size: 32,
            color: "0A3C1F"
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Transforming Deputy Sheriff Recruitment Through",
            size: 24
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Gamified Engagement & AI-Powered Preparation",
            size: 24
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Document Version: 1.0",
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Date: January 2025",
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: "Prepared for: San Francisco Deputy Sheriffs' Association (SFDSA)",
            size: 20
          })
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 }
      })
    );

    // Add page break
    children.push(
      new Paragraph({
        text: "",
        pageBreakBefore: true
      })
    );

    // Add table of contents placeholder
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "TABLE OF CONTENTS",
            bold: true,
            size: 28,
            color: "0A3C1F"
          })
        ],
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      })
    );

    // Process the content
    let currentLevel = 0;
    let inCodeBlock = false;
    let codeLines = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLines = [];
        } else {
          // End of code block
          inCodeBlock = false;
          if (codeLines.length > 0) {
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: codeLines.join('\n'),
                    font: { name: 'Courier New' },
                    size: 18,
                    color: "333333"
                  })
                ],
                spacing: { before: 200, after: 200 },
                shading: { fill: "F5F5F5" }
              })
            );
          }
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(lines[i]);
        continue;
      }

      if (line.startsWith('# ') && !line.includes('SFDSA Recruitment Platform')) {
        // Skip the main title as we have a custom title page
        continue;
      } else if (line.startsWith('## ')) {
        // Section headers
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(3),
                bold: true,
                size: 28,
                color: "0A3C1F"
              })
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 }
          })
        );
      } else if (line.startsWith('### ')) {
        // Subsection headers
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(4),
                bold: true,
                size: 24,
                color: "0A3C1F"
              })
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 }
          })
        );
      } else if (line.startsWith('#### ')) {
        // Sub-subsection headers
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(5),
                bold: true,
                size: 20,
                color: "0A3C1F"
              })
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 250, after: 100 }
          })
        );
      } else if (line.startsWith('**') && line.endsWith('**') && line.length > 4) {
        // Bold text paragraphs
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2, line.length - 2),
                bold: true,
                size: 22
              })
            ],
            spacing: { before: 150, after: 100 }
          })
        );
      } else if (line.startsWith('- ')) {
        // Bullet points
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(2),
                size: 22
              })
            ],
            bullet: { level: 0 },
            spacing: { after: 80 }
          })
        );
      } else if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ')) {
        // Numbered lists
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line.substring(3),
                size: 22
              })
            ],
            numbering: { reference: "default-numbering", level: 0 },
            spacing: { after: 80 }
          })
        );
      } else if (line.length > 0 && !line.startsWith('---') && !line.startsWith('**Document') && !line.startsWith('**Date:') && !line.startsWith('**Prepared')) {
        // Regular paragraphs
        if (line.includes('$') && (line.includes('Total') || line.includes('Phase'))) {
          // Financial data - make it stand out
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 22,
                  bold: true,
                  color: "FFD700" // Sheriff gold
                })
              ],
              spacing: { after: 100 }
            })
          );
        } else {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: line,
                  size: 22
                })
              ],
              spacing: { after: 100 }
            })
          );
        }
      } else if (line === '---') {
        // Section dividers
        children.push(
          new Paragraph({
            text: '',
            spacing: { after: 300 }
          })
        );
      }
    }

    // Create document with professional styling
    const doc = new Document({
      styles: {
        paragraphStyles: [
          {
            id: "Normal",
            name: "Normal",
            basedOn: "Normal",
            next: "Normal",
            run: {
              font: "Calibri",
              size: 22
            },
            paragraph: {
              spacing: {
                line: 276,
                lineRule: "auto"
              }
            }
          }
        ]
      },
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,    // 1 inch
              right: 1440,  // 1 inch
              bottom: 1440, // 1 inch
              left: 1440    // 1 inch
            }
          }
        },
        children: children
      }]
    });

    // Generate buffer
    const buffer = await Packer.toBuffer(doc);

    // Write to file
    const outputPath = path.join(__dirname, '../SFDSA-Recruitment-Platform-White-Paper-Professional.docx');
    fs.writeFileSync(outputPath, buffer);

    console.log('✅ Professional Word document created successfully!');
    console.log(`📄 File saved as: ${outputPath}`);
    console.log('🎨 Features included:');
    console.log('   • Professional title page');
    console.log('   • SFDSA brand colors (Sheriff Green & Gold)');
    console.log('   • Proper heading hierarchy');
    console.log('   • Enhanced code block formatting');
    console.log('   • Financial data highlighting');
    console.log('   • Professional margins and spacing');
    
  } catch (error) {
    console.error('❌ Error creating professional Word document:', error.message);
  }
}

// Run the conversion
createProfessionalWordDoc(); 