import {
  FlipCardItem,
  ComparisonItem,
  RecyclePhase,
  FactItem,
  ActionFolder,
  TeamMember,
  LogbookEntry,
} from '../types';

export const TEAM_MEMBERS: TeamMember[] = [
  { name: 'Steffi Ansari Situmorang', nim: '240806500040', role: 'Ketua / Project Manager & UX Research' },
  { name: 'Aura Putri Nabila', nim: '240806500043', role: 'UI Designer & Visual Asset Creator' },
  { name: 'Muhammad Antasari Aryansyah', nim: '240806500046', role: 'Content Writer & Usability Researcher' },
  { name: 'Muh. Fatur Idris', nim: '240806501062', role: 'Interactive Prototyper & Interaction Specialist' },
  { name: 'Fathimah Azzahrah', nim: '240806501065', role: 'Graphic Illustrator & Visual Stylist' },
  { name: 'Alfathir Awan Arillah', nim: '2408060502034', role: 'Front-End Implementer & Accessibility QA' },
];

export const LECTURERS = [
  { name: 'Nurul Fadhillah S, S.Sos., M.A.', role: 'Dosen Pengampu Utama' },
  { name: 'Lulu Afifah Ichsan, S.Ds., M.Ds.', role: 'Dosen Pengampu DKV' },
  { name: 'Nurjayanti, S.Sos., M.I.Kom.', role: 'Dosen Pengampu Komunikasi' },
];

export const REDUCE_CARDS: FlipCardItem[] = [
  {
    id: 'reduce-1',
    number: '01',
    title: 'Tolak Plastik Sekali Pakai',
    tagline: 'Kurangi dari Sumbernya',
    iconType: 'plastic',
    frontDescription:
      'Kantong kresek, sedotan plastik, dan kantong jajan butuh ratusan tahun untuk terurai. Cara tercepat adalah menolaknya di awal.',
    backTips: [
      'Simpan selalu 1 totebag lipat di dalam tas kuliah harianmu.',
      'Katakan "nggak usah pakai kresek dan sedotan kak" saat beli minuman/jajan.',
      'Gunakan reusable bag saat belanja bulanan di minimarket dekat kost.',
    ],
    impactMetric: 'Menghemat ~350 kantong kresek per orang setiap tahun!',
    campusContext: 'Paling sering terbuang di kantin kampus dan minimarket sekitar kosan.',
  },
  {
    id: 'reduce-2',
    number: '02',
    title: 'Bawa Tumbler & Wadah Pribadi',
    tagline: 'BYO (Bring Your Own)',
    iconType: 'tumbler',
    frontDescription:
      'Setiap hari ribuan cup plastik es teh dan botol air mineral sekali pakai mencemari lingkungan kampus kita.',
    backTips: [
      'Isi air minum gratis di water station fakultas sebelum mulai kuliah.',
      'Bawa tumbler saat jajan kopi atau boba kesukaanmu di sekitar UNM.',
      'Siapkan kotak makan sendiri saat bungkus nasi kuning atau mie ayam.',
    ],
    impactMetric: 'Hemat uang saku Rp 15.000/hari + nol limbah cup plastik.',
    campusContext: 'Solusi paling hemat untuk gaya hidup mahasiswa mandiri.',
  },
  {
    id: 'reduce-3',
    number: '03',
    title: 'Stop Sampah Makanan (Food Waste)',
    tagline: 'Porsi Tepat, Habis Bersih',
    iconType: 'food',
    frontDescription:
      'Sampah sisa makanan menghasilkan gas metana penyebab efek rumah kaca saat membusuk di TPA tanpa oksigen.',
    backTips: [
      'Pesan porsi makan sesuai porsi kenyangmu, jangan lapar mata.',
      'Simpan makanan sisa di kulkas kos dengan wadah rapat untuk dihangatkan.',
      'Rencanakan menu belanja mingguan agar sayur dan buah tidak membusuk.',
    ],
    impactMetric: 'Mereduksi hingga 40% timbulan sampah organik di TPA Tamangapa.',
    campusContext: 'Timbulan sampah terbesar di Indonesia (41,2%) berasal dari sisa makanan!',
  },
];

export const REUSE_ITEMS: ComparisonItem[] = [
  {
    id: 'reuse-1',
    title: 'Botol Kaca Kopi & Selai',
    subtitle: 'Wadah Baru Ruang Belajar',
    category: 'Peralatan Kos & Meja Belajar',
    before: {
      label: 'Sebelum (Limbah)',
      description: 'Botol kaca bekas kopi instan atau selai yang menumpuk di tempat cuci piring dan biasanya langsung dibuang ke TPA.',
      drawback: 'Kaca butuh 1.000.000+ tahun untuk terurai di tanah.',
      visualType: 'glass-waste',
    },
    after: {
      label: 'Sesudah (Upcycled)',
      description: 'Dibersihkan dan disulap jadi pot tanaman sukulen/hidroponik estetik meja kos, atau wadah kuas lukis & pensil DKV!',
      benefit: 'Meja kamar lebih estetik, segar, dan hemat beli pot baru.',
      visualType: 'glass-plant',
    },
  },
  {
    id: 'reuse-2',
    title: 'Kardus Paket Ekspedisi',
    subtitle: 'Organizer Meja Minimalis',
    category: 'Penyimpanan & Dekorasi',
    before: {
      label: 'Sebelum (Limbah)',
      description: 'Kardus bekas belanja online e-commerce yang robek dan tergeletak memenuhi sudut kamar tidur kos.',
      drawback: 'Menumpuk cepat dan memicu sarang debu serta kecoa jika lembab.',
      visualType: 'cardboard-waste',
    },
    after: {
      label: 'Sesudah (Upcycled)',
      description: 'Dipotong dan dilapisi kertas kraft menjadi desk storage bersekat untuk modul kuliah, binder tugas, kabel, dan charger.',
      benefit: 'Kamar tertata rapi ala Pinterest tanpa keluar biaya sepeser pun!',
      visualType: 'cardboard-organizer',
    },
  },
  {
    id: 'reuse-3',
    title: 'Baju & Kaos Panitia Usang',
    subtitle: 'Totebag Unik Tanpa Jahit',
    category: 'Fashion Daur Pakai',
    before: {
      label: 'Sebelum (Limbah)',
      description: 'Kaos kepanitiaan lama atau baju katun yang sudah sempit, bernoda, dan hanya diam berbulan-bulan di lemari pakaian.',
      drawback: 'Industri tekstil adalah penyumbang limbah mikroplastik terbesar.',
      visualType: 'tshirt-waste',
    },
    after: {
      label: 'Sesudah (Upcycled)',
      description: 'Dibuat menjadi No-Sew Totebag belanja hanya bermodal gunting kain, atau kain lap serbaguna yang tahan lama.',
      benefit: 'Mengurangi ketergantungan kantong plastik saat belanja ke warung.',
      visualType: 'tshirt-totebag',
    },
  },
];

export const RECYCLE_PHASES: RecyclePhase[] = [
  {
    step: 1,
    title: '01. Pemilahan di Sumber',
    subtitle: 'Pondasi Daur Ulang',
    description:
      'Sampah dipisahkan dari kamar kos atau kampus antara plastik botol bersih, kertas kering, dan sisa organik. Sampah kotor sulit atau tidak bisa didaur ulang.',
    campusAction: 'Bilas botol plastik & pisahkan tutupnya sebelum masuk tong terpilah.',
    material: 'Botol PET Bersih',
  },
  {
    step: 2,
    title: '02. Pencacahan & Pencucian',
    subtitle: 'Flakes Processing',
    description:
      'Di fasilitas Bank Sampah atau mitra daur ulang, botol plastik dicacah menjadi serpihan halus (flakes) kemudian dicuci hingga bersih dari sisa label dan lem.',
    campusAction: 'Disalurkan ke Bank Sampah Unit Kampus atau pemulung binaan.',
    material: 'Serpihan Plastik (Flakes)',
  },
  {
    step: 3,
    title: '03. Peleburan & Peletisasi',
    subtitle: 'Thermal Pelleting',
    description:
      'Serpihan plastik dilelehkan dengan suhu terkontrol dan dicetak menjadi butiran biji plastik daur ulang (rPET pellet) berkualitas tinggi.',
    campusAction: 'Menghemat 70% energi dibanding membuat plastik baru dari minyak bumi.',
    material: 'Biji Plastik (rPET)',
  },
  {
    step: 4,
    title: '04. Pencetakan & Pemintalan',
    subtitle: 'Extrusion & Spinning',
    description:
      'Biji plastik dipintal menjadi serat polyester sintetis untuk tekstil atau dicetak kembali dengan cetakan presisi industri kreatif.',
    campusAction: 'Karya desain DKV bisa memanfaatkan material lembaran daur ulang!',
    material: 'Serat Polyester / Papan Daur Ulang',
  },
  {
    step: 5,
    title: '05. Produk Baru Naik Kelas',
    subtitle: 'New Circular Life',
    description:
      'Lahir kembali sebagai jaket ramah lingkungan, totebag waterproof, paving block ramah lingkungan, hingga furniture ramah bumi yang awet berpuluh tahun.',
    campusAction: 'Siklus sirkular tuntas: sampah kembali memiliki nilai fungsi tinggi.',
    material: 'Eco-Product Bernilai Ekonomi',
  },
];

export const FACTS_DATA: FactItem[] = [
  {
    id: 'fact-1',
    number: '19.4',
    unit: 'Juta Ton/Tahun',
    title: 'Sampah Tak Terkelola di Indonesia',
    description:
      'Berdasarkan data Sistem Informasi Pengelolaan Sampah Nasional (SIPSN) KLHK, jutaan ton sampah berakhir di TPA terbuka atau mencemari laut dan sungai.',
    source: 'SIPSN Kementerian Lingkungan Hidup & Kehutanan',
    detailText:
      'Lebih dari 60% sampah di Indonesia belum dipilah dari sumbernya, sehingga mencemari lingkungan dan menyulitkan proses daur ulang industri.',
    badge: 'Krisis Sampah Nasional',
  },
  {
    id: 'fact-2',
    number: '450',
    unit: 'Tahun Terurai',
    title: 'Umur 1 Botol Plastik di Alam',
    description:
      'Waktu yang dibutuhkan sebotol plastik PET untuk hancur di tanah. Plastik tidak pernah benar-benar hilang, melainkan terpecah jadi mikroplastik berbahaya.',
    source: 'World Wildlife Fund (WWF) & Riset Lingkungan',
    detailText:
      'Mikroplastik kini telah terdeteksi dalam air minum, garam dapur, hingga darah manusia. Mengurangi botol plastik sekali pakai adalah pencegahan mutlak.',
    badge: 'Ancaman Mikroplastik',
  },
  {
    id: 'fact-3',
    number: '81.3%',
    unit: 'Mahasiswa Kesulitan Fasilitas',
    title: 'Temuan Riset Tim Craft4Earth UNM',
    description:
      'Survei tim kami terhadap 16 mahasiswa (DKV & Non-DKV) menemukan hambatan terbesar adalah minimnya fasilitas tempat sampah terpilah di lingkungan kampus.',
    source: 'Survei Primer Kelompok Craft4Earth DKV UNM 2026',
    detailText:
      'Namun 100% responden menginginkan media edukasi visual interaktif yang menyenangkan, dan 75% siap membuka tautan edukasi jika mudah dipahami.',
    badge: 'Suara Nyata Kampus',
  },
];

export const ACTION_FOLDERS: ActionFolder[] = [
  {
    id: 'act-1',
    stepNumber: 1,
    title: 'Bawa Wadah Sendiri (BYO Tumbler & Kotak Bekal)',
    summary: 'Kurangi sampah plastik saat makan di kantin atau cafe favoritmu.',
    checklist: [
      'Siapkan botol minum di tas sebelum berangkat ke kampus.',
      'Bawa kotak bekal untuk pesanan takeaway tanpa styrofoam.',
      'Tolak sedotan plastik dan sendok plastik sekali pakai.',
    ],
    quote: '"Langkah paling mudah yang bisa dilakukan setiap mahasiswa setiap hari."',
    isCompleted: false,
  },
  {
    id: 'act-2',
    stepNumber: 2,
    title: 'Buat Pojok Pilah Sampah di Kamar Kos',
    summary: 'Sediakan 2 kantong terpisah: Sampah Kering (Botol/Kertas) vs Sampah Basah (Organik).',
    checklist: [
      'Bilas dan remukkan botol plastik sebelum disimpan di kardus pilah.',
      'Kumpulkan kertas HVS bekas tugas & print draft skripsi.',
      'Jauhkan sisa makanan basah dari kardus daur ulang agar tidak bau.',
    ],
    quote: '"Kamar kos rapi, sampahmu siap dijemput bank sampah atau pemulung."',
    isCompleted: false,
  },
  {
    id: 'act-3',
    stepNumber: 3,
    title: 'Kolektif & Bagikan Semangat 3R ke Teman Kampus',
    summary: 'Ajak teman sekelas dan satu circle untuk mulai peduli dan ikut ambil bagian.',
    checklist: [
      'Bagikan link microsite 3R ini ke grup WhatsApp angkatan.',
      'Dukung inisiatif bank sampah atau green movement di kampusmu.',
      'Jadikan gaya hidup ramah lingkungan sebagai kebanggaan anak muda.',
    ],
    quote: '"Bumi ini dipinjam dari anak cucu kita, yuk kita jaga bareng-bareng!"',
    isCompleted: false,
  },
];

export const LOGBOOK_ENTRIES: LogbookEntry[] = [
  {
    meeting: 1,
    date: '9 September 2026',
    focus: 'Proposal Proyek: Tema, Tujuan, Target Audiens, Jenis Media',
    feedback: 'Pastikan demografi mahasiswa jelas, lalu mantapkan media microsite responsif.',
    deliverable: 'Draft BAB I (2-3 hal) + Pembagian tugas anggota kelompok',
    isPassed: true,
  },
  {
    meeting: 2,
    date: '16 September 2026',
    focus: 'Riset Sederhana (Survei Google Form & Wawancara Mendalam)',
    feedback: 'Visual harus menarik berdasarkan preferensi responden (Akbar, Rani, Keyra) sebagai acuan konsep.',
    deliverable: 'Data riset 16 responden + insight pain points + persona Rani',
    isPassed: true,
  },
  {
    meeting: 3,
    date: '23 September 2026',
    focus: 'Konsep & Ideasi: Big Idea "Belajar 3R Sekali Scroll", Moodboard, Palet Warna 60-30-10',
    feedback: 'Kombinasi warna Mustard Green, Peach, dan Golden Brown sangat harmonis dengan tema bumi.',
    deliverable: 'Moodboard + Konsep + User Flow alur navigasi',
    isPassed: true,
  },
  {
    meeting: 4,
    date: '30 September 2026',
    focus: 'Wireframe Low-Fidelity Semua Section Kunci (Flip Card, Panah Before-After, Roda Siklus)',
    feedback: 'Interaksi sudah terarah dan memperhitungkan kemudahan scroll pengguna mobile.',
    deliverable: 'Wireframe layout hitam-putih struktur microsite lengkap',
    isPassed: true,
  },
  {
    meeting: 5,
    date: 'Oktober 2026',
    focus: 'Mockup High-Fidelity & Penerapan Prinsip Desain (Kontras, Hierarki, Aksesibilitas)',
    feedback: 'Keterbacaan teks dan rasio kontras WCAG harus dijaga di setiap kartu.',
    deliverable: 'Mockup visual penuh dengan palet warna final',
    isPassed: true,
  },
  {
    meeting: 6,
    date: 'Oktober 2026',
    focus: 'Prototyping Interaktif (Clickable) & Transisi Animasi',
    feedback: 'Pastikan transisi flip card dan putaran roda responsif di smartphone.',
    deliverable: 'Prototipe interaktif clickable berbasis web',
    isPassed: true,
  },
  {
    meeting: 7,
    date: 'Oktober 2026',
    focus: 'Usability Testing (3-5 Pengguna Mahasiswa) & Evaluasi Heuristik',
    feedback: 'Uji apakah tombol share dan interaksi tempat sampah mudah dipahami tanpa instruksi rumit.',
    deliverable: 'Skenario uji + catatan hasil observasi pengguna',
    isPassed: true,
  },
  {
    meeting: 8,
    date: 'November 2026',
    focus: 'Iterasi & Penyempurnaan Berdasarkan Hasil Pengujian',
    feedback: 'Perhalus feedback visual saat kartu diflip dan beri indikator langkah yang jelas.',
    deliverable: 'Perbandingan before-after dan revisi perbaikan',
    isPassed: true,
  },
  {
    meeting: 9,
    date: 'November 2026',
    focus: 'Finalisasi Laporan Lengkap (BAB I–VI) & Prototipe Siap Pakai',
    feedback: 'Siapkan link live yang bisa dibuka langsung oleh dosen dan rekan mahasiswa.',
    deliverable: 'Laporan final lengkap + microsite terpublikasi',
    isPassed: true,
  },
  {
    meeting: 10,
    date: '11 November 2026',
    focus: 'Gladi Presentasi & Presentasi Akhir di Hadapan Dosen Pengampu',
    feedback: 'Presentasikan hasil perancangan media interaktif dan dampaknya bagi mahasiswa UNM.',
    deliverable: 'Slide presentasi + demonstrasi langsung microsite clickable',
    isPassed: true,
  },
];
