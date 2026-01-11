import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Residents } from './components/Residents';
import { Inventory } from './components/Inventory';
import { Medications } from './components/Medications';
import { StockOperations } from './components/StockOperations';
import { Reports } from './components/Reports';
import { MedicalCare } from './components/MedicalCare';
import { TechnicalCare } from './components/TechnicalCare'; 
import { Demands } from './components/Demands';
import { PersonalItems } from './components/PersonalItems';
import { Employees } from './components/Employees';
import { Evolutions } from './components/Evolutions';
import { AdminPanel } from './components/AdminPanel'; // Importação do novo componente
import { AppData, Product, Resident, Transaction, ViewName, Prescription, MedicalAppointment, Demand, Professional, Employee, TimeSheetEntry, TechnicalSession, EvolutionRecord, HouseDocument } from './types';
import { loadData, saveData, exportData } from './services/storage';
import { Database, Upload, Download, RefreshCw, Trash2, Folder, CheckCircle2, Save, AlertCircle, Loader2, Clock, ShieldCheck, HardDrive, AlertTriangle, ArrowRight } from 'lucide-react';

// Helper for Safe ID Generation
const generateSafeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
    }
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewName>('dashboard');
  const [data, setData] = useState<AppData>(loadData());
  
  // Backup States
  const [backupHandle, setBackupHandle] = useState<any>(null); // Handle para pasta local
  const [backupStatus, setBackupStatus] = useState<'IDLE' | 'PENDING' | 'SAVING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null);
  
  // Force Init State
  const [isBackupInitialized, setIsBackupInitialized] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [showSkipConfirmation, setShowSkipConfirmation] = useState(false);

  useEffect(() => {
    // 1. Salva no LocalStorage (Imediato e Síncrono)
    saveData(data);
    
    // 2. Configura Backup Automático em Arquivo (Assíncrono e Debounced)
    if (backupHandle) {
      setBackupStatus('PENDING'); // Indica que há dados não salvos no arquivo
      
      const performBackup = async () => {
        setBackupStatus('SAVING');
        try {
          // @ts-ignore
          const fileHandle = await backupHandle.getFileHandle('lifecare_auto_backup.json', { create: true });
          // @ts-ignore
          const writable = await fileHandle.createWritable();
          await writable.write(JSON.stringify(data, null, 2));
          await writable.close();
          
          setBackupStatus('SUCCESS');
          setLastBackupTime(new Date().toLocaleTimeString('pt-BR'));
          console.log("Backup automático realizado com sucesso.");
        } catch (e) {
          console.error("Falha no backup automático:", e);
          setBackupStatus('ERROR');
        }
      };

      const timeoutId = setTimeout(() => {
          performBackup();
      }, 2000); // Aguarda 2 segundos de inatividade para salvar no arquivo

      return () => clearTimeout(timeoutId);
    }

  }, [data, backupHandle]);

  // --- Handlers ---

  const handleSaveResident = (resident: Resident) => {
    setData(prev => {
      const residents = [...(prev.residents || [])];
      const index = residents.findIndex(r => r.id === resident.id);
      
      if (index >= 0) {
        residents[index] = resident;
      } else {
        residents.push({ ...resident, id: resident.id || generateSafeId() });
      }
      return { ...prev, residents };
    });
  };

  const handleDeleteResident = (id: string) => {
    setData(prev => ({ ...prev, residents: (prev.residents || []).filter(r => r.id !== id) }));
  };

  const handleSaveProduct = (product: Product) => {
    setData(prev => {
      const products = [...(prev.products || [])];
      const index = products.findIndex(p => p.id === product.id);
      
      if (index >= 0) {
        products[index] = product;
      } else {
        products.push({ ...product, id: product.id || generateSafeId() });
      }
      return { ...prev, products };
    });
  };

  const handleDeleteProduct = (id: string) => {
    setData(prev => ({ ...prev, products: (prev.products || []).filter(p => p.id !== id) }));
  };

  const handleTransaction = (transaction: Transaction) => {
    setData(prev => {
      const products = [...(prev.products || [])];
      const transactions = [...(prev.transactions || [])];

      const productIndex = products.findIndex(p => p.id === transaction.productId);
      if (productIndex >= 0) {
        const product = { ...products[productIndex] };
        const change = transaction.type === 'IN' ? transaction.quantity : -transaction.quantity;
        product.currentStock = product.currentStock + change;
        products[productIndex] = product;
      }

      transactions.push({ ...transaction, id: transaction.id || generateSafeId() });

      return {
        ...prev,
        products,
        transactions
      };
    });
  };

  const handleDeleteTransaction = (id: string) => {
    setData(prev => {
      const transactions = [...(prev.transactions || [])];
      const products = [...(prev.products || [])];

      const txIndex = transactions.findIndex(t => t.id === id);
      
      if (txIndex === -1) return prev;
      const txToRemove = transactions[txIndex];

      const productIndex = products.findIndex(p => p.id === txToRemove.productId);
      
      if (productIndex >= 0) {
        const product = { ...products[productIndex] };
        const change = txToRemove.type === 'IN' ? -txToRemove.quantity : txToRemove.quantity;
        product.currentStock = product.currentStock + change;
        products[productIndex] = product;
      }

      const newTransactions = transactions.filter(t => t.id !== id);

      return { ...prev, products, transactions: newTransactions };
    });
  };

  const handleUpdateTransaction = (updatedTx: Transaction) => {
    setData(prev => {
      const transactions = [...(prev.transactions || [])];
      const txIndex = transactions.findIndex(t => t.id === updatedTx.id);
      
      if (txIndex === -1) return prev;
      const oldTx = transactions[txIndex];

      const qtyDifference = updatedTx.quantity - oldTx.quantity;

      const products = [...(prev.products || [])];
      const productIndex = products.findIndex(p => p.id === updatedTx.productId);

      if (productIndex >= 0) {
        const product = { ...products[productIndex] };
        const stockAdjustment = updatedTx.type === 'IN' ? qtyDifference : -qtyDifference;
        product.currentStock = product.currentStock + stockAdjustment;
        products[productIndex] = product;
      }

      transactions[txIndex] = updatedTx;

      return { ...prev, products, transactions };
    });
  };

  const handleSavePrescription = (prescription: Prescription) => {
    setData(prev => {
      const prescriptions = [...(prev.prescriptions || [])];
      const index = prescriptions.findIndex(p => p.id === prescription.id);
      
      if (index >= 0) {
        prescriptions[index] = prescription;
      } else {
        prescriptions.push({ ...prescription, id: prescription.id || generateSafeId() });
      }
      return { ...prev, prescriptions };
    });
  };

  const handleDeletePrescription = (id: string) => {
    setData(prev => ({ ...prev, prescriptions: (prev.prescriptions || []).filter(p => p.id !== id) }));
  };

  const handleSaveAppointment = (appointment: MedicalAppointment) => {
    setData(prev => {
      const appointments = [...(prev.medicalAppointments || [])];
      const index = appointments.findIndex(a => a.id === appointment.id);
      
      if (index >= 0) {
        appointments[index] = appointment;
      } else {
        appointments.push({ ...appointment, id: appointment.id || generateSafeId() });
      }
      return { ...prev, medicalAppointments: appointments };
    });
  };

  const handleDeleteAppointment = (id: string) => {
    setData(prev => ({ ...prev, medicalAppointments: (prev.medicalAppointments || []).filter(a => a.id !== id) }));
  };

  const handleSaveDemand = (demand: Demand) => {
    setData(prev => {
      const demands = [...(prev.demands || [])];
      const index = demands.findIndex(d => d.id === demand.id);
      
      if (index >= 0) {
        demands[index] = demand;
      } else {
        demands.push({ ...demand, id: demand.id || generateSafeId() });
      }
      return { ...prev, demands };
    });
  };

  const handleDeleteDemand = (id: string) => {
    setData(prev => ({ ...prev, demands: (prev.demands || []).filter(d => d.id !== id) }));
  };

  const handleSaveProfessional = (professional: Professional) => {
    setData(prev => {
      const professionals = [...(prev.professionals || [])];
      const index = professionals.findIndex(p => p.id === professional.id);
      
      if (index >= 0) {
        professionals[index] = professional;
      } else {
        professionals.push({ ...professional, id: professional.id || generateSafeId() });
      }
      return { ...prev, professionals };
    });
  };

  const handleDeleteProfessional = (id: string) => {
    setData(prev => ({ ...prev, professionals: (prev.professionals || []).filter(p => p.id !== id) }));
  };

  const handleSaveEmployee = (employee: Employee) => {
    setData(prev => {
      const employees = [...(prev.employees || [])];
      const index = employees.findIndex(e => e.id === employee.id);
      if (index >= 0) {
        employees[index] = employee;
      } else {
        employees.push({ ...employee, id: employee.id || generateSafeId() });
      }
      return { ...prev, employees };
    });
  };

  const handleDeleteEmployee = (id: string) => {
    setData(prev => ({ ...prev, employees: (prev.employees || []).filter(e => e.id !== id) }));
  };

  const handleSaveRoles = (roles: string[]) => {
    setData(prev => ({ ...prev, employeeRoles: roles }));
  };

  const handleSaveTimeSheet = (entry: TimeSheetEntry) => {
    setData(prev => {
      const timeSheets = [...(prev.timeSheets || [])];
      const exists = timeSheets.findIndex(ts => ts.date === entry.date && ts.employeeId === entry.employeeId);
      if (exists === -1) {
        timeSheets.push(entry);
      }
      return { ...prev, timeSheets };
    });
  };

  const handleDeleteTimeSheet = (date: string, employeeId: string) => {
    setData(prev => ({
      ...prev,
      timeSheets: (prev.timeSheets || []).filter(ts => !(ts.date === date && ts.employeeId === employeeId))
    }));
  };

  const handleSaveTechnicalSession = (session: TechnicalSession) => {
    setData(prev => {
      const sessions = [...(prev.technicalSessions || [])];
      const index = sessions.findIndex(s => s.id === session.id);
      if (index >= 0) {
        sessions[index] = session;
      } else {
        sessions.push({ ...session, id: session.id || generateSafeId() });
      }
      return { ...prev, technicalSessions: sessions };
    });
  };

  const handleDeleteTechnicalSession = (id: string) => {
    setData(prev => ({ ...prev, technicalSessions: (prev.technicalSessions || []).filter(s => s.id !== id) }));
  };

  // --- EVOLUÇÕES HANDLERS ---
  const handleSaveEvolution = (records: EvolutionRecord[]) => {
    setData(prev => {
      const newEvolutions = [...(prev.evolutions || [])];
      records.forEach(record => {
         // Remover registro anterior se existir (para o mesmo dia/residente/role) para evitar duplicação no upload de PDF
         // Se for mensal, remove a do mês.
         const idx = newEvolutions.findIndex(e => 
           e.residentId === record.residentId && 
           e.role === record.role && 
           (record.type === 'DIARIA' ? e.date === record.date : e.date.substring(0,7) === record.date.substring(0,7))
         );
         
         if (idx >= 0) {
            newEvolutions[idx] = record;
         } else {
            newEvolutions.push(record);
         }
      });
      return { ...prev, evolutions: newEvolutions };
    });
  };

  const handleDeleteEvolution = (id: string) => {
    setData(prev => ({ ...prev, evolutions: (prev.evolutions || []).filter(e => e.id !== id) }));
  };

  // --- HOUSE DOCUMENTS HANDLERS ---
  const handleSaveHouseDocument = (doc: HouseDocument) => {
    setData(prev => {
      const houseDocuments = [...(prev.houseDocuments || [])];
      const index = houseDocuments.findIndex(d => d.id === doc.id);
      if (index >= 0) {
        houseDocuments[index] = doc;
      } else {
        houseDocuments.push({ ...doc, id: doc.id || generateSafeId() });
      }
      return { ...prev, houseDocuments };
    });
  };

  const handleDeleteHouseDocument = (id: string) => {
    setData(prev => ({ ...prev, houseDocuments: (prev.houseDocuments || []).filter(d => d.id !== id) }));
  };
  // -------------------------

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = event.target?.result as string;
        const json = JSON.parse(jsonContent);

        if (Array.isArray(json.residents) && Array.isArray(json.products)) {
          if(window.confirm("ATENÇÃO: Restaurar este backup substituirá COMPLETAMENTE os dados atuais.\n\nEssa ação não pode ser desfeita. Deseja continuar?")) {
             localStorage.removeItem('careflow_db_v1');
             localStorage.removeItem('careflow_db_snapshot');
             
             json.prescriptions = json.prescriptions || [];
             json.medicalAppointments = json.medicalAppointments || [];
             json.demands = json.demands || [];
             json.professionals = json.professionals || [];
             json.employees = json.employees || [];
             json.employeeRoles = json.employeeRoles || [];
             json.timeSheets = json.timeSheets || [];
             json.technicalSessions = json.technicalSessions || []; 
             json.evolutions = json.evolutions || []; // Restore evolutions
             json.houseDocuments = json.houseDocuments || []; // Restore house docs
             
             localStorage.setItem('careflow_db_v1', JSON.stringify(json));
             
             alert("Backup restaurado com sucesso! O sistema será reiniciado.");
             window.location.reload();
          }
        } else {
          alert("Arquivo inválido. A estrutura do arquivo não corresponde a um backup do LifeCare.");
        }
      } catch (err) {
        console.error(err);
        alert("Erro ao ler o arquivo. Verifique se é um JSON válido.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleFactoryReset = () => {
    const confirmText = prompt("PERIGO: Isso apagará TODOS os dados cadastrados (residentes, estoque, histórico) e restaurará o estado inicial do aplicativo.\n\nDigite 'RESETAR' para confirmar:");
    if (confirmText === 'RESETAR') {
      localStorage.removeItem('careflow_db_v1');
      localStorage.removeItem('careflow_db_snapshot');
      alert("Sistema restaurado para o padrão de fábrica.");
      window.location.reload();
    }
  };

  const handleSelectBackupFolder = async () => {
    if (!('showDirectoryPicker' in window)) {
      alert("Seu navegador não suporta a funcionalidade de acesso a pastas locais. Tente usar Chrome ou Edge no computador.");
      return;
    }
    try {
      // @ts-ignore
      const handle = await window.showDirectoryPicker();
      if (handle) {
        setBackupHandle(handle);
        // Tenta escrever imediatamente para testar/criar
        // @ts-ignore
        const fileHandle = await handle.getFileHandle('lifecare_auto_backup.json', { create: true });
        // @ts-ignore
        const writable = await fileHandle.createWritable();
        await writable.write(JSON.stringify(data, null, 2));
        await writable.close();
        
        setBackupStatus('SUCCESS');
        setLastBackupTime(new Date().toLocaleTimeString('pt-BR'));
        alert("Pasta vinculada com sucesso! O arquivo 'lifecare_auto_backup.json' será mantido atualizado automaticamente nesta pasta.");
      }
    } catch (err: any) {
      console.error("Erro ao selecionar pasta:", err);
      if (err.name === 'SecurityError' || err.message?.includes('Cross origin sub frames') || err.code === 18) {
        alert("AMBIENTE RESTRITO: O navegador bloqueou o acesso à pasta local.\n\nSe você está usando uma prévia/iframe, o backup local não funcionará. Utilize o 'Backup Manual'.");
      } else if (err.name !== 'AbortError') {
        alert("Não foi possível vincular a pasta.");
      }
    }
  };

  const handleForceBackup = async () => {
    if (!backupHandle) {
        alert("Você precisa vincular uma pasta primeiro.");
        return;
    }
    setBackupStatus('SAVING');
    try {
      // @ts-ignore
      const fileHandle = await backupHandle.getFileHandle('lifecare_auto_backup.json', { create: true });
      // @ts-ignore
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      setBackupStatus('SUCCESS');
      setLastBackupTime(new Date().toLocaleTimeString('pt-BR'));
    } catch (e) {
      console.error("Erro ao forçar backup:", e);
      setBackupStatus('ERROR');
      alert("Erro ao salvar o arquivo. Verifique as permissões da pasta.");
    }
  };

  // --- MANDATORY INIT & RESTORE LOGIC ---
  const handleInitialSync = async () => {
    if (!('showDirectoryPicker' in window)) {
      alert("Seu navegador não suporta a funcionalidade de acesso a pastas locais. Por favor, utilize Google Chrome, Edge ou Opera em um computador.");
      return;
    }

    setInitLoading(true);
    try {
      // @ts-ignore
      const handle = await window.showDirectoryPicker();
      if (!handle) {
        setInitLoading(false);
        return;
      }

      setBackupHandle(handle);

      // Tenta ler o arquivo de backup existente
      try {
        // @ts-ignore
        const fileHandle = await handle.getFileHandle('lifecare_auto_backup.json');
        // @ts-ignore
        const file = await fileHandle.getFile();
        const text = await file.text();
        const json = JSON.parse(text);

        // Se conseguiu ler e é um JSON válido
        if (json && Array.isArray(json.residents)) {
           // RESTAURAR DADOS
           setData(json);
           saveData(json); // Sync with localStorage immediately
           alert("Backup encontrado e restaurado com sucesso! Seus dados estão atualizados.");
        } else {
           throw new Error("Arquivo inválido");
        }

      } catch (err) {
        // Arquivo não existe ou inválido: Criar novo com os dados atuais (LocalStorage ou Initial)
        console.log("Nenhum backup válido encontrado. Criando novo arquivo...");
        try {
           // @ts-ignore
           const fileHandle = await handle.getFileHandle('lifecare_auto_backup.json', { create: true });
           // @ts-ignore
           const writable = await fileHandle.createWritable();
           await writable.write(JSON.stringify(data, null, 2));
           await writable.close();
           alert("Pasta vinculada! Um novo arquivo de backup foi criado com os dados atuais.");
        } catch (writeErr) {
           console.error("Erro ao criar arquivo:", writeErr);
           alert("Erro ao criar arquivo de backup na pasta selecionada. Verifique as permissões.");
           setInitLoading(false);
           return; 
        }
      }

      setBackupStatus('SUCCESS');
      setLastBackupTime(new Date().toLocaleTimeString('pt-BR'));
      setIsBackupInitialized(true); // UNBLOCK APP

    } catch (e: any) {
      console.error("Erro na inicialização:", e);
      // Improved error detection for iframes/security blocks
      if (e.name === 'SecurityError' || e.message?.includes('Cross origin sub frames') || e.code === 18) {
         alert("AMBIENTE RESTRITO DETECTADO:\n\nO navegador bloqueou o acesso à pasta local (erro de segurança em iframe).\n\nPara continuar testando, utilize a opção 'Continuar sem Backup Externo'.");
      } else if (e.name !== 'AbortError') {
         alert("Não foi possível acessar a pasta. Tente novamente.");
      }
    }
    setInitLoading(false);
  };

  const handleSkipBackup = () => {
    setShowSkipConfirmation(true);
  };

  const confirmSkipBackup = () => {
    setIsBackupInitialized(true);
    setBackupStatus('IDLE');
    setShowSkipConfirmation(false);
  };

  const cancelSkipBackup = () => {
    setShowSkipConfirmation(false);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <Dashboard data={data} onNavigate={setView} />;
      case 'evolutions':
        return (
          <Evolutions
            data={data}
            onSaveEvolution={handleSaveEvolution}
            onDeleteEvolution={handleDeleteEvolution}
          />
        );
      case 'residents':
        return (
          <Residents 
            data={data} 
            onSave={handleSaveResident} 
            onDelete={handleDeleteResident}
            onDeleteTransaction={handleDeleteTransaction} 
            onUpdateTransaction={handleUpdateTransaction} 
            onSaveDemand={handleSaveDemand}
          />
        );
      case 'employees':
        return (
          <Employees 
            data={data}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onSaveRoles={handleSaveRoles}
            onSaveTimeSheet={handleSaveTimeSheet}
            onDeleteTimeSheet={handleDeleteTimeSheet}
          />
        );
      case 'admin-panel':
        return (
          <AdminPanel
            data={data}
            onUpdateEmployee={handleSaveEmployee}
            onUpdateProfessional={handleSaveProfessional}
            onSaveHouseDocument={handleSaveHouseDocument}
            onDeleteHouseDocument={handleDeleteHouseDocument}
            onSaveDemand={handleSaveDemand} 
          />
        );
      case 'medications':
        return (
          <Medications 
            data={data} 
            onSave={handleSaveProduct} 
            onDelete={handleDeleteProduct} 
            onTransaction={handleTransaction}
            onSavePrescription={handleSavePrescription}
            onDeletePrescription={handleDeletePrescription}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateTransaction={handleUpdateTransaction} 
          />
        );
      case 'medical-care':
        return (
          <MedicalCare 
            data={data}
            onSave={handleSaveAppointment}
            onDelete={handleDeleteAppointment}
          />
        );
      case 'technical-care':
        return (
          <TechnicalCare 
            data={data}
            onSaveSession={handleSaveTechnicalSession}
            onDeleteSession={handleDeleteTechnicalSession}
          />
        );
      case 'demands':
        return (
          <Demands
            data={data}
            onSave={handleSaveDemand}
            onDelete={handleDeleteDemand}
            onSaveProfessional={handleSaveProfessional}
            onDeleteProfessional={handleDeleteProfessional}
          />
        );
      case 'inventory':
        return <Inventory data={data} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />;
      case 'operations':
        return (
          <StockOperations 
             data={data} 
             onTransaction={handleTransaction}
             onDeleteTransaction={handleDeleteTransaction}
             onUpdateTransaction={handleUpdateTransaction}
          />
        );
      case 'personal-items':
        return (
          <PersonalItems
             data={data}
             onTransaction={handleTransaction}
          />
        );
      case 'reports':
        return <Reports data={data} onTransaction={handleTransaction} />;
      case 'settings':
        return (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Database /> Configurações de Dados
            </h2>
            <div className="space-y-6">
              
              {/* STATUS DO BACKUP ATIVO */}
              {backupHandle ? (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                   <h3 className="font-bold text-green-800 flex items-center gap-2 mb-2">
                      <ShieldCheck size={20} /> Backup Automático Ativo
                   </h3>
                   <p className="text-sm text-green-700 mb-2">
                      A pasta local está vinculada. Todas as alterações são salvas automaticamente no arquivo <strong>lifecare_auto_backup.json</strong>.
                   </p>
                   <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-white p-2 rounded border border-green-100 w-fit">
                      {backupStatus === 'SAVING' ? <Loader2 size={12} className="animate-spin"/> : <CheckCircle2 size={12}/>}
                      Status: {backupStatus === 'SAVING' ? 'Salvando...' : `Sincronizado (${lastBackupTime || 'Agora'})`}
                   </div>
                   <div className="mt-4">
                      <button 
                        onClick={handleForceBackup}
                        className="text-xs bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 shadow-sm flex items-center gap-1 font-bold"
                      >
                         <Save size={14} /> Forçar Salvamento Agora
                      </button>
                   </div>
                </div>
              ) : (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                   <h3 className="font-bold text-orange-800 flex items-center gap-2 mb-2">
                      <AlertTriangle size={20} /> Backup Automático Inativo
                   </h3>
                   <p className="text-sm text-orange-700 mb-4">
                      Você está usando o modo local. Se limpar o navegador, perderá os dados. Conecte uma pasta para maior segurança.
                   </p>
                   <button 
                      onClick={handleInitialSync}
                      className="text-sm bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 shadow-sm flex items-center gap-2 font-bold"
                   >
                      <Folder size={16} /> Conectar Pasta de Backup Agora
                   </button>
                </div>
              )}

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">Backup Manual (Cópia Extra)</h3>
                <p className="text-sm text-blue-600 mb-4">Baixe uma cópia adicional dos dados para enviar por e-mail ou guardar em outro local.</p>
                <button 
                  onClick={() => exportData(data)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full justify-center md:w-auto font-bold"
                >
                  <Download size={18} /> Baixar Cópia Extra
                </button>
              </div>

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
                <h3 className="font-bold text-amber-800 mb-2">Restaurar de Arquivo Externo</h3>
                <p className="text-sm text-amber-600 mb-4">Importe um arquivo de backup antigo (substituirá os dados atuais).</p>
                <label className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 w-full justify-center md:w-auto cursor-pointer shadow-sm font-bold">
                  <Upload size={18} /> 
                  Selecionar Arquivo
                  <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                </label>
              </div>

              <div className="p-4 bg-red-50 rounded-lg border border-red-100 mt-8">
                <h3 className="font-bold text-red-800 mb-2 flex items-center gap-2"><Trash2 size={18}/> Zona de Perigo</h3>
                <p className="text-sm text-red-600 mb-4">Caso o sistema apresente erros graves, você pode resetar tudo.</p>
                <button 
                  onClick={handleFactoryReset}
                  className="flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 w-full justify-center md:w-auto text-sm font-bold"
                >
                  <RefreshCw size={16} /> Resetar para Padrão de Fábrica
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <div>Página não encontrada</div>;
    }
  };

  // --- FORCE BACKUP SELECTION SCREEN ---
  if (!isBackupInitialized) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-50 flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 text-center animate-in zoom-in-95 duration-300 overflow-y-auto max-h-screen">
            {showSkipConfirmation ? (
              <div className="space-y-4 animate-in fade-in">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertTriangle size={40} className="text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-800">Tem certeza?</h2>
                  <p className="text-sm text-slate-600">
                      Sem o backup em pasta, seus dados ficarão salvos <strong>apenas no cache deste navegador</strong>.
                  </p>
                  <p className="text-xs text-red-500 font-bold bg-red-50 p-3 rounded-lg border border-red-100">
                      Se limpar o histórico/cache ou trocar de dispositivo, você perderá tudo permanentemente.
                  </p>
                  <div className="flex gap-3 pt-2">
                      <button onClick={cancelSkipBackup} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200">Voltar</button>
                      <button onClick={confirmSkipBackup} className="flex-1 py-3 bg-orange-600 text-white rounded-xl font-bold shadow-lg hover:bg-orange-700">Entendi, Continuar</button>
                  </div>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck size={40} className="text-blue-600" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Segurança de Dados</h1>
                <p className="text-slate-500 mb-6">
                  Para garantir a segurança, recomendamos salvar os dados automaticamente em uma pasta do seu computador.
                </p>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-left mb-6">
                  <h3 className="font-bold text-amber-800 text-sm mb-2 flex items-center gap-2">
                      <HardDrive size={16}/> Opção Recomendada:
                  </h3>
                  <ul className="text-sm text-amber-700 list-disc list-inside space-y-1">
                      <li>Os dados são salvos em tempo real no seu PC.</li>
                      <li>Se já houver backup, os dados são restaurados.</li>
                      <li>Proteção contra limpeza de cache do navegador.</li>
                  </ul>
                </div>

                <button 
                  onClick={handleInitialSync}
                  disabled={initLoading}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mb-4"
                >
                  {initLoading ? <Loader2 className="animate-spin" /> : <Folder size={24} />}
                  {initLoading ? 'Verificando Pasta...' : 'Selecionar Pasta de Backup'}
                </button>
                
                <button 
                  onClick={handleSkipBackup}
                  className="w-full py-3 bg-white text-slate-500 border border-slate-200 rounded-xl font-medium text-sm hover:bg-slate-50 hover:text-slate-700 flex items-center justify-center gap-2 transition-colors"
                >
                  Continuar sem Backup Externo (Modo Local) <ArrowRight size={14}/>
                </button>

                <p className="text-xs text-slate-400 mt-4">
                  Acesso à pasta local é seguro e restrito apenas a este navegador.
                </p>
              </>
            )}
         </div>
      </div>
    );
  }

  return (
    <Layout currentView={view} onNavigate={setView}>
      {renderContent()}
    </Layout>
  );
};

export default App;