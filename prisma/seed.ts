import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando povoamento do banco de dados paleontológico DinoPédia...");

  // Limpar tabelas existentes
  await prisma.curationLog.deleteMany({});
  await prisma.quizQuestion.deleteMany({});
  await prisma.forumPost.deleteMany({});
  await prisma.forumTopic.deleteMany({});
  await prisma.species.deleteMany({});

  // 1. Inserir Espécies com suporte nativo a triplas de conteúdo (ADR-002)
  const speciesList = [
    {
      name: "Tyrannosaurus rex",
      pronunciation: "ti-ra-no-SAU-rus reks",
      meaning: "Rei dos répteis tiranos",
      period: "Cretáceo Superior (Maastrichtiano)",
      periodEra: "Cretáceo",
      mya: "68 a 66 milhões de anos atrás",
      myaStart: 68.0,
      myaEnd: 66.0,
      clade: "Theropoda",
      family: "Tyrannosauridae",
      diet: "Carnívoro",
      habit: "Bípede Terrestre / Predador de Topo",
      length: 12.4,
      height: 3.9,
      weight: 8400,
      speed: 27,
      discoveryYear: 1902,
      discoverer: "Barnum Brown",
      fossilLocations: "América do Norte (Formações Hell Creek, Lance e Ferris)",
      latitude: 45.5,
      longitude: -106.5,
      brazilOccurrence: false,
      descInfantil: "O T-Rex é o rei dos dinossauros! Ele tinha dentes do tamanho de bananas pontudas capazes de quebrar ossos e pernas muito fortes. Seus bracinhos pareciam pequenos, mas eram fortes o suficiente para levantar um ser humano adulto!",
      descEscolar: "O Tyrannosaurus rex foi um dos maiores predadores terrestres de todos os tempos. Possuía visão binocular aguçada para calcular distâncias e olfato hiperdesenvolvido. Sua mordida exercia uma força estimada em até 6 toneladas por dente, permitindo esmagar as armaduras ósseas de Triceratops.",
      descAcademica: "Theropoda da família Tyrannosauridae, caracterizado por redução severa do membro anterior (dímero manual), crânio massivo com fusão nasofacetária adaptada à absorção de estresse torsiogênico, e dentes incrassados com raízes profundas. A análise tomográfica do endocrânio revela bulbos olfatórios expandidos e canais semicirculares adaptados à predação ativa.",
      funFact: "A mordida do T-Rex é considerada a mais forte entre todos os animais terrestres conhecidos na história da Terra.",
      dietDetails: "Hadrossaurídeos (Edmontosaurus), Ceratopsídeos (Triceratops) e carcaças de saurópodes.",
      skeletonNotes: "Crânio reforçado de 1.5m com fenestras antorbitais amplas; coluna vertebral com pneumatização extensiva em vértebras cervicais e dorsais; gastrália presente para suporte torácico.",
      muscleNotes: "Musculatura mandibular gigantesca (m. adductor mandibulae externus), pescoço em forma de S sustentado por fortes tendões elásticos, e m. caudofemoralis longus massivo na cauda para impulsionar a locomoção bípede.",
      integumentNotes: "Fósseis de pele mostram escamas reticuladas finas no dorso e cauda; hipótese de protopenas filamentosas em espécimes juvenis para termorregulação.",
      modelType: "theropod",
      colorTheme: "#b45309"
    },
    {
      name: "Oxalaia quilombensis",
      pronunciation: "o-xa-LAI-a qui-lom-BEN-sis",
      meaning: "Em homenagem à divindade Oxalá e aos quilombos maranhenses",
      period: "Cretáceo Superior (Cenomaniano)",
      periodEra: "Cretáceo",
      mya: "98 a 93 milhões de anos atrás",
      myaStart: 98.0,
      myaEnd: 93.0,
      clade: "Theropoda",
      family: "Spinosauridae",
      diet: "Piscívoro / Carnívoro",
      habit: "Semiaquático / Bípede e Quadrúpede facultativo",
      length: 13.0,
      height: 4.2,
      weight: 7500,
      speed: 22,
      discoveryYear: 2011,
      discoverer: "Alexander Kellner et al.",
      fossilLocations: "Brasil (Ilha do Cajual, Bacia de São Luís-Grajaú, Maranhão)",
      latitude: -2.48,
      longitude: -44.45,
      brazilOccurrence: true,
      descInfantil: "O Oxalaia é o maior dinossauro carnívoro encontrado no Brasil! Ele viveu no que hoje é o Maranhão. Sua boca parecia a de um jacaré gigante e ele adorava caçar peixes imensos em rios e manguezais pré-históricos.",
      descEscolar: "O Oxalaia quilombensis é o espinossaurídeo mais imponente descoberto na América do Sul. Com focinho longo e estreito cravejado de dentes cônicos lisos, adaptou-se a ecossistemas costeiros e estuários do Cretáceo equatorial brasileiro, demonstrando como a fauna do Brasil e da África ainda compartilhavam linhagens ancestrais da separação do supercontinente Gondwana.",
      descAcademica: "Holótipo MN 6117-V composto por extremidade rostral das pré-maxilas fundidas exibindo roseta terminal com sete dentes alveolares funcionais e substitutos de dentina sem serrilhas carinais, típico de Spinosaurinae. Compartilha estreita afinidade filogenética com Spinosaurus aegyptiacus, evidenciando províncias biogeográficas contínuas transatlânticas no Cenomaniano.",
      funFact: "Seus fósseis foram encontrados na Laje do Coringa, uma praia na Ilha do Cajual que passa metade do dia coberta pela maré atlântica!",
      dietDetails: "Grandes peixes celacantídeos (Mawsonia), tubarões primitivos, crocodilomorfos fluviais e carcaças de saurópodes.",
      skeletonNotes: "Focinho esticado em forma de espátula; pré-maxila alongada; cavidades neurovasculares periféricas nas pré-maxilas (mecanoreceptores subaquáticos); vértebras dorsais com espinhas neurais hipertrofiadas formando vela dorsal.",
      muscleNotes: "Musculatura cervical depressora otimizada para golpes verticais rápidos na água, semelhante a garças e crocodilianos modernos.",
      integumentNotes: "Tegumento escamoso hidrodinâmico adaptado a ambientes estuarinos salobros com osteodermas e cumeada dorsal tecidual sobre as espinhas neurais.",
      modelType: "theropod",
      colorTheme: "#059669"
    },
    {
      name: "Irritator challengeri",
      pronunciation: "i-ri-TA-tor cha-len-GE-ri",
      meaning: "O Irritante (devido ao trabalho dos cientistas para consertar o fóssil adulterado) de Challenger",
      period: "Cretáceo Inferior (Albiano)",
      periodEra: "Cretáceo",
      mya: "113 a 110 milhões de anos atrás",
      myaStart: 113.0,
      myaEnd: 110.0,
      clade: "Theropoda",
      family: "Spinosauridae",
      diet: "Piscívoro",
      habit: "Semiaquático / Bípede",
      length: 7.5,
      height: 2.3,
      weight: 1200,
      speed: 28,
      discoveryYear: 1996,
      discoverer: "Martill, Cruickshank, Frey, Small & Clarke",
      fossilLocations: "Brasil (Bacia do Araripe, Ceará - Formação Romualdo)",
      latitude: -7.23,
      longitude: -39.41,
      brazilOccurrence: true,
      descInfantil: "Este dinossauro brasileiro recebeu esse nome engraçado porque os fósseis foram colados por contrabandistas com gesso, deixando os cientistas muito irritados para restaurar! Ele tinha uma crista charmosa no topo da cabeça e comia peixes na Bacia do Araripe.",
      descEscolar: "Descoberto na famosa Chapada do Araripe no Ceará, o Irritator foi um dos espinossauros mais completos com crânio preservado. A posição de suas narinas recuadas permitia que ele respirasse mesmo com a ponta da boca submersa na água para capturar peixes em lagunas cretáceas.",
      descAcademica: "Spinosauridae de médio porte da subfamília Spinosaurinae. Caracterizado por crânio extremamente estreito, crista sagital proeminente no parietal e narinas ósseas retraídas posteriormente. Estudos biomecânicos recentes da articulação crânio-mandibular revelam capacidade de abertura mandibular rápida e forças de cisalhamento adaptadas à piscivoria pelágica.",
      funFact: "O nome de espécie 'challengeri' homenageia o Professor Challenger, personagem de 'O Mundo Perdido' de Sir Arthur Conan Doyle.",
      dietDetails: "Peixes pulmonados e ictiodectiformes da Formação Romualdo, além de filhotes de pterossauros da Formação Santana.",
      skeletonNotes: "Crânio tridimensional extraordinariamente preservado em nódulo calcário; palato secundário alongado que impedia o colapso estrutural da boca em torções; dentes cônicos levemente recurvados.",
      muscleNotes: "Musculatura abdutora e depressora adaptada para movimentos ultrarrápidos laterais do pescoço, ideais para o 'bote' aquático.",
      integumentNotes: "Possível cobertura de escamas impermeáveis lisas e crista tegumentar queratinizada sobre a crista sagital óssea.",
      modelType: "theropod",
      colorTheme: "#0284c7"
    },
    {
      name: "Buriolestes schultzi",
      pronunciation: "bu-rio-LES-tes SHUL-tzi",
      meaning: "Ladrão do Sítio Buriol em homenagem a Cesar Schultz",
      period: "Triássico Superior (Carniano)",
      periodEra: "Triássico",
      mya: "233 milhões de anos atrás",
      myaStart: 233.0,
      myaEnd: 230.0,
      clade: "Sauropodomorpha",
      family: "Sauropodomorpha Basal",
      diet: "Carnívoro / Faunívoro",
      habit: "Bípede Ágil",
      length: 1.5,
      height: 0.5,
      weight: 6,
      speed: 35,
      discoveryYear: 2016,
      discoverer: "Cabreira, Schultz, Müller et al.",
      fossilLocations: "Brasil (São João do Polêsine, Rio Grande do Sul - Formação Santa Maria)",
      latitude: -29.62,
      longitude: -53.44,
      brazilOccurrence: true,
      descInfantil: "Você sabia que os maiores dinossauros de pescoço comprido começaram pequenininhos como cachorros e eram caçadores de carne? O Buriolestes é brasileiro, do Rio Grande do Sul, e é um dos dinossauros mais antigos de todo o planeta!",
      descEscolar: "O Buriolestes é uma das maiores descobertas paleontológicas do século XXI. Ele provou cientificamente que a linhagem dos gigantescos dinossauros pescoçudos (saurópodes) evoluiu a partir de ancestrais bípedes pequenos e carnívoros que se alimentavam de insetos e pequenos vertebrados no sul do Brasil.",
      descAcademica: "Sauropodomorpha mais basal conhecido com esqueleto quase completo articulado. Exibe dentes comprimidos lateralmente, recurvados e com serrilhas carinais voltadas distalmente (morfologia faunívora/carnívora inequívoca), provando que o hábito herbívoro clássico dos saurópodes foi uma sinapomorfia secundária adquirida tardiamente.",
      funFact: "O Brasil é o berço evolutivo dos primeiros dinossauros; os fósseis da Formação Santa Maria no RS rivalizam com os da Argentina em antiguidade global.",
      dietDetails: "Pequenos cinodontes, rincossauros juvenis, insetos primitivos e lagartos do Triássico.",
      skeletonNotes: "Esqueleto grácil; tíbia mais longa que o fêmur (alta capacidade cursorial); mãos com cinco dígitos conservando o primeiro dígito predador móvel.",
      muscleNotes: "Músculos femorais alongados típicos de corredores velocistas; cauda longa atuando como contrapeso dinâmico nas curvas rápidas.",
      integumentNotes: "Epiderme primitiva com filamentos prototegumentares termoestáveis esparsos para retenção calórica no microclima monçônico do Pangeia.",
      modelType: "theropod",
      colorTheme: "#d97706"
    },
    {
      name: "Brachiosaurus altithorax",
      pronunciation: "bra-quio-SAU-rus al-ti-TO-raks",
      meaning: "Lagarto de braços de tórax alto",
      period: "Jurássico Superior (Kimmeridgiano)",
      periodEra: "Jurássico",
      mya: "154 a 150 milhões de anos atrás",
      myaStart: 154.0,
      myaEnd: 150.0,
      clade: "Sauropodomorpha",
      family: "Brachiosauridae",
      diet: "Herbívoro",
      habit: "Quadrúpede Gigante / Altívoro",
      length: 22.0,
      height: 12.0,
      weight: 42000,
      speed: 15,
      discoveryYear: 1900,
      discoverer: "Elmer S. Riggs",
      fossilLocations: "América do Norte (Formação Morrison, Colorado/Utah)",
      latitude: 39.1,
      longitude: -108.5,
      brazilOccurrence: false,
      descInfantil: "Um verdadeiro prédio de quatro andares ambulante! O Brachiosaurus tinha as patas da frente mais compridas que as de trás, como uma girafa colossal. Ele alcançava as folhas mais altas das árvores sem nem precisar ficar em duas patas!",
      descEscolar: "Pertencente aos saurópodes, o Brachiosaurus possuía um coração colossal que precisava bombear sangue até a cabeça a mais de 10 metros de altura contra a gravidade. Seu longo pescoço era aliviado por sacos aéreos ósseos idênticos aos das aves modernas.",
      descAcademica: "Sauropodomorpha Macronaria da família Brachiosauridae. Distingue-se por membros anteriores proporcionalmente mais longos que os posteriores (índice úmero-femoral > 1.0), escápula hipertrofiada e vértebras cervicais com cavidades pleurocélicas profundas para diminuição de massa esqueletal inercial. Dentes espatulados indicam corte de folhagem coriácea em dosséis coníferos.",
      funFact: "O coração do Brachiosaurus pesava cerca de 200 kg para conseguir gerar pressão arterial suficiente para nutrir seu cérebro nas alturas.",
      dietDetails: "Ciprestes, coníferas jurássicas, cicadáceas altas e samambaias arborescentes.",
      skeletonNotes: "Úmero mais longo que o fêmur; vértebras cervicais preenchidas por complexo sistema trabecular de sacos aéreos respiratórios; arcos neurais elevados.",
      muscleNotes: "Poderosos ligamentos cervicais elastificados (equivalente ao ligamento nucal) suportando o peso da cabeça com mínimo gasto metabólico muscular.",
      integumentNotes: "Pele espessa com escamas poligonais não-sobrepostas medindo de 1 a 3 cm, formando mosaico protetor térmico contra insolação.",
      modelType: "sauropod",
      colorTheme: "#15803d"
    },
    {
      name: "Triceratops horridus",
      pronunciation: "tri-CE-ra-tops HO-ri-dus",
      meaning: "Rosto com três chifres assustador",
      period: "Cretáceo Superior (Maastrichtiano)",
      periodEra: "Cretáceo",
      mya: "68 a 66 milhões de anos atrás",
      myaStart: 68.0,
      myaEnd: 66.0,
      clade: "Ornithischia",
      family: "Ceratopsidae",
      diet: "Herbívoro",
      habit: "Quadrúpede Robusto / Defensivo",
      length: 9.0,
      height: 3.0,
      weight: 9000,
      speed: 25,
      discoveryYear: 1887,
      discoverer: "Othniel Charles Marsh",
      fossilLocations: "América do Norte (Formações Hell Creek, Lance e Scollard)",
      latitude: 47.2,
      longitude: -104.7,
      brazilOccurrence: false,
      descInfantil: "O Triceratops era como um rinoceronte gigante com três chifres afiados e um escudo de osso no pescoço! Ele usava esses chifres para se defender do terrível T-Rex e também para disputar território com outros membros da manada.",
      descEscolar: "Com um escudo ósseo maciço (gola) e bico córneo afiado semelhante ao de um papagaio, o Triceratops triturava plantas duras como palmeiras e cicadáceas com dezenas de fileiras de dentes que se autorrenovavam durante toda a sua vida.",
      descAcademica: "Ceratopsia Chasmosaurinae caracterizado por folho parietal sólido sem fenestras parietais secundárias, chifres supraorbitais que podiam ultrapassar 1 metro de comprimento com revestimento queratinizado, e côndilo occipital esférico permitindo ampla amplitude rotacional da cabeça para manobras defensivas contra tiranossaurídeos.",
      funFact: "A cabeça do Triceratops era uma das maiores de qualquer animal terrestre: seu crânio sozinho podia medir quase 2,5 metros de comprimento!",
      dietDetails: "Vegetação fibrosa rente ao solo, palmeiras primitivas, cicadáceas e samambaias resistentes.",
      skeletonNotes: "Bateria dentária contendo centenas de dentes trituradores; vértebras cervicais anteriores fusionadas em 'sincervical' para sustentar o crânio de quase 1 tonelada.",
      muscleNotes: "Musculatura do masseter e pterigóideo extremamente espessas na fossa temporal parietal para cisalhamento vegetal em alta pressão.",
      integumentNotes: "Fósseis da Formação Hell Creek preservam escamas hexagonais e grandes tubérculos centrais com espículas osteodérmicas pontiagudas.",
      modelType: "ceratopsian",
      colorTheme: "#b91c1c"
    },
    {
      name: "Stegosaurus stenops",
      pronunciation: "ste-go-SAU-rus ste-NOPS",
      meaning: "Lagarto telhado com rosto estreito",
      period: "Jurássico Superior (Kimmeridgiano - Titoniano)",
      periodEra: "Jurássico",
      mya: "155 a 145 milhões de anos atrás",
      myaStart: 155.0,
      myaEnd: 145.0,
      clade: "Ornithischia",
      family: "Stegosauridae",
      diet: "Herbívoro",
      habit: "Quadrúpede Blindado",
      length: 8.5,
      height: 2.8,
      weight: 4500,
      speed: 12,
      discoveryYear: 1877,
      discoverer: "Othniel Charles Marsh",
      fossilLocations: "América do Norte (Formação Morrison) e Portugal (Formação Lourinhã)",
      latitude: 39.5,
      longitude: -105.2,
      brazilOccurrence: false,
      descInfantil: "O Estegossauro tinha placas triangulares de osso nas costas e quatro espinhos super perigosos na ponta do rabo chamados de 'tagomizador'. Se um carnívoro chegasse perto, ele balançava o rabo como uma clava!",
      descEscolar: "As famosas placas dorsais do Stegosaurus não eram fixadas nas vértebras, mas sim na pele! Paleontólogos descobriram canais vasculares nessas placas, o que sugere que elas serviam para esquentar ou esfriar o sangue ao sol, além de assustar predadores ficando avermelhadas de sangue.",
      descAcademica: "Thyreophora da família Stegosauridae. Apresenta placas ósseas alternadas (osteodermas dérmicos) altamente vascularizadas com papel duplo em termorregulação e display intraespecífico. Cauda flexível armada com dois pares de espinhos ósseos distais ('thagomizer') com evidência patológica direta de impacto letal na pélvis de Allosaurus.",
      funFact: "O cérebro do Estegossauro tinha o tamanho aproximado de uma noz, cerca de 80 gramas para um corpo de 4 toneladas e meia!",
      dietDetails: "Musgos, cavalinhas, samambaias baixas e frutos rasteiros jurássicos.",
      skeletonNotes: "Coluna dorsal com arcos neurais elevados; cauda composta por mais de 45 vértebras caudais com ligamentos ossificados; membros posteriores muito mais altos que os anteriores.",
      muscleNotes: "Musculatura abdominal profunda e complexo muscular caudal desenvolvido para desferir golpes laterais de chicotada de alta energia cinética.",
      integumentNotes: "Garganta protegida por centenas de pequenos ossículos dérmicos imbricados como cota de malha; placas dorsais revestidas de bainha queratinosa cortante.",
      modelType: "stegosaur",
      colorTheme: "#4d7c0f"
    },
    {
      name: "Velociraptor mongoliensis",
      pronunciation: "ve-lo-ci-RAP-tor mon-go-li-EN-sis",
      meaning: "Ladrão veloz da Mongólia",
      period: "Cretáceo Superior (Campaniano)",
      periodEra: "Cretáceo",
      mya: "75 a 71 milhões de anos atrás",
      myaStart: 75.0,
      myaEnd: 71.0,
      clade: "Theropoda",
      family: "Dromaeosauridae",
      diet: "Carnívoro",
      habit: "Bípede Emplumado / Caçador de Bando",
      length: 2.0,
      height: 0.6,
      weight: 15,
      speed: 40,
      discoveryYear: 1923,
      discoverer: "Peter Kaisen / Henry Fairfield Osborn",
      fossilLocations: "Ásia (Deserto de Gobi, Mongólia e China - Formação Djadochta)",
      latitude: 44.0,
      longitude: 103.0,
      brazilOccurrence: false,
      descInfantil: "Ao contrário dos filmes, o Velociraptor da vida real tinha o tamanho de um peru grande e era todinho coberto de penas coloridas como uma ave moderna! Ele tinha uma garra em foice curva e afiada no segundo dedo do pé.",
      descEscolar: "O Velociraptor é um dos mais célebres dromaeossaurídeos. A descoberta de fósseis com botões foliculares (inserções de penas) nas ulmas provou definitivamente a relação de parentesco direta entre pequenos dinossauros terópodes e as aves que vemos voando hoje.",
      descAcademica: "Maniraptora Dromaeosauridae com caixa craniana de alto índice de encefalização, narinas anteriores alongadas e maxilas com dentição serrilhada voltada para trás. O segundo dígito pedioso carrega garras hipertrofiadas falciformes retráteis em hiperextensão articular para preensão de presas vivas (modelo RPR: Raptor Prey Restraint).",
      funFact: "O fóssil mais famoso do mundo, chamado de 'Dinossauros Lutadores', mostra um Velociraptor e um Protoceratops engalfinhados em combate mortal preservados juntos por uma tempestade de areia há 75 milhões de anos!",
      dietDetails: "Pequenos dinossauros herbívoros (Protoceratops), lagartos do deserto e mamíferos cretáceos.",
      skeletonNotes: "Cauda enrijecida por bainhas de tendões ósseos pré-zigapofisários alongados; fúrcula (osso da sorte) idêntica à das aves modernas; ossos pneumatizados.",
      muscleNotes: "Musculatura flexora digital dos pés de contração rápida capaz de perfurar a traqueia ou conter presas no solo.",
      integumentNotes: "Penas remiges assimétricas comprovadas nas asas e penas caudais em leque para equilíbrio aerodinâmico durante manobras em corrida rápida.",
      modelType: "theropod",
      colorTheme: "#c026d3"
    },
    {
      name: "Ankylosaurus magniventris",
      pronunciation: "an-qui-lo-SAU-rus mag-ni-VEN-tris",
      meaning: "Lagarto fundido de ventre grande",
      period: "Cretáceo Superior (Maastrichtiano)",
      periodEra: "Cretáceo",
      mya: "68 a 66 milhões de anos atrás",
      myaStart: 68.0,
      myaEnd: 66.0,
      clade: "Ornithischia",
      family: "Ankylosauridae",
      diet: "Herbívoro",
      habit: "Quadrúpede Tanque de Guerra",
      length: 8.0,
      height: 1.7,
      weight: 6000,
      speed: 10,
      discoveryYear: 1906,
      discoverer: "Barnum Brown",
      fossilLocations: "América do Norte (Formações Hell Creek e Scollard)",
      latitude: 47.0,
      longitude: -106.0,
      brazilOccurrence: false,
      descInfantil: "O Anquilossauro era um verdadeiro tanque de guerra blindado! Seu corpo inteiro era coberto por placas de osso duras como pedras e até as pálpebras dos olhos tinham osso para proteção. Na cauda, ele tinha uma bola de osso pesada para bater em predadores.",
      descEscolar: "Com seu corpo rebaixado e carapaça impenetrável de osteodermas fusionados à pele e aos ossos, o Ankylosaurus era quase imune aos ataques do T-Rex. Sua clava caudal era formada por vértebras terminais fundidas e nós ósseos maciços capazes de quebrar a perna de qualquer predador com facilidade.",
      descAcademica: "Thyreophora Ankylosauridae avançado. Crânio completamente recoberto por caputegulae (ossos dérmicos secundários fundidos aos ossos cranianos), vias nasais sinuosas complexas para troca térmica e filtragem de ar árido cretáceo. A clava distal é composta por nós dérmicos ossificados presos à vértebras caudais terminais que formam um 'cabo' ósseo rígido de transmissão de torque.",
      funFact: "A clava caudal de um Anquilossauro adulto podia atingir forças de impacto superiores a 14.000 Newtons, suficiente para estilhaçar ossos femorais de predadores gigantes.",
      dietDetails: "Plantas rasteiras, samambaias baixas, raízes e arbustos tuberosos.",
      skeletonNotes: "Costelas e vértebras fusionadas à armadura dérmica; cavidade nasal convoluta em espiral dupla; pélvis larga para acomodar câmara de fermentação digestiva gigante.",
      muscleNotes: "Musculatura do tronco e membros baixos com centro de gravidade baixíssimo; ligamentos ossificados rígidos na metade posterior da cauda.",
      integumentNotes: "Carapaça constituída por centenas de placas ósseas queratinizadas dispostas em fileiras transversais contínuas desde a nuca até a cauda.",
      modelType: "ankylosaur",
      colorTheme: "#64748b"
    },
    {
      name: "Pteranodon longiceps",
      pronunciation: "pte-RA-no-don lon-GI-ceps",
      meaning: "Alado sem dentes de cabeça comprida",
      period: "Cretáceo Superior (Coniaciano - Campaniano)",
      periodEra: "Cretáceo",
      mya: "86 a 84 milhões de anos atrás",
      myaStart: 86.0,
      myaEnd: 84.0,
      clade: "Pterosauria",
      family: "Pteranodontidae",
      diet: "Piscívoro",
      habit: "Planador Aéreo Oceânico",
      length: 2.5,
      height: 1.8,
      weight: 35,
      speed: 70,
      discoveryYear: 1876,
      discoverer: "Othniel Charles Marsh",
      fossilLocations: "América do Norte (Mar Interior Ocidental, Formação Niobrara, Kansas)",
      latitude: 38.8,
      longitude: -100.2,
      brazilOccurrence: false,
      descInfantil: "O Pteranodon não era exatamente um dinossauro, mas sim um réptil voador primo deles! Ele tinha asas gigantes de mais de 6 metros de ponta a ponta e uma crista pontuda na cabeça para ajudar a planar sobre os oceanos e pescar peixes.",
      descEscolar: "Embora popularmente chamado de dinossauro, o Pteranodon pertence à ordem Pterosauria. Ele sobrevoava o antigo Mar Interior Norte-Americano planando por centenas de quilômetros como um albatroz gigante, mergulhando o bico na água para pescar lulas e peixes sem precisar de dentes.",
      descAcademica: "Ornithocheiroidea Pteranodontidae caracterizado por perda total de dentes (rostro adentado com bainha de rinfoteca córnea cortante) e crista sagital cranial occipital pronunciada que desempenhava papel aerodinâmico e de dimorfismo sexual. A membrana alar (quirapatágio) era sustentada pelo quarto dedo manual hiperalongado e reforçada por actinofibrilas dérmicas.",
      funFact: "Seus ossos tinham paredes finas como casca de ovo (menos de 1 milímetro) preenchidas por ar para serem incrivelmente leves para voar.",
      dietDetails: "Peixes fósseis marinhos cretáceos (Enchodus, Saurodon) e belemnites/cefalópodes pelágicos.",
      skeletonNotes: "Quarto metacarpo e falanges do quarto dedo hipertrofiados; notário presente (fusão de vértebras dorsais anteriores articuladas com a escápula); esterno quinado profundo.",
      muscleNotes: "Musculatura peitoral profunda ancorada à quilha esternal para propulsão em decolagens quadrúpedes anfíbias e sustentação de voo.",
      integumentNotes: "Corpo recoberto por picnofibras (estruturas filamentosas análogas aos pelos de mamíferos e penas de dinossauros) para isolamento térmico em voos oceânicos de altitude.",
      modelType: "pterosaur",
      colorTheme: "#0284c7"
    }
  ];

  for (const s of speciesList) {
    await prisma.species.create({ data: s });
  }
  console.log(`✓ ${speciesList.length} espécies inseridas com sucesso.`);

  // 2. Inserir Tópicos e Posts do Fórum Moderado
  await prisma.forumTopic.create({
    data: {
      title: "Descoberta de novos fósseis de Espinossaurídeos no Nordeste do Brasil",
      content: "Recentemente foram catalogados novos dentes e fragmentos vertebrais na Formação Romualdo (Bacia do Araripe). O que esses achados indicam sobre a diversidade de predadores semiaquáticos no Cretáceo brasileiro?",
      category: "Descobertas",
      authorName: "Dr. Alexander Silva",
      authorRole: "Paleontólogo Curador",
      isVerified: true,
      isPinned: true,
      likes: 18,
      posts: {
        create: [
          {
            content: "Excelente questão! A semelhança entre o Irritator e os espinossaurídeos do norte da África reforça a proximidade continental antes da abertura completa do Atlântico Sul no Albiano.",
            authorName: "Profa. Mariana Costa",
            authorRole: "Professor",
            isVerified: true,
            likes: 9
          },
          {
            content: "Professor, quer dizer que o Brasil e a África eram grudados e os dinossauros podiam caminhar de um continente para o outro?",
            authorName: "Lucas Aluno 7º Ano",
            authorRole: "Aluno",
            isVerified: false,
            likes: 4
          },
          {
            content: "Exatamente, Lucas! No início do Cretáceo a América do Sul e a África formavam o supercontinente Gondwana. Por isso achamos fósseis quase idênticos no Maranhão e no Marrocos/Egito!",
            authorName: "Dr. Alexander Silva",
            authorRole: "Paleontólogo Curador",
            isVerified: true,
            likes: 12
          }
        ]
      }
    }
  });

  await prisma.forumTopic.create({
    data: {
      title: "Como usar o modelo 3D do Tyrannosaurus rex em sala de aula de Biologia?",
      content: "Gostaria de sugestões pedagógicas para trabalhar biomecânica e evolução com a turma do 9º ano utilizando as camadas óssea e muscular do visualizador 3D.",
      category: "Dúvidas Escolares",
      authorName: "Prof. Henrique Viana",
      authorRole: "Professor",
      isVerified: true,
      isPinned: false,
      likes: 14,
      posts: {
        create: [
          {
            content: "Recomendo ativar o modo 'Escolar' e alternar entre a camada de Esqueleto e Músculo para mostrar o músculo caudofemoralis na cauda e como ele puxa o fêmur para frente. É ótimo para explicar física e alavancas osteomusculares!",
            authorName: "Curadoria DinoPédia",
            authorRole: "Administrador",
            isVerified: true,
            likes: 8
          }
        ]
      }
    }
  });

  await prisma.forumTopic.create({
    data: {
      title: "Cladística de Sauropodomorpha basais: Buriolestes e a origem da herbivoria",
      content: "A posição filogenética de Buriolestes schultzi como sauropodomorpha carnívoro consolida a hipótese de que a transição morfológica para herbivoria estrita envolveu plasticidade trófica intermediária?",
      category: "Debates Científicos",
      authorName: "Camila Guimarães (Mestranda Paleontologia)",
      authorRole: "Aluno",
      isVerified: true,
      isPinned: false,
      likes: 11,
      posts: {
        create: [
          {
            content: "Sim! A microdesgaste dentário em sauropodomorphas do Carniano do RS e da Argentina mostra transição de faunivoria generalista para onivoria antes do desenvolvimento dos dentes espatulados dos grandes saurópodes do Jurássico.",
            authorName: "Dr. Alexander Silva",
            authorRole: "Paleontólogo Curador",
            isVerified: true,
            likes: 7
          }
        ]
      }
    }
  });
  console.log("✓ Tópicos e respostas do Fórum criados.");

  // 3. Inserir Perguntas de Quiz Interativo Multinível
  const quizQuestions = [
    // Infantil
    {
      category: "identificacao",
      level: "infantil",
      question: "Qual dinossauro tinha três chifres no rosto e um grande escudo de osso no pescoço?",
      options: JSON.stringify(["Tyrannosaurus rex", "Triceratops", "Brachiosaurus", "Pteranodon"]),
      correctIndex: 1,
      explanation: "O Triceratops tinha dois chifres grandes acima dos olhos e um menor no focinho, além de um escudo de osso para se proteger do T-Rex!",
      speciesHint: "Triceratops horridus"
    },
    {
      category: "periodo",
      level: "infantil",
      question: "O Tyrannosaurus rex e o Brachiosaurus foram amigos na mesma época?",
      options: JSON.stringify([
        "Sim, eles brincavam juntos",
        "Não, o Brachiosaurus viveu milhões de anos antes do T-Rex!",
        "Sim, eles viveram exatamente no mesmo ano",
        "Eles nunca existiram de verdade"
      ]),
      correctIndex: 1,
      explanation: "O Brachiosaurus viveu no período Jurássico, enquanto o T-Rex só apareceu muito tempo depois, no final do Cretáceo!",
      speciesHint: "Tyrannosaurus rex"
    },
    {
      category: "dieta",
      level: "infantil",
      question: "Qual era o alimento favorito do dinossauro brasileiro Oxalaia e do Irritator?",
      options: JSON.stringify(["Frutas da floresta", "Peixes nos rios e lagos", "Capim e grama", "Folhas dos coqueiros"]),
      correctIndex: 1,
      explanation: "Eles eram espinossauros com focinho comprido de jacaré e dentes cônicos perfeitos para agarrar peixes escorregadios!",
      speciesHint: "Oxalaia quilombensis"
    },
    // Escolar
    {
      category: "anatomia",
      level: "escolar",
      question: "Qual característica esquelética das aves modernas já estava presente em terópodes carnívoros como o Tyrannosaurus e o Velociraptor?",
      options: JSON.stringify([
        "Bico de pato sem mandíbula",
        "Ossos ocos com sacos aéreos respiratórios e fúrcula (osso da sorte)",
        "Quatro asas com membranas de morcego",
        "Exoesqueleto de quitina"
      ]),
      correctIndex: 1,
      explanation: "Os dinossauros terópodes possuíam ossos pneumatizados (com câmaras de ar) conectados a sacos aéreos e a fúrcula, elementos anatômicos que permitiram às aves alçar voo mais tarde na evolução.",
      speciesHint: "Tyrannosaurus rex"
    },
    {
      category: "periodo",
      level: "escolar",
      question: "Por que os fósseis da Formação Santa Maria no Rio Grande do Sul (Brasil) são tão cruciais para a Paleontologia mundial?",
      options: JSON.stringify([
        "Porque registram o impacto do asteroide que extinguiu os dinossauros",
        "Porque preservam os primeiros dinossauros do período Triássico, há cerca de 233 milhões de anos",
        "Porque foram os primeiros a ter DNA recuperado em laboratório",
        "Porque só existem fósseis marinhos de baleias"
      ]),
      correctIndex: 1,
      explanation: "O sul do Brasil e o noroeste da Argentina guardam as rochas com os fósseis de dinossauros mais antigos do planeta (período Triássico Carniano), como Buriolestes e Saturnalia.",
      speciesHint: "Buriolestes schultzi"
    },
    {
      category: "anatomia",
      level: "escolar",
      question: "Para que serviam primordialmente as placas dorsais vascularizadas do Stegosaurus segundo os consensos biológicos modernos?",
      options: JSON.stringify([
        "Serviam apenas como asas para saltos curtos",
        "Termorregulação corporal e exibição visual intraespecífica",
        "Para armazenar água como corcovas de camelos",
        "Para produzir veneno contra predadores"
      ]),
      correctIndex: 1,
      explanation: "A presença de canais sanguíneos nas placas mostra que elas atuavam trocando calor com o ambiente e mudando de tom para afugentar rivais e cortejar parceiros.",
      speciesHint: "Stegosaurus stenops"
    },
    // Acadêmico
    {
      category: "anatomia",
      level: "academico",
      question: "Na sistemática filogenética de Theropoda, qual das seguintes sinapomorfias caracteriza o crânio dos Tyrannosauridae em relação a outros tetanuros basais?",
      options: JSON.stringify([
        "Ausência total de fenestras temporais e mandíbulas desprovidas de dentes",
        "Fusão dos ossos nasais, expansão posterior do crânio com redução do membro anterior dímero",
        "Articulação mandibular exclusivamente do tipo piscívora com pré-maxila espatulada",
        "Crânio totalmente anapsídeo com ausência de sínfise mandibular"
      ]),
      correctIndex: 1,
      explanation: "Os tiranossaurídeos sofreram co-ossificação dos nasais (para resistir a forças torsiogênicas de mordida), alargamento da região occipital posterior (visão estereoscópica) e redução manual funcional a dois dígitos.",
      speciesHint: "Tyrannosaurus rex"
    },
    {
      category: "dieta",
      level: "academico",
      question: "Qual implicação macroevolutiva foi estabelecida pela análise dentária e morfofuncional do holótipo de Buriolestes schultzi (Cabreira et al., 2016)?",
      options: JSON.stringify([
        "Comprovou que os Ornithischia originaram os pterossauros marinhos",
        "Demonstrou que o ancestral comum de Sauropodomorpha era carnívoro/faunívoro e bípede, precedendo a transição secundária para a herbivoria",
        "Provou que o gigantismo sauropodomorfo já estava plenamente estabelecido no Ladiniano",
        "Refutou o monofiletismo de Dinosauria frente aos Crurotarsi"
      ]),
      correctIndex: 1,
      explanation: "A dentição serrilhada e carnívora de Buriolestes desfez o antigo dogma de que os ancestrais de dinossauros de pescoço longo já eram estritamente herbívoros, demonstrando que a herbivoria foi uma especialização adquirida ao longo do Triássico Tardio.",
      speciesHint: "Buriolestes schultzi"
    }
  ];

  for (const q of quizQuestions) {
    await prisma.quizQuestion.create({ data: q });
  }
  console.log(`✓ ${quizQuestions.length} perguntas de quiz inseridas.`);

  // 4. Log de Curadoria
  await prisma.curationLog.create({
    data: {
      action: "INITIAL_DATABASE_SEED",
      author: "Curadoria Paleontológica CEUB 2026",
      details: "Carga inicial de 10 táxons representativos com triplas descritivas (ADR-002), registros fóssil brasileiros (Bacia do Araripe e Santa Maria), tópicos de discussão e banco de questões."
    }
  });

  console.log("Banco de dados populado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
