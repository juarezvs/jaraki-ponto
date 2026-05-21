'use client';

import React, { useState, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// --- ESTILOS DO PDF (Suporta expansão fluida para Paisagem) ---
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1e293b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    borderBottomStyle: 'solid',
    paddingBottom: 15,
    marginBottom: 20,
  },
  titleArea: {
    flexDirection: 'column',
  },
  systemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#4f46e5', 
  },
  reportTitle: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 4,
    fontWeight: 'bold',
  },
  metaArea: {
    textAlign: 'right',
    fontSize: 8,
    color: '#94a3b8',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%', // Força a tabela a ocupar toda a largura disponível (A4 Retrato ou Paisagem)
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    padding: 6,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    padding: 6,
  },
  tableCell: {
    flex: 1,
    paddingRight: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 8,
    color: '#94a3b8',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  }
});

interface PDFColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => string);
  align?: 'left' | 'center' | 'right';
}

interface PDFExportButtonProps<T> {
  title: string;
  filename: string;
  columns: PDFColumn<T>[];
  data: T[];
  buttonText?: string;
  /** Define se o documento A4 será gerado em 'portrait' (Retrato/Vertical) ou 'landscape' (Paisagem/Horizontal) */
  orientation?: 'portrait' | 'landscape'; 
}

export default function PDFExportButton<T>({ 
  title, 
  filename, 
  columns, 
  data, 
  buttonText = 'Exportar PDF',
  orientation = 'portrait' // Retrato como padrão se não for informado
}: PDFExportButtonProps<T>) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const MyPDFDocument = () => (
    <Document>
      {/* O tamanho fica fixo em A4, alterando apenas a orientação */}
      <Page size="A4" orientation={orientation} style={styles.page}>
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleArea}>
            <Text style={styles.systemTitle}>JARAKI PONTO - SISTEMA ELETRÔNICO </Text>
            <Text style={styles.reportTitle}>{title.toUpperCase()}</Text>
          </View>
          <View style={styles.metaArea}>
            <Text>Emissão: 19/05/2026</Text>
            <Text>Leiaute: A4 {orientation === 'portrait' ? 'Retrato' : 'Paisagem'}</Text>
          </View>
        </View>

        {/* Tabela */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {columns.map((col, index) => (
              <Text 
                key={index} 
                style={[styles.tableCell, { textAlign: col.align || 'left', fontWeight: 'bold' }]}
              >
                {col.header}
              </Text>
            ))}
          </View>

          {data.map((item, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((col, colIndex) => {
                const value = typeof col.accessor === 'function' 
                  ? col.accessor(item) 
                  : String(item[col.accessor] || '---');
                
                return (
                  <Text 
                    key={colIndex} 
                    style={[styles.tableCell, { textAlign: col.align || 'left' }]}
                  >
                    {value}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>

        {/* Rodapé fixo */}
        <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
          `Orbund SIS Document Server • Página ${pageNumber} de ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const blob = await pdf(<MyPDFDocument />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao processar arquivo A4:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 bg-card hover:bg-muted-light text-foreground border border-card-border text-sm font-semibold px-4 py-2 rounded-lg shadow-sm transition-all cursor-pointer disabled:opacity-50"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Gerando A4...</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4 text-muted" />
          <span>{buttonText}</span>
        </>
      )}
    </button>
  );
}