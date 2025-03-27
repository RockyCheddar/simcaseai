import pdfMake from 'pdfmake/build/pdfmake';
import type { TDocumentDefinitions, StyleDictionary } from 'pdfmake/interfaces';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';

// Set up fonts - will be dynamically loaded in the browser
// This avoids the VFS import issues
if (typeof window !== 'undefined') {
  // Client-side only
  import('pdfmake/build/vfs_fonts').then((vfs) => {
    (pdfMake as any).vfs = vfs.pdfMake.vfs;
  });
}

// Define document styles
const docStyles: StyleDictionary = {
  header: {
    fontSize: 18,
    bold: true,
    margin: [0, 0, 0, 10],
    color: '#0369a1' // primary-700
  },
  subheader: {
    fontSize: 16,
    bold: true,
    margin: [0, 10, 0, 5],
    color: '#0284c7' // primary-600
  },
  section: {
    fontSize: 14,
    bold: true,
    margin: [0, 8, 0, 4],
    color: '#0c4a6e' // primary-900
  },
  normal: {
    fontSize: 11,
    margin: [0, 5, 0, 5]
  },
  listItem: {
    fontSize: 11,
    margin: [0, 2, 0, 2]
  },
  code: {
    fontSize: 11,
    background: '#f1f5f9',
    color: '#0c4a6e',
    font: 'Courier',
    margin: [0, 5, 0, 5]
  },
  table: {
    margin: [0, 5, 0, 15]
  },
  tableHeader: {
    bold: true,
    fontSize: 12,
    color: '#fff',
    fillColor: '#0284c7'
  },
  vitals: {
    bold: true,
    margin: [0, 2, 0, 2],
    fontSize: 11
  },
  note: {
    fontSize: 10,
    italics: true,
    color: '#475569' // secondary-600
  }
};

// Function to convert markdown to PDFMake document definition
export async function markdownToPdf(markdown: string, title: string): Promise<Blob> {
  const pdfContent: any[] = [];
  
  // Add SimCase AI Header
  pdfContent.push({
    stack: [
      {
        columns: [
          {
            width: '*',
            text: 'SimCase AI',
            style: {
              fontSize: 22,
              bold: true,
              color: '#0284c7' // primary-600
            }
          },
          {
            width: 'auto',
            text: new Date().toLocaleDateString(),
            style: {
              fontSize: 10,
              alignment: 'right',
              color: '#475569' // secondary-600
            }
          }
        ]
      },
      {
        canvas: [
          {
            type: 'line',
            x1: 0, y1: 2,
            x2: 515, y2: 2,
            lineWidth: 2,
            lineColor: '#0284c7' // primary-600
          }
        ]
      }
    ],
    margin: [0, 0, 0, 15]
  });
  
  // Add document title
  pdfContent.push({
    text: title,
    style: 'header',
    alignment: 'center',
    margin: [0, 0, 0, 20]
  });
  
  try {
    // Parse markdown
    const tree = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .parse(markdown);
    
    let currentHeading = '';
    let inCodeBlock = false;
    let codeContent = '';
    let inListItem = false;
    let listItems: any[] = [];
    let listType = '';
    
    // Process each node
    visit(tree, (node: any) => {
      switch (node.type) {
        case 'heading':
          if (inListItem) {
            pdfContent.push({
              ul: listItems,
              style: 'listItem'
            });
            listItems = [];
            inListItem = false;
          }
          
          const headingText = node.children
            .filter((child: any) => child.type === 'text')
            .map((child: any) => child.value)
            .join('');
          
          if (node.depth === 1) {
            pdfContent.push({
              text: headingText,
              style: 'header',
              pageBreak: pdfContent.length > 0 ? 'before' : undefined
            });
          } else if (node.depth === 2) {
            pdfContent.push({
              text: headingText,
              style: 'subheader'
            });
            currentHeading = headingText;
          } else {
            pdfContent.push({
              text: headingText,
              style: 'section'
            });
          }
          break;
          
        case 'paragraph':
          if (inListItem) {
            pdfContent.push({
              ul: listItems,
              style: 'listItem'
            });
            listItems = [];
            inListItem = false;
          }
          
          const text = node.children
            .map((child: any) => {
              if (child.type === 'text') {
                return child.value;
              } else if (child.type === 'strong') {
                return { text: child.children[0].value, bold: true };
              } else if (child.type === 'emphasis') {
                return { text: child.children[0].value, italics: true };
              } else {
                return '';
              }
            })
            .filter(Boolean);
            
          pdfContent.push({
            text: text,
            style: 'normal'
          });
          break;
          
        case 'list':
          if (inListItem) {
            pdfContent.push({
              ul: listItems,
              style: 'listItem'
            });
            listItems = [];
          }
          
          inListItem = true;
          listType = node.ordered ? 'ol' : 'ul';
          
          // Process list items
          node.children.forEach((item: any) => {
            const itemText = item.children
              .map((child: any) => {
                if (child.type === 'paragraph') {
                  return child.children.map((paragraphChild: any) => {
                    if (paragraphChild.type === 'text') {
                      return paragraphChild.value;
                    } else if (paragraphChild.type === 'strong') {
                      return { text: paragraphChild.children[0].value, bold: true };
                    } else if (paragraphChild.type === 'emphasis') {
                      return { text: paragraphChild.children[0].value, italics: true };
                    } else {
                      return '';
                    }
                  }).filter(Boolean);
                }
                return '';
              })
              .filter(Boolean);
            
            listItems.push(itemText);
          });
          
          // Add list to content
          if (listItems.length > 0) {
            if (listType === 'ol') {
              pdfContent.push({
                ol: listItems,
                style: 'listItem'
              });
            } else {
              pdfContent.push({
                ul: listItems,
                style: 'listItem'
              });
            }
            
            listItems = [];
            inListItem = false;
          }
          break;
          
        case 'code':
          if (inListItem) {
            pdfContent.push({
              ul: listItems,
              style: 'listItem'
            });
            listItems = [];
            inListItem = false;
          }
          
          pdfContent.push({
            text: node.value,
            style: 'code'
          });
          break;
          
        case 'table':
          if (inListItem) {
            pdfContent.push({
              ul: listItems,
              style: 'listItem'
            });
            listItems = [];
            inListItem = false;
          }
          
          const tableBody: any[] = [];
          const tableHead: any[] = [];
          
          // Process table rows
          node.children.forEach((row: any, rowIndex: number) => {
            const rowData: any[] = [];
            
            row.children.forEach((cell: any) => {
              const cellText = cell.children
                .map((child: any) => {
                  if (child.type === 'paragraph') {
                    return child.children.map((paragraphChild: any) => {
                      if (paragraphChild.type === 'text') {
                        return paragraphChild.value;
                      }
                      return '';
                    }).join('');
                  }
                  return '';
                })
                .join('');
              
              rowData.push(cellText);
            });
            
            if (rowIndex === 0) {
              tableHead.push(rowData);
            } else {
              tableBody.push(rowData);
            }
          });
          
          if (currentHeading.toLowerCase().includes('vital sign')) {
            // Special formatting for vital signs tables
            pdfContent.push({
              layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                widths: Array(tableHead[0].length).fill('*'),
                body: [...tableHead, ...tableBody]
              },
              style: 'vitals'
            });
          } else {
            // Regular table
            pdfContent.push({
              layout: 'lightHorizontalLines',
              table: {
                headerRows: 1,
                widths: Array(tableHead[0].length).fill('*'),
                body: [...tableHead, ...tableBody]
              },
              style: 'table'
            });
          }
          break;
      }
    });
    
    // Add a footer with page numbers
    const documentDefinition: TDocumentDefinitions = {
      content: pdfContent,
      styles: docStyles,
      defaultStyle: {
        font: 'Helvetica'
      },
      pageMargins: [40, 60, 40, 60],
      footer: (currentPage, pageCount) => {
        return {
          text: `${currentPage} / ${pageCount}`,
          alignment: 'center',
          fontSize: 9,
          margin: [0, 10, 0, 0]
        };
      },
      header: (currentPage, pageCount, pageSize) => {
        if (currentPage > 1) {
          return {
            text: 'SimCase AI',
            alignment: 'right',
            margin: [0, 20, 40, 0],
            fontSize: 9,
            color: '#475569' // secondary-600
          };
        }
        return '';
      },
      pageSize: 'A4'
    };
    
    // Generate PDF
    const pdfDocGenerator = pdfMake.createPdf(documentDefinition);
    
    // Return as a Promise that resolves with a Blob
    return new Promise((resolve) => {
      pdfDocGenerator.getBlob((blob) => {
        resolve(blob);
      });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
} 