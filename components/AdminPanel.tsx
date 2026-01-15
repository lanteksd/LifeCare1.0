
import React, { useState, useMemo } from 'react';
import { AppData, Employee, Professional, StaffDocument, HouseDocument, Demand, ProfessionalArea, Resident, FinancialRecord } from '../types';
import { PROFESSIONAL_AREAS } from '../constants';
import { Shield, Search, User, FileText, Plus, Link, Trash2, ExternalLink, Briefcase, Contact, X, Check, ClipboardCheck, AlertCircle, AlertTriangle, Users, Home, Settings, Printer, Activity, CheckSquare, ListTodo, Pill, Baby, Send, Circle, UserCheck, FileWarning, Banknote, FileBadge, Calendar, TrendingUp, TrendingDown, DollarSign, CheckCircle2, MessageCircle, Save, Clock, Filter, ArrowUpDown } from 'lucide-react';

interface AdminPanelProps {
  data: AppData;
  onUpdateEmployee: (employee: Employee) => void;
  onUpdateProfessional: (professional: Professional) => void;
  onSaveHouseDocument: (doc: HouseDocument) => void;
  onDeleteHouseDocument: (id: string) => void;
  onSaveDemand: (demand: Demand) => void; 
  onUpdateResident?: (resident: Resident) => void; // New prop for save
}

// Unified interface for display
interface UnifiedStaffMember {
  id: string;
  name: string;
  roleOrArea: string;
  type: 'INTERNAL' | 'EXTERNAL';
  originalRef: Employee | Professional;
  documents: StaffDocument[];
  photo?: string;
  active?: boolean;
}

const DOCUMENT_TYPES = [
  { value: 'RG_CNH', label: 'RG ou CNH' },
  { value: 'CPF', label: 'CPF' },
  { value: 'CTPS', label: 'Carteira de Trabalho (CTPS – digital)' },
  { value: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de residência atualizado' },
  { value: 'TITULO_ELEITOR', label: 'Título de eleitor' },
  { value: 'RESERVISTA', label: 'Certificado de reservista (se aplicável)' },
  { value: 'CERTIDAO_NASC_CASAMENTO', label: 'Certidão de nascimento ou casamento' },
  { value: 'ESCOLARIDADE', label: 'Comprovante de escolaridade' },
  { value: 'PIS', label: 'Número do PIS' },
  { value: 'ASO', label: 'ASO – Exame Admissional (Apto)' },
  { value: 'CERTIDAO_FILHOS', label: 'Certidão de nascimento dos filhos (se houver)' },
  { value: 'VACINA_FILHOS', label: 'Carteira de vacinação dos filhos menores de 7 anos (se houver)' },
  { value: 'ESCOLA_FILHOS', label: 'Comprovante de frequência escolar dos filhos entre 7 e 14 anos (se houver)' },
  { value: 'COREN', label: 'Carteira do COREN' },
  { value: 'CONTRATO', label: 'Contrato de Trabalho' },
  { value: 'OUTRO', label: 'Outros Documentos' },
];

const HOUSE_DOC_TYPES = [
  { value: 'ALVARA_SANITARIO', label: 'Alvará Sanitário (Vigilância)' },
  { value: 'ALVARA_FUNCIONAMENTO', label: 'Alvará de Funcionamento (Prefeitura)' },
  { value: 'AVCB', label: 'AVCB / CLCB (Bombeiros)' },
  { value: 'CMI', label: 'Inscrição Cons. Municipal do Idoso (CMI)' },
  { value: 'CNES', label: 'Cadastro Nac. Estab. Saúde (CNES)' },
  { value: 'CNPJ', label: 'Cartão CNPJ' },
  { value: 'REGIMENTO', label: 'Regimento Interno' },
  { value: 'ESTATUTO', label: 'Estatuto Social / Contrato Social' },
  { value: 'PLANO_TRABALHO', label: 'Plano de Trabalho' },
  { value: 'CONTRATO_PRESTACAO', label: 'Modelo Contrato Prestação Serviços' },
  { value: 'MANUAL_BOAS_PRATICAS', label: 'Manual de Boas Práticas e POPs' },
  { value: 'PGRSS', label: 'Plano Gerenc. Resíduos (PGRSS)' },
  { value: 'CERTIFICADOS_TREINAMENTO', label: 'Certificados de Treinamento Equipe' },
  { value: 'RELACAO_FUNCIONARIOS', label: 'Relação Nominal de Funcionários' },
  { value: 'DEDETIZACAO', label: 'Certificado de Dedetização' },
  { value: 'LIMPEZA_CAIXA', label: 'Limpeza Caixa d\'Água' },
  { value: 'LIXO', label: 'Contrato Coleta de Lixo' },
  { value: 'OUTRO', label: 'Outros Documentos' }
];

const ADMISSION_CHECKLIST = [
  { key: 'RG_CNH', label: 'RG ou CNH', conditional: false },
  { key: 'CPF', label: 'CPF', conditional: false },
  { key: 'CTPS', label: 'Carteira de Trabalho (Digital)', conditional: false },
  { key: 'COMPROVANTE_RESIDENCIA', label: 'Comprovante de Residência', conditional: false },
  { key: 'TITULO_ELEITOR', label: 'Título de eleitor', conditional: false },
  { key: 'RESERVISTA', label: 'Certificado de Reservista', conditional: true },
  { key: 'CERTIDAO_NASC_CASAMENTO', label: 'Certidão Nasc./Casamento', conditional: false },
  { key: 'ESCOLARIDADE', label: 'Comprovante de Escolaridade', conditional: false },
  { key: 'PIS', label: 'Número do PIS', conditional: false },
  { key: 'ASO', label: 'ASO (Admissional)', conditional: false },
  { key: 'CERTIDAO_FILHOS', label: 'Certidão Nasc. Filhos', conditional: true },
  { key: 'VACINA_FILHOS', label: 'Vacinação Filhos (< 7 anos)', conditional: true },
  { key: 'ESCOLA_FILHOS', label: 'Escola Filhos (7 a 14 anos)', conditional: true },
];

const getAreaHeaderStyle = (area: ProfessionalArea) => {
    const styles: Record<ProfessionalArea, string> = {
        'PSICOLOGIA': 'bg-pink-50 text-pink-700 border-pink-200',
        'PEDAGOGIA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
        'ASSISTENTE_SOCIAL': 'bg-cyan-50 text-cyan-700 border-cyan-200',
        'NUTRICIONISTA': 'bg-green-50 text-green-700 border-green-200',
        'FISIOTERAPIA': 'bg-blue-50 text-blue-700 border-blue-200',
        'ENFERMAGEM': 'bg-red-50 text-red-700 border-red-200',
    };
    return styles[area] || 'bg-slate-50 text-slate-700 border-slate-200';
};

// Helper for formatting currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const AdminPanel: React.FC<AdminPanelProps> = ({ data, onUpdateEmployee, onUpdateProfessional, onSaveHouseDocument, onDeleteHouseDocument, onSaveDemand, onUpdateResident }) => {
  const [activeTab, setActiveTab] = useState<'TEAM' | 'HOUSE' | 'ADMIN' | 'FINANCIAL'>('TEAM');
  
  // Team Logic State
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'INTERNAL' | 'EXTERNAL'>('ALL');
  
  // House Logic State
  const [houseDocSearch, setHouseDocSearch] = useState('');

  // Financial Logic State
  const [financialMonth, setFinancialMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  const [financialSearch, setFinancialSearch] = useState('');
  const [financialStatusFilter, setFinancialStatusFilter] = useState<'ALL' | 'PENDING' | 'PAID' | 'MP'>('ALL');
  const [financialSort, setFinancialSort] = useState<'NAME' | 'DUE_DATE_ASC' | 'DUE_DATE_DESC'>('DUE_DATE_ASC');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false); 
  const [isHouseModalOpen, setIsHouseModalOpen] = useState(false);
  
  // Forms State
  const [newDocType, setNewDocType] = useState<string>('RG_CNH'); 
  const [newDocLink, setNewDocLink] = useState('');
  const [newDocName, setNewDocName] = useState('');
  const [newHouseDocDate, setNewHouseDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [newHouseDocExpiration, setNewHouseDocExpiration] = useState('');

  // Combine lists for Team
  const unifiedList: UnifiedStaffMember[] = useMemo(() => {
    const list: UnifiedStaffMember[] = [];
    (data.employees || []).forEach(emp => {
      list.push({
        id: emp.id,
        name: emp.name,
        roleOrArea: emp.role,
        type: 'INTERNAL',
        originalRef: emp,
        documents: emp.documents || [],
        photo: emp.photo,
        active: emp.active
      });
    });
    (data.professionals || []).forEach(prof => {
      list.push({
        id: prof.id,
        name: prof.name,
        roleOrArea: prof.area.replace('_', ' '),
        type: 'EXTERNAL',
        originalRef: prof,
        documents: prof.documents || [],
        photo: prof.photo
      });
    });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  }, [data.employees, data.professionals]);

  const filteredList = useMemo(() => {
    return unifiedList.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || member.type === filterType;
      return matchesSearch && matchesType;
    });
  }, [unifiedList, searchTerm, filterType]);

  const selectedMember = useMemo(() => 
    unifiedList.find(m => m.id === selectedStaffId), 
  [unifiedList, selectedStaffId]);

  // --- Handlers ---

  const handleSaveDocument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !newDocLink) return;

    const newDoc: StaffDocument = {
      id: crypto.randomUUID(),
      type: newDocType as any,
      name: newDocName || DOCUMENT_TYPES.find(t => t.value === newDocType)?.label || 'Documento',
      linkUrl: newDocLink,
      date: new Date().toISOString().split('T')[0]
    };

    if (selectedMember.type === 'INTERNAL') {
      const updatedEmp = { 
        ...(selectedMember.originalRef as Employee), 
        documents: [...(selectedMember.documents), newDoc] 
      };
      onUpdateEmployee(updatedEmp);
    } else {
      const updatedProf = { 
        ...(selectedMember.originalRef as Professional), 
        documents: [...(selectedMember.documents), newDoc] 
      };
      onUpdateProfessional(updatedProf);
    }

    setIsModalOpen(false);
    setNewDocLink('');
    setNewDocName('');
    setNewDocType('RG_CNH');
  };

  const handleDeleteDocument = (docId: string) => {
    if (!selectedMember || !confirm("Remover este documento?")) return;
    const updatedDocs = selectedMember.documents.filter(d => d.id !== docId);
    if (selectedMember.type === 'INTERNAL') {
      const updatedEmp = { ...(selectedMember.originalRef as Employee), documents: updatedDocs };
      onUpdateEmployee(updatedEmp);
    } else {
      const updatedProf = { ...(selectedMember.originalRef as Professional), documents: updatedDocs };
      onUpdateProfessional(updatedProf);
    }
  };

  const handleSaveHouseDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocLink) return;
    const doc: HouseDocument = {
      id: crypto.randomUUID(),
      type: newDocType as any,
      name: newDocName || HOUSE_DOC_TYPES.find(t => t.value === newDocType)?.label || 'Documento',
      linkUrl: newDocLink,
      issueDate: newHouseDocDate,
      expirationDate: newHouseDocExpiration
    };
    onSaveHouseDocument(doc);
    setIsHouseModalOpen(false);
    setNewDocLink('');
    setNewDocName('');
    setNewDocType('ALVARA_SANITARIO');
    setNewHouseDocExpiration('');
  };

  const handlePrintVitalSigns = () => {
    const activeResidents = data.residents.filter(r => r.active).sort((a, b) => a.name.localeCompare(b.name));
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Permita pop-ups para imprimir.");

    const rowsHtml = activeResidents.map((r, index) => `
        <tr>
            <td style="text-align: center;">${index + 1}</td>
            <td style="text-align: left; padding-left: 8px;">${r.name}</td>
            <td></td><td></td><td></td><td></td><td></td><td></td>
        </tr>
    `).join('');

    const html = `
      <html>
        <head>
            <title>Controle de Sinais Vitais - Lista Única</title>
            <style>
                @page { size: A4; margin: 10mm; }
                body { font-family: 'Helvetica', Arial, sans-serif; -webkit-print-color-adjust: exact; padding: 0; margin: 0; }
                .header-title { text-align: center; margin-bottom: 10px; font-size: 16px; font-weight: bold; text-transform: uppercase; border: 2px solid black; padding: 8px; background-color: #f0f0f0; }
                .meta { margin-bottom: 15px; font-size: 11px; display: flex; justify-content: space-between; font-weight: bold; border: 1px solid #ccc; padding: 8px; }
                table { width: 100%; border-collapse: collapse; font-size: 11px; }
                th, td { border: 1px solid black; height: 24px; padding: 0 4px; vertical-align: middle; }
                th { background-color: #fbceb1; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 10px; }
                .col-num { width: 30px; } .col-name { width: auto; } .col-data { width: 50px; text-align: center; } .col-obs { width: 150px; text-align: center; }
                tr:nth-child(even) { background-color: #fafafa; }
            </style>
        </head>
        <body>
            <div class="header-title">Controle Diário de Sinais Vitais</div>
            <div class="meta"><span>DATA: ____/____/________</span><span>TURNO: ( ) MANHÃ &nbsp; ( ) TARDE &nbsp; ( ) NOITE</span><span>RESP: _____________________________</span></div>
            <table><thead><tr><th class="col-num">Nº</th><th class="col-name">NOME COMPLETO</th><th class="col-data">PA</th><th class="col-data">PULSO</th><th class="col-data">TEMP</th><th class="col-data">SAT</th><th class="col-data">HGT</th><th class="col-obs">OBSERVAÇÕES</th></tr></thead><tbody>${rowsHtml}</tbody></table>
            <script>window.print();</script>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrintLaudoReport = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Permita pop-ups para imprimir.");

    const today = new Date();
    const activeResidents = data.residents.filter(r => r.active).sort((a, b) => a.name.localeCompare(b.name));

    // Processamento de dados
    const criticalList: any[] = [];
    const validList: any[] = [];

    activeResidents.forEach(res => {
        const laudo = res.documents?.find(d => d.type === 'LAUDO');
        
        if (!laudo) {
            criticalList.push({
                name: res.name,
                room: res.room,
                status: 'SEM LAUDO',
                daysLeft: -999,
                date: null
            });
        } else {
            const baseDateStr = laudo.issueDate || laudo.date;
            const issueDate = new Date(baseDateStr);
            const expirationDate = new Date(issueDate);
            expirationDate.setDate(expirationDate.getDate() + 180); 

            const todayZero = new Date(today);
            todayZero.setHours(0,0,0,0);
            const expZero = new Date(expirationDate);
            expZero.setHours(0,0,0,0);

            const diffTime = expZero.getTime() - todayZero.getTime();
            const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (daysLeft < 0) {
                criticalList.push({
                    name: res.name,
                    room: res.room,
                    status: 'VENCIDO',
                    daysLeft: daysLeft,
                    date: baseDateStr
                });
            } else {
                validList.push({
                    name: res.name,
                    room: res.room,
                    status: 'VIGENTE',
                    daysLeft: daysLeft,
                    date: baseDateStr,
                    expiration: expirationDate.toISOString().split('T')[0]
                });
            }
        }
    });

    criticalList.sort((a, b) => a.daysLeft - b.daysLeft); 
    validList.sort((a, b) => a.daysLeft - b.daysLeft);

    const html = `
      <html>
      <head>
        <title>Relatório de Controle de Laudos</title>
        <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #000; padding: 0; margin: 0; -webkit-print-color-adjust: exact; }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            h1 { margin: 0; font-size: 16px; text-transform: uppercase; }
            h2 { margin: 15px 0 5px 0; font-size: 12px; background-color: #eee; padding: 4px; border-left: 5px solid #666; }
            p { margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            th, td { border: 1px solid #999; padding: 4px; text-align: left; height: 18px; }
            th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
            .status-critical { color: red; font-weight: bold; }
            .status-warning { color: orange; font-weight: bold; }
            .status-ok { color: green; font-weight: bold; }
            .center { text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
            <h1>Relatório de Controle de Laudos Médicos</h1>
            <p>Data de Emissão: ${today.toLocaleDateString('pt-BR')}</p>
            <p>Validade Padrão: 180 dias da emissão</p>
        </div>

        ${criticalList.length > 0 ? `
        <h2>⚠️ PENDÊNCIAS (Sem Laudo ou Vencidos)</h2>
        <table>
            <thead>
                <tr>
                    <th>Residente</th>
                    <th width="60">Quarto</th>
                    <th width="100">Situação</th>
                    <th width="80">Data Base</th>
                    <th width="80">Dias Vencido</th>
                </tr>
            </thead>
            <tbody>
                ${criticalList.map(item => `
                    <tr>
                        <td><strong>${item.name}</strong></td>
                        <td class="center">${item.room}</td>
                        <td class="center status-critical">${item.status}</td>
                        <td class="center">${item.date ? new Date(item.date).toLocaleDateString('pt-BR') : '-'}</td>
                        <td class="center status-critical">${item.status === 'SEM LAUDO' ? '-' : Math.abs(item.daysLeft) + ' dias'}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        ` : ''}

        <h2>✅ LAUDOS VIGENTES</h2>
        <table>
            <thead>
                <tr>
                    <th>Residente</th>
                    <th width="60">Quarto</th>
                    <th width="80">Emissão</th>
                    <th width="80">Vencimento</th>
                    <th width="100">Dias Restantes</th>
                </tr>
            </thead>
            <tbody>
                ${validList.map(item => {
                    const isWarning = item.daysLeft <= 30;
                    return `
                    <tr>
                        <td>${item.name}</td>
                        <td class="center">${item.room}</td>
                        <td class="center">${new Date(item.date).toLocaleDateString('pt-BR')}</td>
                        <td class="center">${new Date(item.expiration).toLocaleDateString('pt-BR')}</td>
                        <td class="center ${isWarning ? 'status-warning' : 'status-ok'}">${item.daysLeft} dias</td>
                    </tr>
                    `;
                }).join('')}
                ${validList.length === 0 ? '<tr><td colspan="5" class="center">Nenhum laudo vigente encontrado.</td></tr>' : ''}
            </tbody>
        </table>

        <div style="margin-top: 20px; font-size: 9px; text-align: center; color: #666;">
            Gerado automaticamente pelo sistema LifeCare
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  const handlePrintEmployeeList = () => {
    // 1. Internal Employees
    const activeEmployees = (data.employees || []).filter(e => e.active).map(e => ({
      name: e.name,
      role: e.role,
      cpf: e.cpf || '-',
      admission: e.admissionDate ? e.admissionDate.split('-').reverse().join('/') : '-',
      phone: e.phone || '-'
    }));

    // 2. External Professionals
    const professionals = (data.professionals || []).map(p => ({
      name: p.name,
      role: p.area.replace('_', ' '), // Use Area as Role
      cpf: '-',
      admission: '-',
      phone: p.phone || '-'
    }));

    // 3. Combine and Sort
    const fullList = [...activeEmployees, ...professionals].sort((a,b) => a.name.localeCompare(b.name));

    const printWindow = window.open('', '_blank');
    if (!printWindow) return alert("Permita pop-ups para imprimir.");

    const html = `
      <html>
      <head>
        <title>Relação Nominal de Colaboradores</title>
        <style>
            @page { size: A4; margin: 10mm; }
            body { font-family: 'Helvetica', Arial, sans-serif; font-size: 10px; color: #000; padding: 0; margin: 0; }
            .header { text-align: center; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 5px; }
            h1 { margin: 0; font-size: 16px; text-transform: uppercase; }
            p { margin: 2px 0; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #000; padding: 4px; text-align: left; vertical-align: middle; white-space: nowrap; }
            th { background-color: #e5e7eb; font-weight: bold; text-align: center; text-transform: uppercase; font-size: 9px; }
            tr:nth-child(even) { background-color: #f9fafb; }
            .center { text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
            <h1>Relação Nominal de Colaboradores (Equipe & Profissionais)</h1>
            <p>Data de Emissão: ${new Date().toLocaleDateString('pt-BR')}</p>
            <p>Status: ATIVOS</p>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="30">Nº</th>
                    <th>Nome Completo</th>
                    <th>Cargo / Função</th>
                    <th>CPF</th>
                    <th>Admissão</th>
                    <th>Telefone</th>
                </tr>
            </thead>
            <tbody>
                ${fullList.map((emp, index) => `
                    <tr>
                        <td class="center">${index + 1}</td>
                        <td>${emp.name}</td>
                        <td class="center">${emp.role}</td>
                        <td class="center">${emp.cpf}</td>
                        <td class="center">${emp.admission}</td>
                        <td class="center">${emp.phone}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div style="margin-top: 30px; font-size: 9px; text-align: center; color: #666;">
            Documento para fins administrativos e fiscais.
        </div>
        <script>window.print();</script>
      </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  // --- Helper to calculate balance locally for AdminPanel usage ---
  const getPersonalStock = (residentId: string, productId: string) => {
    const txs = data.transactions.filter(t => t.residentId === residentId && t.productId === productId);
    const totalIn = txs.filter(t => t.type === 'IN').reduce((acc, t) => acc + t.quantity, 0);
    const totalOut = txs.filter(t => t.type === 'OUT').reduce((acc, t) => acc + t.quantity, 0);
    return totalIn - totalOut;
  };

  const getDocTypeLabel = (type: string) => DOCUMENT_TYPES.find(t => t.value === type)?.label || type;
  const getHouseDocTypeLabel = (type: string) => HOUSE_DOC_TYPES.find(t => t.value === type)?.label || type;

  // --- Send Demand Handler ---
  const handleSendDemand = (demand: Demand) => {
    const residentsNames = demand.residentIds.map(rid => data.residents.find(r => r.id === rid)?.name).filter(Boolean).join(', ');
    const areas = demand.professionalAreas.join(', ');
    
    // Replace "RP" with "Relatório Psicossocial"
    const displayTitle = demand.title.replace(/\bRP\b/g, 'Relatório Psicossocial');

    let message = `Olá, nova demanda atribuída:\n\n`;
    message += `*Título:* ${displayTitle}\n`;
    message += `*Áreas:* ${areas}\n`;
    message += `*Para:* ${residentsNames}\n`;
    if(demand.description) message += `*Detalhes:* ${demand.description}\n`;
    message += `\nPor favor, verificar no sistema.`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    onSaveDemand({ ...demand, status: 'EM_ANDAMENTO' });
  };

  // --- FINANCIAL HANDLERS ---

  const getFinancialRecord = (resident: Resident, monthKey: string) => {
    return (resident.financialRecords || []).find(r => r.monthKey === monthKey);
  };

  const handleUpdateFinancial = (resident: Resident, updates: Partial<FinancialRecord>) => {
    if (!onUpdateResident) {
        console.error("onUpdateResident is not defined");
        return;
    }

    const currentRecords = resident.financialRecords || [];
    const recordIndex = currentRecords.findIndex(r => r.monthKey === financialMonth);
    let newRecords = [...currentRecords];

    // Determine default day based on admission if defaultDueDay is standard (10)
    let defaultDay = resident.defaultDueDay || 10;
    if (defaultDay === 10 && resident.admissionDate) {
         const adDay = parseInt(resident.admissionDate.split('-')[2]);
         if (!isNaN(adDay)) defaultDay = adDay;
    }

    if (recordIndex >= 0) {
        // Update existing
        newRecords[recordIndex] = { ...newRecords[recordIndex], ...updates };
    } else {
        // Create new
        const newRecord: FinancialRecord = {
            id: crypto.randomUUID(),
            monthKey: financialMonth,
            value: resident.defaultMonthlyFee || 0,
            dueDate: `${financialMonth}-${String(defaultDay).padStart(2, '0')}`,
            status: 'PENDENTE',
            ...updates
        };
        newRecords.push(newRecord);
    }

    onUpdateResident({ ...resident, financialRecords: newRecords });
  };

  const getWhatsAppPaymentLink = (resident: Resident, record: FinancialRecord) => {
    // Tenta primeiro o telefone principal, se não existir, usa o secundário
    let phone = resident.responsible.phone1?.replace(/\D/g, '');
    if (!phone && resident.responsible.phone2) {
        phone = resident.responsible.phone2.replace(/\D/g, '');
    }
    
    if (!phone) return null;
    const fullPhone = phone.length <= 11 ? `55${phone}` : phone;

    const [year, month] = record.monthKey.split('-');
    const dateObj = new Date(parseInt(year), parseInt(month)-1, 1);
    const monthName = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
    const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
    
    // Fix: Parse YYYY-MM-DD directly to DD/MM/YYYY to avoid timezone issues
    let dueDateFormatted = 'A definir';
    if (record.dueDate) {
        const parts = record.dueDate.split('-'); // YYYY-MM-DD
        if (parts.length === 3) {
            dueDateFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
    }
    
    const valueFormatted = formatCurrency(record.value);

    let message = `Olá, ${resident.responsible.name}.\n\n`;
    message += `Informamos que ainda não identificamos o pagamento da mensalidade de ${capitalizedMonth} referente ao residente ${resident.name}, vencida em ${dueDateFormatted}.\n\n`;
    message += `Dados para pagamento:\n\n`;
    message += `Valor: ${valueFormatted}\n\n`;
    message += `Chave PIX: aconchegodapazseropedica@gmail.com\n\n`;
    message += `A pontualidade do pagamento nos permite assegurar a continuidade dos cuidados dedicados e o fornecimento de todos os recursos essenciais ao bem-estar do residente.\n\n`;
    message += `Caso o pagamento já tenha sido efetuado, por favor, envie o comprovante para que possamos atualizar nosso sistema.\n\n`;
    message += `Atenciosamente, Equipe Aconchego da Paz`;

    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  };

  // --- RENDERERS ---

  const renderTeamManagement = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-250px)]">
      <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col">
         <div className="space-y-3 mb-4">
            <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" placeholder="Buscar nome..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
            <div className="flex bg-slate-100 p-1 rounded-lg">
               <button onClick={() => setFilterType('ALL')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filterType === 'ALL' ? 'bg-white shadow text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>Todos</button>
               <button onClick={() => setFilterType('INTERNAL')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filterType === 'INTERNAL' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>Internos</button>
               <button onClick={() => setFilterType('EXTERNAL')} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filterType === 'EXTERNAL' ? 'bg-white shadow text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}>Externos</button>
            </div>
         </div>
         <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredList.map(member => (
              <button key={member.id} onClick={() => setSelectedStaffId(member.id)} className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors border-2 ${selectedStaffId === member.id ? 'bg-primary-50 border-primary-300' : 'border-transparent hover:bg-slate-50'}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden ${member.type === 'INTERNAL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                    {member.photo ? <img src={member.photo} className="w-full h-full object-cover" /> : (member.type === 'INTERNAL' ? <Briefcase size={20} /> : <Contact size={20} />)}
                </div>
                <div className="flex-1 min-w-0"><p className="font-bold text-slate-700 text-sm truncate">{member.name}</p><p className="text-xs text-slate-400 truncate uppercase">{member.roleOrArea}</p></div>
                {member.documents.length > 0 && (<div className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{member.documents.length} Docs</div>)}
              </button>
            ))}
            {filteredList.length === 0 && <p className="text-center text-slate-400 py-8 text-sm">Ninguém encontrado.</p>}
         </div>
      </div>
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
         {!selectedMember ? (
           <div className="m-auto text-center text-slate-400"><Shield size={48} className="mx-auto mb-4 opacity-20" /><p className="font-medium">Selecione um membro da equipe</p><p className="text-sm">para gerenciar seus documentos.</p></div>
         ) : (
           <div className="flex flex-col h-full animate-in fade-in">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between border-b border-slate-100 pb-6 mb-4 gap-4">
                 <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm overflow-hidden ${selectedMember.type === 'INTERNAL' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                       {selectedMember.photo ? <img src={selectedMember.photo} className="w-full h-full object-cover" /> : (selectedMember.name.charAt(0))}
                    </div>
                    <div><h2 className="text-xl font-bold text-slate-800">{selectedMember.name}</h2><p className="text-slate-500 font-medium">{selectedMember.roleOrArea} • {selectedMember.type === 'INTERNAL' ? 'Equipe Interna' : 'Profissional Externo'}</p></div>
                 </div>
                 <div className="flex gap-2">
                    <button onClick={() => setIsChecklistModalOpen(true)} className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold transition-colors text-sm"><ClipboardCheck size={18}/> Checklist Docs</button>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold transition-colors text-sm shadow-sm"><Plus size={18}/> Adicionar Doc</button>
                 </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3">
                 {selectedMember.documents.map(doc => (
                   <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 transition-colors group">
                      <div className="flex items-center gap-3">
                         <div className="bg-white p-2 rounded-lg border border-slate-200 text-blue-600"><FileText size={20} /></div>
                         <div><p className="font-bold text-slate-700">{doc.name}</p><p className="text-xs text-slate-400">Adicionado em {new Date(doc.date).toLocaleDateString('pt-BR')}</p></div>
                      </div>
                      <div className="flex items-center gap-2">
                         <a href={doc.linkUrl} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-white rounded-lg transition-colors"><ExternalLink size={18} /></a>
                         <button onClick={() => handleDeleteDocument(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                   </div>
                 ))}
                 {selectedMember.documents.length === 0 && <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300"><FileText className="mx-auto mb-2 opacity-30" size={32} /><p>Nenhum documento cadastrado.</p></div>}
              </div>
           </div>
         )}
      </div>
    </div>
  );

  const renderHouseManagement = () => (
    <div className="space-y-6 animate-in fade-in">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
           <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Home className="text-orange-500" /> Documentos da Instituição</h3>
              <p className="text-sm text-slate-500">Gestão de Alvarás, AVCB e contratos obrigatórios.</p>
           </div>
           <button onClick={() => setIsHouseModalOpen(true)} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 flex items-center gap-2 font-bold shadow-sm"><Plus size={18}/> Novo Documento</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {(data.houseDocuments || []).map(doc => {
              // Calculate expiration status
              let statusColor = 'bg-green-100 text-green-700 border-green-200';
              let statusText = 'VIGENTE';
              let daysLeft = null;

              if (doc.expirationDate) {
                 const today = new Date();
                 const exp = new Date(doc.expirationDate);
                 const diffTime = exp.getTime() - today.getTime();
                 daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                 if (daysLeft < 0) {
                    statusColor = 'bg-red-100 text-red-700 border-red-200';
                    statusText = 'VENCIDO';
                 } else if (daysLeft <= 30) {
                    statusColor = 'bg-orange-100 text-orange-700 border-orange-200';
                    statusText = 'VENCE EM BREVE';
                 }
              } else {
                 statusColor = 'bg-slate-100 text-slate-700 border-slate-200';
                 statusText = 'SEM VALIDADE';
              }

              return (
                <div key={doc.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                   <div>
                      <div className="flex justify-between items-start mb-2">
                         <div className={`p-2 rounded-lg ${statusColor.replace('bg-', 'text-').split(' ')[0].replace('text-', 'bg-').replace('700', '100')}`}>
                            <FileBadge size={24} className={statusColor.split(' ')[1]} />
                         </div>
                         <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${statusColor}`}>{statusText}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 leading-tight mb-1">{doc.name}</h4>
                      <p className="text-xs text-slate-500 mb-4">{getHouseDocTypeLabel(doc.type)}</p>
                      
                      {doc.expirationDate && (
                         <div className="bg-slate-50 p-2 rounded border border-slate-100 text-xs mb-4">
                            <div className="flex justify-between mb-1"><span className="text-slate-500">Emissão:</span><span className="font-medium">{doc.issueDate ? new Date(doc.issueDate).toLocaleDateString('pt-BR') : '-'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Vencimento:</span><span className={`font-bold ${daysLeft !== null && daysLeft < 0 ? 'text-red-600' : 'text-slate-800'}`}>{new Date(doc.expirationDate).toLocaleDateString('pt-BR')}</span></div>
                         </div>
                      )}
                   </div>
                   
                   <div className="flex gap-2 pt-3 border-t border-slate-100">
                      <a href={doc.linkUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-2"><ExternalLink size={14}/> Abrir</a>
                      <button onClick={() => onDeleteHouseDocument(doc.id)} className="p-2 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={18}/></button>
                   </div>
                </div>
              );
           })}
           {(data.houseDocuments || []).length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                 <FileWarning className="mx-auto mb-2 opacity-30" size={48} />
                 <p>Nenhum documento institucional cadastrado.</p>
              </div>
           )}
        </div>
    </div>
  );

  const renderFinancialManagement = () => {
    // PRE-PROCESSING: Determine status and sort value for each resident
    const processedList = data.residents
        .filter(r => r.active)
        .map(r => {
             const record = getFinancialRecord(r, financialMonth);
             const isMP = r.isMP;
             const isPaid = record?.status === 'PAGO';
             
             // Determine exact status for filtering
             let statusFilterKey: 'PENDING' | 'PAID' | 'MP' = 'PENDING';
             if (isMP) statusFilterKey = 'MP';
             else if (isPaid) statusFilterKey = 'PAID';
             else statusFilterKey = 'PENDING';

             // LOGIC: Use Admission Day if defaultDueDay is 10 (default)
             let day = r.defaultDueDay || 10;
             if (day === 10 && r.admissionDate) {
                 const adDay = parseInt(r.admissionDate.split('-')[2]);
                 if (!isNaN(adDay)) day = adDay;
             }

             // Determine effective due date for sorting
             let dueDateStr = record?.dueDate || `${financialMonth}-${String(day).padStart(2, '0')}`;
             
             return {
                 resident: r,
                 record,
                 statusFilterKey,
                 dueDateStr,
                 calculatedDay: day
             };
        });

    // FILTERING AND SORTING
    const residentsList = processedList
        .filter(item => {
            const matchesSearch = item.resident.name.toLowerCase().includes(financialSearch.toLowerCase());
            const matchesStatus = financialStatusFilter === 'ALL' || item.statusFilterKey === financialStatusFilter;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (financialSort === 'NAME') {
                return a.resident.name.localeCompare(b.resident.name);
            } else if (financialSort === 'DUE_DATE_ASC') {
                return a.dueDateStr.localeCompare(b.dueDateStr) || a.resident.name.localeCompare(b.resident.name);
            } else if (financialSort === 'DUE_DATE_DESC') {
                return b.dueDateStr.localeCompare(a.dueDateStr) || a.resident.name.localeCompare(b.resident.name);
            }
            return 0;
        });

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
                <div>
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Banknote className="text-emerald-600" /> Painel Financeiro
                    </h3>
                    <p className="text-sm text-slate-500">Controle de mensalidades e status de pagamento.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 items-center w-full xl:w-auto">
                    {/* FILTROS */}
                    <div className="flex gap-2 w-full md:w-auto">
                        <select 
                            className="p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium"
                            value={financialStatusFilter}
                            onChange={(e) => setFinancialStatusFilter(e.target.value as any)}
                        >
                            <option value="ALL">Todos os Status</option>
                            <option value="PENDING">Pendentes</option>
                            <option value="PAID">Pagos</option>
                            <option value="MP">MP (Cobertos)</option>
                        </select>

                        <div className="relative">
                            <select 
                                className="p-2 pl-8 border border-slate-300 rounded-lg text-sm bg-slate-50 font-medium appearance-none pr-8"
                                value={financialSort}
                                onChange={(e) => setFinancialSort(e.target.value as any)}
                            >
                                <option value="DUE_DATE_ASC">Vencimento (Crescente)</option>
                                <option value="DUE_DATE_DESC">Vencimento (Decrescente)</option>
                                <option value="NAME">Nome (A-Z)</option>
                            </select>
                            <ArrowUpDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                        </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-48">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                           <input 
                             type="text" 
                             placeholder="Buscar residente..."
                             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm"
                             value={financialSearch}
                             onChange={e => setFinancialSearch(e.target.value)}
                           />
                        </div>
                        <input 
                            type="month" 
                            className="p-2 border border-slate-300 rounded-lg font-bold text-slate-700 w-full md:w-auto"
                            value={financialMonth}
                            onChange={e => setFinancialMonth(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase text-xs">
                        <tr>
                            <th className="p-4">Residente</th>
                            <th className="p-4 text-center">Vencimento</th>
                            <th className="p-4 text-right">Valor</th>
                            <th className="p-4 text-center">Status</th>
                            <th className="p-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {residentsList.map(({ resident, record, dueDateStr, calculatedDay }) => {
                            const isPaid = record?.status === 'PAGO';
                            const isMP = resident.isMP; 
                            
                            // Default Values
                            const displayValue = record ? record.value : (resident.defaultMonthlyFee || 0);
                            
                            // Safe Date Formatting
                            const [y, m, d] = dueDateStr.split('-').map(Number);
                            const displayDateObj = new Date(y, m - 1, d, 12, 0, 0); 
                            const formattedDate = displayDateObj.toLocaleDateString('pt-BR');

                            // Use existing record or create a virtual one based on defaults to enable WhatsApp link
                            const effectiveRecord: FinancialRecord = record || {
                                id: 'virtual',
                                monthKey: financialMonth,
                                value: displayValue,
                                dueDate: dueDateStr,
                                status: 'PENDENTE'
                            };

                            const paymentLink = getWhatsAppPaymentLink(resident, effectiveRecord);

                            return (
                                <tr key={resident.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-bold text-slate-700 flex items-center gap-3">
                                        <div className="w-9 h-11 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200 flex items-center justify-center">
                                            {resident.photo ? <img src={resident.photo} className="w-full h-full object-cover" /> : <User size={20} className="text-slate-300" />}
                                        </div>
                                        {resident.name}
                                        {isMP && <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded border border-indigo-200 font-bold ml-1">MP</span>}
                                    </td>
                                    <td className="p-4 text-center text-slate-600">
                                        {formattedDate}
                                    </td>
                                    <td className="p-4 text-right font-mono text-slate-700">
                                        {formatCurrency(displayValue)}
                                    </td>
                                    <td className="p-4 text-center">
                                        {isMP ? (
                                            <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-200">
                                                <Shield size={12}/> COBERTO (MP)
                                            </span>
                                        ) : (
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                                                {isPaid ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                                                {isPaid ? 'PAGO' : 'PENDENTE'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        {!isMP && (
                                            <div className="flex justify-end gap-2">
                                                {paymentLink ? (
                                                    <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="Enviar Cobrança WhatsApp">
                                                        <MessageCircle size={16}/>
                                                    </a>
                                                ) : (
                                                    <button disabled className="p-2 text-slate-300 bg-slate-50 rounded-lg cursor-not-allowed" title="Sem telefone cadastrado">
                                                        <MessageCircle size={16}/>
                                                    </button>
                                                )}
                                                
                                                <button 
                                                    onClick={() => handleUpdateFinancial(resident, { 
                                                        status: isPaid ? 'PENDENTE' : 'PAGO', 
                                                        paymentDate: isPaid ? undefined : new Date().toISOString().split('T')[0],
                                                        value: displayValue,
                                                        dueDate: dueDateStr
                                                    })}
                                                    className={`p-2 rounded-lg transition-colors font-bold text-xs flex items-center gap-1 ${isPaid ? 'bg-slate-100 text-slate-500 hover:bg-slate-200' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'}`}
                                                >
                                                    {isPaid ? 'Desfazer' : 'Confirmar'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                        {residentsList.length === 0 && (
                            <tr><td colSpan={5} className="p-8 text-center text-slate-400">Nenhum residente encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Shield className="text-primary-600" />
            Painel Administrativo
          </h2>
          <p className="text-slate-500 text-sm">Central de documentos, equipe e gestão da instituição.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={handlePrintEmployeeList} className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 shadow-sm flex items-center gap-2 text-sm font-bold">
              <Printer size={16} /> Relatório Funcionários
           </button>
           <button onClick={handlePrintVitalSigns} className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 shadow-sm flex items-center gap-2 text-sm font-bold">
              <Activity size={16} /> Folha Sinais Vitais
           </button>
           <button onClick={handlePrintLaudoReport} className="bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-900 shadow-sm flex items-center gap-2 text-sm font-bold">
              <FileWarning size={16} /> Controle Laudos
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'TEAM' ? 'border-primary-600 text-primary-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('TEAM')}><div className="flex items-center gap-2"><Briefcase size={18} /> Equipe & Docs</div></button>
        <button className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'HOUSE' ? 'border-orange-600 text-orange-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('HOUSE')}><div className="flex items-center gap-2"><Home size={18} /> Documentos da Casa</div></button>
        <button className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'FINANCIAL' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('FINANCIAL')}><div className="flex items-center gap-2"><Banknote size={18} /> Financeiro</div></button>
        <button className={`px-6 py-3 font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'ADMIN' ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`} onClick={() => setActiveTab('ADMIN')}><div className="flex items-center gap-2"><Settings size={18} /> Administrativo</div></button>
      </div>

      {activeTab === 'TEAM' && renderTeamManagement()}
      {activeTab === 'HOUSE' && renderHouseManagement()}
      {activeTab === 'FINANCIAL' && renderFinancialManagement()}
      {activeTab === 'ADMIN' && (
         <div className="p-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <Settings size={48} className="mx-auto mb-4 opacity-20" />
            <h3 className="text-lg font-bold text-slate-600">Configurações Gerais</h3>
            <p>Em breve: Configurações de backup avançado, usuários e permissões.</p>
         </div>
      )}

      {/* House Doc Modal */}
      {isHouseModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <form onSubmit={handleSaveHouseDoc} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-800">Novo Documento Institucional</h3>
                 <button type="button" onClick={() => setIsHouseModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento</label>
                    <select className="w-full p-2 border border-slate-300 rounded-md bg-white" value={newDocType} onChange={e => setNewDocType(e.target.value)}>
                       {HOUSE_DOC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                 </div>
                 {newDocType === 'OUTRO' && (
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Documento</label>
                       <input type="text" className="w-full p-2 border border-slate-300 rounded-md" value={newDocName} onChange={e => setNewDocName(e.target.value)} required />
                    </div>
                 )}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Emissão</label>
                    <input type="date" className="w-full p-2 border border-slate-300 rounded-md" value={newHouseDocDate} onChange={e => setNewHouseDocDate(e.target.value)} required />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Data de Validade (Vencimento)</label>
                    <input type="date" className="w-full p-2 border border-slate-300 rounded-md" value={newHouseDocExpiration} onChange={e => setNewHouseDocExpiration(e.target.value)} required />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Link do Documento (Drive/Cloud) *</label>
                    <input type="url" placeholder="https://..." className="w-full p-2 border border-slate-300 rounded-md" value={newDocLink} onChange={e => setNewDocLink(e.target.value)} required />
                 </div>
              </div>
              <div className="flex gap-3 justify-end pt-6 mt-2 border-t border-slate-100">
                 <button type="button" onClick={() => setIsHouseModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold shadow-sm">Salvar</button>
              </div>
           </form>
        </div>
      )}

      {/* Checklist Modal */}
      {isChecklistModalOpen && selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg animate-in zoom-in-95 max-h-[90vh] overflow-hidden flex flex-col">
              <div className="flex justify-between items-center mb-4 shrink-0">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800">Checklist de Documentos</h3>
                    <p className="text-sm text-slate-500">Verificação para {selectedMember.name}</p>
                 </div>
                 <button onClick={() => setIsChecklistModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="overflow-y-auto flex-1 pr-2">
                 <div className="space-y-2">
                    {ADMISSION_CHECKLIST.map(item => {
                       const hasDoc = selectedMember.documents.some(d => d.type === item.key);
                       return (
                          <div key={item.key} className={`flex items-center justify-between p-3 rounded-lg border ${hasDoc ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                             <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${hasDoc ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-300 text-transparent'}`}>
                                   <Check size={14} />
                                </div>
                                <span className={`text-sm ${hasDoc ? 'font-bold text-green-800' : 'text-slate-600'}`}>{item.label}</span>
                             </div>
                             {item.conditional && !hasDoc && <span className="text-[10px] text-slate-400 italic">Opcional</span>}
                          </div>
                       )
                    })}
                 </div>
              </div>
              <div className="pt-4 border-t border-slate-100 mt-4 text-right shrink-0">
                 <p className="text-xs text-slate-400 mb-2">Progresso: {Math.round((selectedMember.documents.length / ADMISSION_CHECKLIST.filter(i=>!i.conditional).length) * 100)}% dos obrigatórios</p>
                 <button onClick={() => setIsChecklistModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium text-sm">Fechar</button>
              </div>
           </div>
        </div>
      )}

      {/* Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
           <form onSubmit={handleSaveDocument} className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-lg text-slate-800">Adicionar Documento</h3>
                 <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24}/></button>
              </div>
              <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de Documento</label>
                    <select className="w-full p-2 border border-slate-300 rounded-md bg-white" value={newDocType} onChange={e => setNewDocType(e.target.value)}>
                       {DOCUMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                 </div>
                 {newDocType === 'OUTRO' && (
                    <div>
                       <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Documento</label>
                       <input type="text" className="w-full p-2 border border-slate-300 rounded-md" value={newDocName} onChange={e => setNewDocName(e.target.value)} required />
                    </div>
                 )}
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Link do Documento (Drive/Cloud) *</label>
                    <input type="url" placeholder="https://..." className="w-full p-2 border border-slate-300 rounded-md" value={newDocLink} onChange={e => setNewDocLink(e.target.value)} required />
                 </div>
              </div>
              <div className="flex gap-3 justify-end pt-6 mt-2 border-t border-slate-100">
                 <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancelar</button>
                 <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-bold shadow-sm">Salvar</button>
              </div>
           </form>
        </div>
      )}
    </div>
  );
};
