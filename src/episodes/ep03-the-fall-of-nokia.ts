import { type EpisodeData, validateEpisode } from "../schema/episode";

/**
 * Episode 03 — The Fall of Nokia (Full 1-Video Implementation)
 * Total measured VO duration across 12 .m4a recordings: 304.849s (~9,151 frames @ 30fps).
 */
export const ep03TheFallOfNokiaEpisode: EpisodeData = validateEpisode({
  id: "ep03-the-fall-of-nokia",
  episodeNumber: "EPISODE 03",
  caseNumber: "A13-TECH-1865",
  title: "THE FALL OF NOKIA",
  subtitle: "Dari pabrik kertas Finlandia hingga raja ponsel yang tertinggal era.",
  category: "HISTORY & INDUSTRY ARCHIVE",
  location: "Finlandia · Pasar Global",
  date: "1865–2014",
  status: "DOCUMENTED SHIFT",
  fps: 30,
  ambient: "audio/ambient/archive-hum.mp3",
  scenes: [
    // 01. Intro.m4a (22.250s -> 668f)
    {
      id: "nokia-01-intro",
      type: "opening",
      duration: 668,
      chapterNumber: "00",
      headline: "THE FALL OF NOKIA",
      highlightWords: ["FALL", "NOKIA"],
      subtitle:
        "Dulu hampir semua orang mengenalnya. Bagaimana merek sekuat Nokia berubah menjadi catatan sejarah?",
      voiceover: "audio/voiceover/ep03/01-intro.m4a",
      srtText: `1
00:00:02,090 --> 00:00:05,070
Dulu, setiap orang punya ponsel Nokia.

2
00:00:06,650 --> 00:00:07,320
Suara ini...

3
00:00:09,530 --> 00:00:11,550
...adalah suara masa lalu

4
00:00:13,570 --> 00:00:19,380
yang penuh kenangan. Tapi bagaimana bisa merek sekuat Nokia kini hanya jadi cerita sejarah?`,
      transition: "paperCut",
      sfx: {
        category: "low_cinematic_impact",
        src: "audio/sfx/ep03-gsm-chime.mp3",
        offsetFrame: 221,
        duration: 64,
        volume: 0.72,
      },
      sfxList: [
        {
          category: "low_cinematic_impact",
          src: "audio/sfx/low-cinematic-impact.mp3",
          offsetFrame: 12,
          duration: 66,
          volume: 0.36,
        },
      ],
    },

    // 02. Segmen 1.m4a (45.418s -> 1363f)
    {
      id: "nokia-02-origins",
      type: "location",
      duration: 1363,
      chapterNumber: "01",
      headline: "1865 // NOKIANVIRTA",
      routeMode: "vehicle",
      integrityStatus: "VERIFIED",
      waypoints: [
        {
          id: "tampere",
          city: "TAMPERE (PABRIK 1865)",
          country: "FINLANDIA",
          coordinates: { lat: 61.4978, lng: 23.761 },
          xPercent: 68,
          yPercent: 40,
          align: "right",
        },
        {
          id: "nokianvirta",
          city: "SUNGAI NOKIANVIRTA",
          country: "FINLANDIA",
          coordinates: { lat: 61.4775, lng: 23.505 },
          xPercent: 34,
          yPercent: 52,
        },
        {
          id: "espoo",
          city: "ESPOO (HQ)",
          country: "FINLANDIA",
          coordinates: { lat: 60.1712, lng: 24.83 },
          xPercent: 48,
          yPercent: 78,
        },
      ],
      stat: {
        value: 4,
        suffix: " SEKTOR",
        label: "EVOLUSI KORPORASI SEJAK 1865",
        description:
          "Berawal dari pabrik pulp kertas dekat Sungai Nokianvirta oleh Fredrik Idestam, lalu berekspansi ke karet, kabel listrik, hingga telekomunikasi.",
        source: "ARSIP KORPORAT FINLANDIA // SRC-NOK-01",
      },
      voiceover: "audio/voiceover/ep03/02-segmen-1.m4a",
      srtText: `1
00:00:01,740 --> 00:00:07,200
Nokia lahir pada tahun 1865 di Finlandia.

2
00:00:08,450 --> 00:00:16,290
Bukan sebagai perusahaan teknologi, melainkan sebagai pabrik kertas yang didirikan oleh Fredrik Idestam.

3
00:00:18,410 --> 00:00:25,350
Nama Nokia diambil dari Sungai Nokianvirta yang mengalir dekat pabrik pertama mereka.

4
00:00:27,300 --> 00:00:30,980
Namun, perjalanan Nokia tidak berhenti di kertas.

5
00:00:33,430 --> 00:00:43,320
Mereka berkembang ke berbagai sektor: karet, kabel listrik, dan akhirnya telekomunikasi.`,
      transition: "verticalWipe",
      sfx: {
        category: "paper_movement",
        src: "audio/sfx/paper-movement.mp3",
        offsetFrame: 14,
        duration: 28,
        volume: 0.45,
      },
    },

    // 03. Segmen 1.1.m4a (18.944s -> 569f)
    {
      id: "nokia-03-gsm-1992",
      type: "incident",
      duration: 569,
      chapterNumber: "02",
      headline: "THE GSM SHIFT",
      subtitle: "NOKIA 1011 // PONSEL GSM MASSAL PERTAMA",
      dateStamp: "10 NOV 1992",
      body: "Dirilis pada November 1992 di era transformasi Jorma Ollila, Nokia 1011 menjadi tonggak komersial pertama ponsel GSM produksi massal dan menandai pergeseran penuh ke industri seluler.",
      voiceover: "audio/voiceover/ep03/03-segmen-1-1.m4a",
      srtText: `1
00:00:01,510 --> 00:00:10,540
Di tahun 1992, Nokia meluncurkan Nokia 1011, ponsel GSM pertama yang diproduksi secara massal.

2
00:00:12,690 --> 00:00:17,280
Sebuah revolusi dalam dunia telekomunikasi pun dimulai.`,
      transition: "paperCut",
      sfx: {
        category: "camera_shutter",
        src: "audio/sfx/camera-shutter.mp3",
        offsetFrame: 10,
        duration: 16,
        volume: 0.52,
      },
    },

    // 04. Segmen 2.m4a (30.250s -> 908f)
    {
      id: "nokia-04-golden-era",
      type: "background",
      duration: 908,
      chapterNumber: "03",
      headline: "GOLDEN ERA",
      subtitle: "1990-AN – AWAL 2000-AN // IKON GLOBAL",
      galleryMode: "contactSheet",
      filmStockLabel: "NOKIA ARCHIVE // HARDWARE LINEUP",
      galleryItems: [
        { frameCode: "01A", label: "NOKIA 5110 · DAYA TAHAN BATERAI" },
        { frameCode: "02A", label: "NOKIA 3210 · ANTENA INTERNAL" },
        { frameCode: "03A", label: "NOKIA 6600 · IKON SYMBIAN AWAL" },
        { frameCode: "04A", label: "SNAKE · SENSASI GIM GENGGAM" },
        { frameCode: "05A", label: "RANGKA TANGGUH · LEGACY" },
        { frameCode: "06A", label: "EKSPANSI GLOBAL 1998+" },
      ],
      body: "Model seperti 3210, 5110, dan 6600 mendefinisikan reliabilitas ponsel, dipadukan daya tahan baterai panjang serta gim Snake yang mendunia.",
      voiceover: "audio/voiceover/ep03/04-segmen-2.m4a",
      srtText: `1
00:00:02,640 --> 00:00:07,530
Di era 90-an hingga awal 2000-an adalah puncak kejayaan Nokia.

2
00:00:08,840 --> 00:00:16,300
Ponsel seperti 3210, 5110, dan 6600 menjadi ikon global.

3
00:00:18,320 --> 00:00:21,730
Baterainya tahan lama, desainnya tangguh,

4
00:00:23,340 --> 00:00:28,250
bahkan game Snake yang ada di ponsel ini menjadi sensasi dunia.`,
      transition: "verticalWipe",
      sfx: {
        category: "camera_shutter",
        src: "audio/sfx/camera-shutter.mp3",
        offsetFrame: 18,
        duration: 16,
        volume: 0.48,
      },
    },

    // 05. Segmen 2.1.m4a (20.096s -> 603f)
    {
      id: "nokia-05-market-peak",
      type: "statHero",
      duration: 603,
      chapterNumber: "04",
      headline: "UNRIVALED PEAK",
      subtitle: "DOMINASI PASAR PONSEL DUNIA",
      stat: {
        value: 40,
        prefix: "> ",
        suffix: "%",
        label: "PANGSA PASAR GLOBAL (PUNCAK)",
        description:
          "Pada puncak kejayaannya di penghujung 2000-an, sekitar empat dari sepuluh ponsel yang terjual di dunia bermerek Nokia.",
        source: "REKAM INDUSTRI SELULER // SRC-NOK-01",
      },
      citation: {
        sourceId: "SRC-NOK-01",
        title: "Nokia Mobile Market Peak (~40% Global Share)",
        publisher: "Historical Industry Records / GSMArena Archive",
        publicationDate: "1998–2008",
        sourceType: "ARCHIVE",
        verificationStatus: "VERIFIED",
      },
      voiceover: "audio/voiceover/ep03/05-segmen-2-1.m4a",
      srtText: `1
00:00:00,990 --> 00:00:06,680
Pada puncaknya, Nokia menguasai lebih dari 40% pasar ponsel dunia.

2
00:00:08,070 --> 00:00:10,830
Mereka adalah raja, tak tertandingi.

3
00:00:12,220 --> 00:00:18,410
Nokia tidak hanya dikenal karena keandalan ponselnya, tetapi juga karena inovasinya yang mendahului zaman.`,
      transition: "filmBurn",
      sfx: {
        category: "low_cinematic_impact",
        src: "audio/sfx/low-cinematic-impact.mp3",
        offsetFrame: 12,
        duration: 66,
        volume: 0.55,
      },
    },

    // 06. Segmen 3.m4a (34.858s -> 1046f)
    {
      id: "nokia-06-disruption-2007",
      type: "timeline",
      duration: 1046,
      chapterNumber: "05",
      headline: "2007 // TURNING POINT",
      events: [
        {
          date: "2007 · JAN / JUN",
          title: "APPLE MERILIS iPHONE & iOS",
          description:
            "Antarmuka layar sentuh kapasitif penuh tanpa papan ketik fisik mengubah standar interaksi ponsel.",
          highlight: true,
        },
        {
          date: "2007 – 2008",
          title: "EKOSISTEM ANDROID MUNCUL",
          description:
            "Platform terbuka dan toko aplikasi terpusat menarik produsen serta pengembang perangkat lunak global.",
        },
        {
          date: "2007 – 2010",
          title: "CELAH ADAPTASI NOKIA",
          description:
            "Di tengah perubahan arsitektur menuju software-first, fokus rekayasa Nokia masih tertahan pada model lama.",
        },
      ],
      voiceover: "audio/voiceover/ep03/06-segmen-3.m4a",
      srtText: `1
00:00:01,420 --> 00:00:04,870
Namun, tahun 2007 mengubah segalanya.

2
00:00:06,900 --> 00:00:14,640
Apple memperkenalkan iPhone yang revolusioner, dengan layar sentuh dan sistem operasi iOS.

3
00:00:17,920 --> 00:00:22,990
Tak lama setelah itu, Android datang dan mulai meraih perhatian.

4
00:00:25,240 --> 00:00:31,500
Dunia ponsel berubah. Dan Nokia tidak mengikuti.`,
      transition: "verticalWipe",
      sfx: {
        category: "typewriter",
        src: "audio/sfx/typewriter.mp3",
        offsetFrame: 16,
        duration: 38,
        volume: 0.45,
      },
    },

    // 07. Segmen 3.1.m4a (26.005s -> 781f)
    {
      id: "nokia-07-symbian-gap",
      type: "comparison",
      duration: 781,
      chapterNumber: "06",
      headline: "OS PARADIGM GAP",
      subtitle: "SYMBIAN OS VS SENTUH MODERN (iOS & ANDROID)",
      comparisonLeft: {
        label: "SYMBIAN OS (LEGACY)",
        caption:
          "Dibangun dari era keypad T9; struktur menu berlapis, lambat beradaptasi ke gestur jari & aplikasi pihak ketiga.",
      },
      comparisonRight: {
        label: "iOS & ANDROID",
        caption:
          "Dirancang sejak awal untuk layar sentuh kapasitif penuh dengan ekosistem App Store & Play Store yang pesat.",
      },
      voiceover: "audio/voiceover/ep03/07-segmen-3-1.m4a",
      srtText: `1
00:00:03,570 --> 00:00:10,820
Nokia bertahan dengan sistem Symbian, sistem operasi yang dianggap kaku dan tidak ramah pengguna.

2
00:00:12,450 --> 00:00:17,640
Sementara iPhone dan Android memperkenalkan cara baru dalam berinteraksi dengan ponsel.

3
00:00:20,000 --> 00:00:23,290
Symbian tetap tertinggal dan dianggap sudah usang.`,
      transition: "paperCut",
      sfx: {
        category: "paper_movement",
        src: "audio/sfx/paper-movement.mp3",
        offsetFrame: 10,
        duration: 28,
        volume: 0.42,
      },
    },

    // 08. Segmen 4.m4a (25.728s -> 772f)
    {
      id: "nokia-08-elop-2011",
      type: "theorySplit",
      duration: 772,
      chapterNumber: "07",
      headline: "2011 // MICROSOFT PIVOT",
      subtitle: "STEPHEN ELOP & TARUHAN WINDOWS PHONE",
      factCheck: {
        claim:
          "Kemitraan Microsoft 2011 disebut sebagai titik awal tunggal kejatuhan Nokia.",
        finding:
          "Pergeseran ke Windows Phone resmi diumumkan Februari 2011; namun analis bisnis juga menilai inersia Symbian sejak 2007 sudah menggerus daya saing.",
        verificationStatus: "DISPUTED",
        sourceId: "SRC-NOK-02",
        sourceTitle: "Nokia Memo & Platform Transition Analysis (2011–2014)",
      },
      theories: [
        {
          label: "FAKTA KORPORAT // FEB 2011",
          title: "ALIANSI WINDOWS PHONE",
          summary:
            "CEO Stephen Elop menggantikan Symbian dengan Windows Phone milik Microsoft untuk mengejar ekosistem aplikasi baru.",
          status: "VERIFIED",
        },
        {
          label: "PERDEBATAN ANALIS INDUSTRI",
          title: "TITIK AWAL VS PUNCAK KETERLAMBATAN",
          summary:
            "Sebagian menganggap langkah 2011 mempercepat penurunan; lainnya menilai ketertinggalan sudah dimulai sejak gagal merespons 2007.",
          status: "DISPUTED",
        },
      ],
      voiceover: "audio/voiceover/ep03/08-segmen-4.m4a",
      srtText: `1
00:00:00,890 --> 00:00:14,760
Di tahun 2011, CEO Nokia, Stephen Elop, yang sebelumnya berasal dari Microsoft, mengumumkan kemitraan besar dengan Microsoft untuk menggantikan Symbian dengan Windows Phone.

2
00:00:16,960 --> 00:00:24,030
Namun, langkah ini bukanlah penyelamat, malah menjadi titik awal dari kejatuhan Nokia.`,
      transition: "verticalWipe",
      sfx: {
        category: "stamp_impact",
        src: "audio/sfx/stamp-impact.mp3",
        offsetFrame: 42,
        duration: 20,
        volume: 0.58,
      },
    },

    // 09. Segmen 4.1.m4a (20.245s -> 608f)
    {
      id: "nokia-09-sale-2014",
      type: "mystery",
      duration: 608,
      chapterNumber: "08",
      headline: "2014 // ACQUISITION",
      docNumber: "MSFT-NOK-2014",
      agency: "DIVISI DEVICES & SERVICES",
      subtitle: "PENGAMBILALIHAN DIVISI PONSEL OLEH MICROSOFT",
      body: "Penurunan penjualan yang berkelanjutan saat konsumen beralih ke Android dan iOS berujung pada kesepakatan penjualan divisi ponsel Nokia kepada Microsoft pada 2014.",
      redactedPhrases: ["Windows Phone"],
      annotations: [
        "DATA ARSIP [1]: Kesepakatan diumumkan 2013 (~USD 7,2 miliar) & rampung 2014.",
        "DATA ARSIP [2]: Mengakhiri kendali langsung Nokia Corp atas lini ponsel mereknya.",
      ],
      stamp: "ARCHIVED",
      voiceover: "audio/voiceover/ep03/09-segmen-4-1.m4a",
      srtText: `1
00:00:01,120 --> 00:00:02,640
Penjualan terus menurun.

2
00:00:04,420 --> 00:00:09,630
Konsumen beralih ke ponsel Android dan iPhone yang lebih canggih dan ramah pengguna.

3
00:00:11,800 --> 00:00:19,250
Akhirnya, tahun 2014, divisi ponsel Nokia resmi diambil alih oleh Microsoft.`,
      transition: "filmBurn",
      sfx: {
        category: "tape_rewind",
        src: "audio/sfx/tape-rewind.mp3",
        offsetFrame: 14,
        duration: 34,
        volume: 0.45,
      },
    },

    // 10. Segmen 5.m4a (37.119s -> 1114f)
    {
      id: "nokia-10-hmd-5g",
      type: "evidence",
      duration: 1114,
      chapterNumber: "09",
      headline: "DUAL TRACKS",
      cards: [
        {
          id: "nokia-hmd",
          evidenceNumber: "TRACK A // LISENSI",
          title: "HMD GLOBAL & ANDROID",
          description:
            "Perusahaan yang dipimpin eks eksekutif Nokia melisensi merek ponsel Nokia dan merilis seri Android seperti Nokia 6.",
          date: "2016–2017",
          xPercent: 28,
          yPercent: 32,
          rotation: -2.5,
        },
        {
          id: "nokia-5g",
          evidenceNumber: "TRACK B // B2B CORE",
          title: "INFRASTRUKTUR JARINGAN 5G",
          description:
            "Nokia Corporation berfokus penuh pada teknologi jaringan telekomunikasi, paten, dan peralatan 5G global.",
          date: "PASCA-2014",
          xPercent: 72,
          yPercent: 66,
          rotation: 2.5,
        },
      ],
      connections: [
        {
          from: "nokia-hmd",
          to: "nokia-5g",
          label: "MEREK SAMA · ENTITAS TERPISAH",
        },
      ],
      voiceover: "audio/voiceover/ep03/10-segmen-5.m4a",
      srtText: `1
00:00:01,140 --> 00:00:09,320
Namun, Nokia belum sepenuhnya hilang. Kini, HMD Global yang dipimpin oleh mantan eksekutif Nokia memegang lisensi merek Nokia.

2
00:00:10,380 --> 00:00:21,290
Mereka kembali memasuki pasar ponsel dengan menggunakan Android dan merilis ponsel seperti Nokia 6 di bawah merek yang telah dikenal luas.

3
00:00:22,420 --> 00:00:35,630
Sementara itu, Nokia juga berfokus pada teknologi jaringan dan menjadi pemain besar dalam jaringan 5G.`,
      transition: "verticalWipe",
      sfx: {
        category: "paper_movement",
        src: "audio/sfx/paper-movement.mp3",
        offsetFrame: 12,
        duration: 28,
        volume: 0.4,
      },
    },

    // 11. Segmen 5.1.m4a (8.299s -> 249f)
    {
      id: "nokia-11-contrast",
      type: "quote",
      duration: 249,
      chapterNumber: "10",
      headline: "THE REALITY",
      body: "Tapi kejayaan ponsel mereka tidak pernah kembali seperti dulu.",
      highlightPhrase: "tidak pernah kembali",
      speaker: "NARASI PENUTUP",
      source: "ARSIP REKAMAN NOKIA // EP03",
      voiceover: "audio/voiceover/ep03/11-segmen-5-1.m4a",
      srtText: `1
00:00:01,020 --> 00:00:05,790
Tapi kejayaan ponsel mereka tidak pernah kembali seperti dulu.`,
      transition: "paperCut",
      sfx: {
        category: "low_cinematic_impact",
        src: "audio/sfx/low-cinematic-impact.mp3",
        offsetFrame: 8,
        duration: 66,
        volume: 0.45,
      },
    },

    // 12. Closing.m4a (15.637s -> 470f)
    {
      id: "nokia-12-closing",
      type: "conclusion",
      duration: 470,
      headline:
        "Dunia teknologi terus berubah. Siapa yang tak ikut, akan tertinggal.",
      integrityStatus: "VERIFIED",
      conclusionData: {
        title: "KESIMPULAN ARSIP // NOKIA (1865–PASCA 2014)",
        summary:
          "Dari pemimpin pangsa pasar global >40%, kegagalan beradaptasi di era sentuh & aplikasi mengakhiri dominasi ponsel Nokia sebelum mereknya bertransisi ke lisensi serta bisnis jaringan 5G.",
        openQuestions: [
          "Seberapa besar peran keterlambatan OS dibanding keputusan aliansi 2011?",
          "Pelajaran apa yang relevan bagi pemimpin teknologi hari ini?",
        ],
      },
      voiceover: "audio/voiceover/ep03/12-closing.m4a",
      srtText: `1
00:00:01,540 --> 00:00:07,070
Sejarah Nokia adalah kisah tentang inovasi, dominasi, lalu kelengahan.

2
00:00:08,350 --> 00:00:14,010
Dunia teknologi terus berubah. Siapa yang tak ikut, akan tertinggal.`,
    },
  ],
});
