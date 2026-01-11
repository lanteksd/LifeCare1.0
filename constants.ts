





import { DiaperSize, ProfessionalArea } from "./types";

export const DIAPER_SIZES: DiaperSize[] = ['P', 'M', 'G', 'EG', 'XXG'];

export const PRODUCT_CATEGORIES = [
  'Incontinência Urinária e Fecal',
  'Higiene Pessoal',
  'Cuidados com a Pele',
  'Medicamentos e Cuidados Clínicos',
  'Alimentação Especial',
  'Conforto e Mobilidade',
  'Cuidados Orais e Odontológicos',
  'Outros Itens de Rotina'
];

export const UNITS = [
  'Unidade',
  'Pacote',
  'Caixa',
  'Frasco',
  'Tubo',
  'Lata',
  'Par',
  'Litro',
  'Kit',
  'Rolo'
];

export const MEDICAL_SPECIALTIES = [
  'Clínico Geral',
  'Geriatra',
  'Cardiologista',
  'Neurologista',
  'Psiquiatra',
  'Dermatologista',
  'Ortopedista',
  'Urologista',
  'Oftalmologista',
  'Fisioterapeuta',
  'Nutricionista',
  'Fonoaudiólogo',
  'Dentista',
  'Outro'
];

export const PROFESSIONAL_AREAS: ProfessionalArea[] = [
  'PSICOLOGIA',
  'PEDAGOGIA',
  'ASSISTENTE_SOCIAL',
  'NUTRICIONISTA',
  'FISIOTERAPIA',
  'ENFERMAGEM'
];

export const INITIAL_EMPLOYEE_ROLES = [
  'CUIDADOR(A)',
  'COZINHEIRO(A)',
  'MANUTENÇÃO',
  'LIMPEZA',
  'TEC ENFERMAGEM',
  'ENFERMEIRA'
];

// Helper to generate IDs for meds
const createMed = (name: string) => ({
  id: `med_${name.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
  name: name,
  category: 'Medicamentos e Cuidados Clínicos',
  currentStock: 0,
  minStock: 10,
  unit: 'Unidade' // Padronizado conforme solicitado
});

const NEW_MEDICATIONS = [
  'AAS 100mg', 'ACETILCISTEINA 600mg', 'ACIDO VALPROICO 250mg', 'ADDERA 5000UI', 'ADDERA D3 1000ui',
  'AKINETON (BIPERIDENO) 2mg', 'ALPRAZOLAM 1mg', 'AMANTADINA 100mg', 'AMISSULPRIDA 5mg', 'AMITRIPITILINA 25mg',
  'ANLODIPINO 10mg', 'ANLODIPINO 2,5mg', 'ANLODIPINO 5mg', 'APROSOLAN 2mg', 'ATENOLOL 25mg',
  'ATENOLOL 50mg', 'BISOPROLOL 1,25mg', 'BROMOPIDA 100mg', 'BUPROPIONA XL 150mg', 'CALCIODEX 625mg',
  'CANABIDIOL 23,5', 'CANABIDIOL 23,75mg', 'CAPTOPRIL 25mg', 'CARBAMAZEPINA 200mg', 'CARBAMAZEPINA 400mg',
  'CARBONATO DE LITIO 300mg', 'CARVEDILOL 3,125mg', 'CILOSTAZOL 50mg', 'CITALOPRAM 20mg', 'CLONAZEPAM 2,5mg',
  'CLONAZEPAM 2mg', 'CLOPIDOGREL 75mg', 'CLOREXIDINA 45ml', 'CLORPROMAZINA 25mg', 'CLORTALIDONA 25mg',
  'CLOZAPINA 100mg', 'COMBODART 0,4 mg', 'DEPAKENE 250mg', 'DIAZEPAM 10mg', 'DIVALPROATO DE SÓDIO ER 500mg',
  'DOMPERIDONA 10mg', 'DONEPEZILA 10mg', 'DONEPEZILA 5mg', 'DONILA 10mg', 'DOXAZOSINA + FINASTERIDA 5mg + 2mg',
  'ENALAPRIL 10mg', 'ESCITALOPRAM 20mg', 'ESPIRONOLACTONA 25mg', 'FENOBARBITAL 100mg', 'FERNEGAN 25mg',
  'FINASTERIDA 5mg', 'FLUNARIZINA 6mg', 'FLUOXETINA 20mg', 'FLUXON 25mg', 'FUROSEMIDA 40mg',
  'GARDENAL 100mg', 'GINKGO BILOBA 80mg', 'GLIBENCLAMIDA 5mg', 'GLICAZIDA 30mg', 'GLIFAGE 500mg',
  'GLIFAGE XR 500mg', 'HALDOL 5mg', 'HALOPERIDOL 5mg', 'HIDROCLOROTIAZIDA 25mg', 'INDAPAMIDA 1.5mg',
  'INSULINA 100ml', 'INSULINA HPN', 'KILLIDON 2mg', 'LACTULOSE 667mg', 'LEVOFLOXACINO 750mg',
  'LEVOMEPROMAZINE 25mg', 'LEVOTIROXINA 100mg', 'LEVOTIROXINA 25mg', 'LEVOZINE 100mg', 'LEVOZINE 25mg',
  'LORATADINA 10mg', 'LOSARTANA 50mg', 'LUBRIS COLIRIO', 'MEMANTINA 10mg', 'MEMANTINA 50mg',
  'MEMANTINA MANIPULADO 10mg', 'METFORMINA 500mg', 'METFORMINA 850mg', 'MIRTAZAPINA 15mg', 'MIRTAZAPINA 30mg',
  'NÃO FAZ USO DE MEDICAMENTOS', 'NEOZINE 100mg', 'NEOZINE 4%mg', 'NEULEPTIL 10mg', 'NIFEDIPINO 20mg',
  'OLANZAPINA 10mg', 'OLANZAPina 5mg', 'OMEPRAZOL 20mg', 'OMEPRAZOL 40mg', 'ORA PRO-NOBIS 500mg',
  'OXIBUTIAZIDA 25mg', 'PANTOPRAZOL 20mg', 'PANTOPRAZOL 40mg', 'PERMUT', 'PREGABALINA 75mg',
  'PROFERGAN 25mg', 'PROMETAZINA 25mg', 'PURAM 25mg', 'QUETIAPINA 100mg', 'QUETIAPINA 25mg',
  'QUETIAPina 50mg', 'RISPERIDONA 1mg', 'RISPERIDONA 2mg', 'RIVAROXABANA 20mg', 'RIVOTRIL 2mg',
  'SALICETIL 100mg', 'SERTRALINA 50mg', 'SINVASTATINA 20mg', 'SINVASTATINA 40mg', 'SOSSEG 260mg',
  'SULFATO FERROSO 300mg', 'SULFATO FERROSO 40mg', 'TIAMINA 300mg', 'TRAZADONA 100mg', 'TRAZADONA 50mg',
  'VENODOPA + BENSERAZIDA 100/25mg', 'VENOLOT - 15/90mg', 'VICOG 5mg', 'VITAMINA B1 300mg', 'VITAMINA B12 50mg',
  'VITAMINA B2 50mg', 'VITAMINA B6 50mg', 'ZOLPIDEM 10mg'
].map(createMed);

// Helper for residents
const createResident = (id: string, name: string, cpf: string, birthDate: string, admissionDate: string, sex: string) => ({
  id: `res_${id}`,
  name: name,
  cpf: cpf,
  birthDate: birthDate.split('/').reverse().join('-'), // Convert DD/MM/YYYY to YYYY-MM-DD
  admissionDate: admissionDate.split('/').reverse().join('-'),
  room: 'A definir',
  dailyExchangeEstimate: 5, // PADRÃO ALTERADO PARA 5
  absorbentDailyExchangeEstimate: 0, // Novo padrão para absorventes
  active: true,
  observations: `Sexo: ${sex}. RG incluído na ficha física.`,
  responsible: { name: '', relation: '', phone1: '', phone2: '', email: '' },
  documents: []
});

const residentsList = [
  createResident('1', 'ADIMAR ALVES', '060.141.557-40', '13/04/1951', '15/01/2024', 'M'),
  createResident('2', 'ALUIZIO AQUINO DA SILVA', '607.937.327-00', '11/10/1948', '08/03/2025', 'M'),
  createResident('3', 'ANA MARIA FERNANDES LIMA', '318.962.000-87', '15/05/1956', '03/09/2022', 'F'),
  createResident('4', 'ANGELA MARIA DE AZEVEDO GONÇALVES', '648.264.907-63', '13/12/1959', '17/06/2025', 'F'),
  createResident('5', 'CARLOS ALBERTO ABADE', '065.648.107-25', '28/05/1945', '11/03/2025', 'M'),
  createResident('6', 'CARLOS HENRIQUE DO NASCIMENTO', '022.098.017-96', '21/11/1973', '14/10/2025', 'M'),
  createResident('7', 'CARMEN FERNANDES FRANCO GOMES', '896.974.217-49', '07/03/1950', '28/12/2024', 'F'),
  createResident('8', 'CLESEO BARANDA FILHO', '372.025.027-04', '01/01/1956', '15/06/2025', 'M'),
  createResident('9', 'DAMIÃO DE CARVALHO', '469.989.697-91', '29/01/1953', '14/01/2025', 'M'),
  createResident('10', 'DANIEL DA SILVA', '692.582.607-71', '26/05/1960', '05/11/2025', 'M'),
  createResident('11', 'EPHIGENIA SILVA BONFIM', '103.397.937-67', '16/12/1936', '17/03/2025', 'F'),
  createResident('12', 'FERNANDO MARIANO DA SILVA', '124.713.107-61', '24/12/1990', '06/12/2023', 'M'),
  createResident('13', 'GERALDO ROSA DE SOUZA', '415.702.787-68', '10/06/1948', '27/12/2024', 'M'),
  createResident('14', 'GISELDA DALFIOR DE OLIVEIRA', '051.435.107-16', '12/01/1957', '08/04/2023', 'F'),
  createResident('15', 'HELENICE VITORIANO DA SILVA', '855.284.807-44', '12/12/1941', '23/11/2022', 'F'),
  createResident('16', 'JAIRO MARQUES DA SILVA', '265.346.497-72', '15/02/1948', '30/12/2023', 'M'),
  createResident('17', 'JOSE EVERALDO DO NASCIMENTO', '549.084.697-68', '03/03/1945', '19/09/2025', 'M'),
  createResident('18', 'JOSE MANOEL DOS SANTOS', '607.204.177-91', '19/03/1948', '16/10/2025', 'M'),
  createResident('19', 'JOSÉ MARQUES DIAS', '205.797.057-49', '22/07/1945', '07/12/2022', 'M'),
  createResident('20', 'JOSÉ OSMAR MESQUITA TERCEIRO', '384.823.637-00', '15/02/1950', '16/03/2024', 'M'),
  createResident('21', 'JUARES PASSOS', '670.513.597-20', '30/09/1961', '18/08/2025', 'M'),
  createResident('22', 'LAERCIO LUIZ DOS SANTOS', '543.931.757-00', '12/12/1953', '10/09/2024', 'M'),
  createResident('23', 'LUIZ CARLOS CARDOSO', '656.371.947-34', '17/11/1954', '16/01/2025', 'M'),
  createResident('24', 'MANOEL FERREIRA DAMASCENO', '075.538.407-50', '02/12/1942', '12/08/2025', 'M'),
  createResident('25', 'MARIA DE LOURDES COSTA RUSSO', '102.663.667-16', '19/05/1939', '01/06/2024', 'F'),
  createResident('26', 'MARIA DO CARMO DE OLIVEIRA', '131.194.267-09', '21/09/1938', '13/08/2018', 'F'),
  createResident('27', 'MARIA ENIR DA SILVA MACHADO', '756.149.527-72', '01/09/1933', '06/01/2025', 'F'),
  createResident('28', 'MARIA HELENA DE MENEZES BOMFIM', '857.931.327-91', '28/07/1938', '21/02/2025', 'F'),
  createResident('29', 'MARIA ROSA DE AZEVEDO', '377.162.987-04', '06/05/1928', '10/07/2023', 'F'),
  createResident('30', 'MARLENE RAINHA SOARES DA CUNHA', '879.848.147-91', '14/02/1946', '12/04/2022', 'F'),
  createResident('31', 'MARLUCE ALBUQUERQUE DE ARAUJO', '465.904.557-91', '04/06/1950', '29/08/2025', 'F'),
  createResident('32', 'MARTA BEATRIZ SANTOS', '491.939.297-49', '31/10/1956', '11/03/2023', 'F'),
  createResident('33', 'NADIR RODRIGUES SILVA LIMA', '705.940.407-44', '30/10/1952', '28/05/2025', 'F'),
  createResident('34', 'NEUSA JOSE DE OLIVEIRA DOS SANTOS', '635.438.187-91', '02/02/1956', '07/09/2025', 'F'),
  createResident('35', 'PAULO EVANGELISTA DE ARAUJO', '403.149.367-34', '25/07/1944', '11/08/2021', 'M'),
  createResident('36', 'PEDRO RAMOS DA SILVA', '913.683.087-91', '06/01/1964', '26/06/2025', 'M'),
  createResident('37', 'REGINA LUCIA DOS SANTOS RAMOS', '883.597.277-91', '24/06/1942', '23/07/2025', 'F'),
  createResident('38', 'ROSA MARIA JESUS DA SILVA', '602.609.477-68', '31/08/1959', '01/03/2024', 'F'),
  createResident('39', 'SELMA ANTUNES DE SOUZA', '402.180.667-91', '05/10/1948', '02/09/2015', 'F'),
  createResident('40', 'SERGIO CARLOS CARVALHO DOS SANTOS', '831.118.677-49', '14/04/1965', '02/01/2025', 'M'),
  createResident('41', 'SEVERINA MENDES DA SILVA', '748.831.867-68', '23/10/1947', '07/10/2024', 'F'),
  createResident('42', 'SILVIA MARTINS NAZARETH', '760.649.137-20', '28/12/1962', '25/05/2025', 'F'),
  createResident('43', 'VANDERLEI ASSIS DO NASCIMENTO', '348.950.787-87', '06/12/1952', '30/11/2019', 'M'),
  createResident('44', 'VERA LÚCIA DA SILVA', '851.594.257-72', '12/01/1964', '05/11/2024', 'F')
].sort((a, b) => a.name.localeCompare(b.name));

export const INITIAL_DATA = {
  residents: residentsList,
  prescriptions: [],
  medicalAppointments: [],
  demands: [],
  professionals: [],
  employees: [], // Novo
  employeeRoles: INITIAL_EMPLOYEE_ROLES, // Novo
  timeSheets: [], // Novo
  products: [
    // 1. Incontinência Urinária e Fecal
    { id: 'p1', name: 'Fralda Geriátrica P', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p2', name: 'Fralda Geriátrica M', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p3', name: 'Fralda Geriátrica G', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p4', name: 'Fralda Geriátrica EG', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p5', name: 'Fralda Geriátrica XXG', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p6', name: 'Fralda Tipo Pants (Puxa)', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 10, unit: 'Pacote' },
    { id: 'p7', name: 'Absorvente Geriátrico Moderado', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 15, unit: 'Pacote' },
    { id: 'p8', name: 'Absorvente Geriátrico Intenso', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 15, unit: 'Pacote' },
    { id: 'p9', name: 'Absorvente Geriátrico Noturno', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 15, unit: 'Pacote' },
    { id: 'p10', name: 'Coletor Urinário Masc. (Pato)', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 2, unit: 'Unidade' },
    { id: 'p11', name: 'Bolsa Coletora', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 5, unit: 'Unidade' },
    { id: 'p12', name: 'Protetor de Cama Descartável', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 10, unit: 'Pacote' },
    { id: 'p13', name: 'Protetor de Colchão Reutilizável', category: 'Incontinência Urinária e Fecal', currentStock: 0, minStock: 5, unit: 'Unidade' },

    // 2. Higiene Pessoal
    { id: 'p20', name: 'Lenço Umedecido c/ Aloe Vera', category: 'Higiene Pessoal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p21', name: 'Lenço Umedecido s/ Aloe Vera', category: 'Higiene Pessoal', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p22', name: 'Sabonete Líquido Neutro', category: 'Higiene Pessoal', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p23', name: 'Sabonete Líquido Geriátrico', category: 'Higiene Pessoal', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p24', name: 'Shampoo sem Enxágue', category: 'Higiene Pessoal', currentStock: 0, minStock: 3, unit: 'Frasco' },
    { id: 'p25', name: 'Creme Barreira (Óxido de Zinco)', category: 'Higiene Pessoal', currentStock: 0, minStock: 5, unit: 'Tubo' },
    { id: 'p26', name: 'Pomada para Assadura', category: 'Higiene Pessoal', currentStock: 0, minStock: 5, unit: 'Tubo' },
    { id: 'p27', name: 'Talco Líquido', category: 'Higiene Pessoal', currentStock: 0, minStock: 2, unit: 'Frasco' },
    { id: 'p28', name: 'Talco em Pó', category: 'Higiene Pessoal', currentStock: 0, minStock: 2, unit: 'Frasco' },
    { id: 'p29', name: 'Pasta de Dentes para Prótese', category: 'Higiene Pessoal', currentStock: 0, minStock: 3, unit: 'Tubo' },
    { id: 'p30', name: 'Escova de Dentes Elétrica', category: 'Higiene Pessoal', currentStock: 0, minStock: 1, unit: 'Unidade' },
    { id: 'p31', name: 'Escova de Dentes Adaptada', category: 'Higiene Pessoal', currentStock: 0, minStock: 2, unit: 'Unidade' },
    { id: 'p32', name: 'Fio Dental com Cabo', category: 'Higiene Pessoal', currentStock: 0, minStock: 5, unit: 'Caixa' },

    // 3. Cuidados com a Pele
    { id: 'p40', name: 'Hidratante Corporal (Ureia)', category: 'Cuidados com a Pele', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p41', name: 'Hidratante Corporal (Ceramidas)', category: 'Cuidados com a Pele', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p42', name: 'Hidratante Óleo de Amêndoas', category: 'Cuidados com a Pele', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p43', name: 'Loção de Limpeza sem Enxágue', category: 'Cuidados com a Pele', currentStock: 0, minStock: 3, unit: 'Frasco' },
    { id: 'p44', name: 'Óleo de Girassol / AGE', category: 'Cuidados com a Pele', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p45', name: 'Antisséptico (Clorexidina)', category: 'Cuidados com a Pele', currentStock: 0, minStock: 3, unit: 'Frasco' },
    { id: 'p46', name: 'Antisséptico (PVPI Tópico)', category: 'Cuidados com a Pele', currentStock: 0, minStock: 3, unit: 'Frasco' },

    // 4. Medicamentos e Cuidados Clínicos
    { id: 'p50', name: 'Seringas Descartáveis', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 50, unit: 'Unidade' },
    { id: 'p51', name: 'Agulhas Descartáveis', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 50, unit: 'Unidade' },
    { id: 'p52', name: 'Equipos', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 10, unit: 'Unidade' },
    { id: 'p53', name: 'Gaze', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p54', name: 'Esparadrapo', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 5, unit: 'Rolo' },
    { id: 'p55', name: 'Micropore', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 5, unit: 'Rolo' },
    { id: 'p56', name: 'Algodão', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 5, unit: 'Pacote' },
    { id: 'p57', name: 'Álcool 70%', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p58', name: 'Luvas de Procedimento c/ Pó', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 10, unit: 'Caixa' },
    { id: 'p59', name: 'Luvas de Procedimento s/ Pó', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 10, unit: 'Caixa' },
    { id: 'p60', name: 'Máscaras Descartáveis', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 5, unit: 'Caixa' },
    { id: 'p61', name: 'Termômetro Digital', category: 'Medicamentos e Cuidados Clínicos', currentStock: 0, minStock: 2, unit: 'Unidade' },
    // NEW MEDS
    ...NEW_MEDICATIONS,

    // 5. Alimentação Especial
    { id: 'p70', name: 'Espessante para Líquidos', category: 'Alimentação Especial', currentStock: 0, minStock: 3, unit: 'Lata' },
    { id: 'p71', name: 'Suplemento (Ensure/Similar)', category: 'Alimentação Especial', currentStock: 0, minStock: 5, unit: 'Lata' },
    { id: 'p72', name: 'Suplemento (Nutren/Similar)', category: 'Alimentação Especial', currentStock: 0, minStock: 5, unit: 'Lata' },
    { id: 'p73', name: 'Papinha Industrializada', category: 'Alimentação Especial', currentStock: 0, minStock: 5, unit: 'Frasco' },
    { id: 'p74', name: 'Soro Fisiológico', category: 'Alimentação Especial', currentStock: 0, minStock: 5, unit: 'Frasco' },

    // 6. Conforto e Mobilidade
    { id: 'p80', name: 'Travesseiro Antirrefluxo', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 2, unit: 'Unidade' },
    { id: 'p81', name: 'Almofada Anti-escaras (Gel)', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 2, unit: 'Unidade' },
    { id: 'p82', name: 'Almofada Anti-escaras (Ovo)', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 2, unit: 'Unidade' },
    { id: 'p83', name: 'Lençol Hospitalar Descartável', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 5, unit: 'Rolo' },
    { id: 'p84', name: 'Toalha Geriátrica', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 10, unit: 'Unidade' },
    { id: 'p85', name: 'Roupa Descartável (Camiseta)', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 10, unit: 'Unidade' },
    { id: 'p86', name: 'Roupa Descartável (Short)', category: 'Conforto e Mobilidade', currentStock: 0, minStock: 10, unit: 'Unidade' },

    // 7. Cuidados Orais e Odontológicos
    { id: 'p90', name: 'Gel Umidificante Bucal', category: 'Cuidados Orais e Odontológicos', currentStock: 0, minStock: 2, unit: 'Tubo' },
    { id: 'p91', name: 'Solução Limpeza Prótese', category: 'Cuidados Orais e Odontológicos', currentStock: 0, minStock: 2, unit: 'Frasco' },
    { id: 'p92', name: 'Escova Interdental', category: 'Cuidados Orais e Odontológicos', currentStock: 0, minStock: 5, unit: 'Pacote' },

    // 8. Outros Itens de Rotina
    { id: 'p100', name: 'Fita Métrica', category: 'Outros Itens de Rotina', currentStock: 0, minStock: 1, unit: 'Unidade' },
    { id: 'p101', name: 'Saco para Descarte de Fraldas', category: 'Outros Itens de Rotina', currentStock: 0, minStock: 5, unit: 'Rolo' },
    { id: 'p102', name: 'Avental Descartável', category: 'Outros Itens de Rotina', currentStock: 0, minStock: 20, unit: 'Pacote' },
    { id: 'p103', name: 'Sacos Coleta Roupa Suja', category: 'Outros Itens de Rotina', currentStock: 0, minStock: 5, unit: 'Pacote' },
  ],
  transactions: []
};