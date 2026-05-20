'use client';

import { useState } from 'react';
import Pagination from '../components/Pagination'; 

// Criando mock de 15 registros fictícios para testar a paginação
const dadosCompletos = Array.from({ length: 15 }, (_, index) => ({
  id: index + 1,
  codigo: `REOP-${1000 + index}`,
  usuario: `Usuário número ${index + 1}`,
  data: new Date(2026, 0, 1 + index).toLocaleDateString('pt-BR'),
}));

export default function TabelaPaginadaPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  // 1. Lógica matemática de fatiamento (Slice)
  const totalItems = dadosCompletos.length;
  const indexInicial = (currentPage - 1) * itemsPerPage;
  const indexFinal = indexInicial + itemsPerPage;
  
  // Itens filtrados que vão de fato aparecer na tabela nesta página específica
  const itensDaPaginaAtual = dadosCompletos.slice(indexInicial, indexFinal);

  // Ajuste de segurança: Se mudarmos a exibição e a página atual ficar vazia, voltamos para a primeira
  const handleItemsPerPageChange = (novosItensPorPagina: number) => {
    setItemsPerPage(novosItensPorPagina);
    setCurrentPage(1); 
  };

  return (
    <main className="min-h-screen bg-background p-4 sm:p-10 flex items-center justify-center transition-colors duration-300">
      <div className="w-full max-w-4xl bg-card rounded-xl shadow-sm border border-card-border overflow-hidden transition-colors duration-300">
        
        {/* Título da Tabela */}
        <div className="p-5 border-b border-card-border bg-background/40">
          <h2 className="text-lg font-bold text-foreground">Registros de Solicitações</h2>
          <p className="text-xs text-muted mt-0.5">Listagem contendo todo o histórico de chamados gerados</p>
        </div>

        {/* Estrutura Base da Tabela */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead className="bg-background/80 text-xs font-semibold uppercase tracking-wider text-muted border-b border-card-border">
              <tr>
                <th className="px-6 py-3 w-20">ID</th>
                <th className="px-6 py-3">Código de Chamado</th>
                <th className="px-6 py-3">Nome Solicitante</th>
                <th className="px-6 py-3 text-right">Data de Envio</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-card-border text-foreground/90">
              {itensDaPaginaAtual.map((item) => (
                <tr key={item.id} className="hover:bg-background/40 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-muted/80">#{item.id}</td>
                  <td className="px-6 py-3.5 font-semibold text-foreground">{item.codigo}</td>
                  <td className="px-6 py-3.5 text-foreground/80">{item.usuario}</td>
                  <td className="px-6 py-3.5 text-right text-muted">{item.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* INSTANCIANDO O COMPONENTE DE PAGINAÇÃO GENÉRICO */}
        {/* Nota: Certifique-se de que o seu componente de paginação interno também herda as mesmas classes do tema (como bg-card, border-card-border, etc.) */}
        <Pagination
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          itemsPerPageOptions={[10, 25, 50, 100]}
        />

      </div>
    </main>
  );
}