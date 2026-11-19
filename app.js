(() => {
  const SB = "https://ctldtidtnvctxoquextm.supabase.co";
  const KEY = "sb_publishable_t3zzhT3K_iR0FWuFCA4-Ow_Rdn8zsQk";

  const svg = (d) => `<svg viewBox="0 0 24 24"><path d="${d}"/></svg>`;
  const I = {
    menu: svg("M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z"),
    search: svg("M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"),
    back: svg("M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"),
    home: svg("M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"),
    homeO: svg("M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z"),
    star: svg("M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"),
    starO: svg("M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4l-3.76 2.27 1-4.28-3.32-2.88 4.38-.38L12 6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z"),
    news: svg("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"),
    newsO: svg("M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"),
    person: svg("M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"),
    personO: svg("M12 5.9A2.1 2.1 0 1 1 9.9 8 2.1 2.1 0 0 1 12 5.9m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"),
    heart: svg("M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"),
    heartO: svg("M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"),
    chat: svg("M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"),
    mark: svg("M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"),
    more: svg("M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"),
    lock: svg("M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10z"),
    key: svg("M12.65 10A5.99 5.99 0 0 0 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6a5.99 5.99 0 0 0 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"),
    apple: svg("M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"),
    google: svg("M21.35 11.1h-9.17v2.98h5.3c-.23 1.25-1.4 3.66-5.3 3.66A6.1 6.1 0 1 1 12.18 6c1.74 0 2.91.74 3.58 1.38l2.44-2.36C16.54 3.5 14.56 2.5 12.18 2.5 6.92 2.5 2.7 6.72 2.7 12s4.22 9.5 9.48 9.5c5.47 0 9.08-3.84 9.08-9.24 0-.62-.07-1.09-.16-1.56z"),
    cam: svg("M12 12m-3.2 0a3.2 3.2 0 1 1 6.4 0 3.2 3.2 0 1 1-6.4 0M9 2 7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9z"),
    check: svg("M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"),
    fwd: svg("M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"),
    close: svg("M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"),
    mail: svg("M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"),
    eye: svg("M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5C21.27 7.61 17 4.5 12 4.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"),
    eyeOff: svg("M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"),
    warn: svg("M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"),
    prev: svg("M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"),
    next: svg("M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z"),
    ig: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.3" cy="6.8" r="1.05" fill="currentColor" stroke="none"/></svg>`,
  };

  const copy = {
    en: {
      home: "FEED", stars: "STARS", news: "DRIP NEWS", join: "JOIN", account: "ACCOUNT",
      search: "SEARCH ARCHIVE", hint: "STAR, BRAND, MODEL",
      searchPrompt: "TYPE A STAR, BRAND, OR MODEL.",
      searchBrands: "BRANDS", searchPopular: "MOST POPULAR",
      viewAll: "VIEW ALL",
      global: "GLOBAL", na: "NORTH AMERICA", eu: "EUROPE", as: "ASIA",
      private: "PRIVATE FEED",
      details: "FIT DETAILS", item: "1 ITEM", items: "{n} ITEMS",
      empty: "NO CONTENT AVAILABLE IN THIS REGION",
      feedSub: "THE ARCHIVE.",
      feedDesc: "STUDY THE LOOK. FOLLOW THE STARS. BUILD YOUR ARCHIVE.",
      feedIndex: "FITS LIVE",
      starsSub: "DISCOVER ARTISTS.",
      starsDesc: "A CURATED ARCHIVE OF ARTISTS SHAPING THE CULTURE. DISCOVER. STUDY. CONNECT.",
      starsIndex: "IN THE ARCHIVE",
      starsEmpty: "NO ARTISTS IN THIS REGION.",
      az: "A-Z", trend: "TRENDING",
      newsSub: "DAILY DROP.",
      newsDesc: "DISPATCHES FROM THE CULTURE. HYPE THE DROP. KNOW THE LOOK.",
      newsIndex: "DISPATCHES",
      newsEmpty: "NO DISPATCHES.", newsBy: "BY",
      newsHype: "HYPE THIS", newsHyped: "HYPED",
      authHype: "HYPE THIS DISPATCH YOU NEED TO BE LOGGED IN.\n\nJOIN THE WEARS ON COMMUNITY, REFLECT YOUR STYLE AND BUILD YOUR ARCHIVE.",
      buy: "BUY", visiting: "OPENING",
      plate: "THE WEARS ON MEMBER", artists: "ARTISTS",
      followers: "FOLLOWERS", fits: "FITS",
      visit: "VISIT STORE", sold: "SOLD OUT", exclusive: "EXCLUSIVE",
      inStock: "IN STOCK", outStock: "OUT OF STOCK", lowStock: "LOW STOCK", friends: "FRIENDS & FAMILY",
      best: "BEST PRICE TODAY", related: "YOU MIGHT ALSO LIKE",
      lang: "LANGUAGE", en: "ENGLISH", tr: "TÜRKÇE",
      legal: "TERMS OF USE", privacy: "PRIVACY POLICY",
      connecting: "CONNECTING", none: "NO MATCHES.", menu: "MENU",
      follow: "FOLLOW", following: "FOLLOWING",
      welcomeLine: "FASHION. MUSIC. CULTURE.", welcomeKicker: "THE ARCHIVE",
      joinDek: "A CURATED ARCHIVE OF FASHION, MUSIC AND CULTURE. FOLLOW THE STARS. STUDY THE LOOK. BUILD YOUR ARCHIVE.",
      joinFollow: "FOLLOW", joinFollowD: "CURATE A PRIVATE FEED OF ARTISTS SHAPING THE CULTURE.",
      joinArchive: "ARCHIVE", joinArchiveD: "STUDY FITS AND PIECES. KNOW THE LOOK.",
      joinCulture: "CULTURE", joinCultureD: "HYPE DRIP NEWS. JOIN THE CONVERSATION.",
      pieces: "PIECES",
      logIn: "LOG IN", create: "CREATE ACCOUNT", or: "OR",
      apple: "CONTINUE WITH APPLE", google: "CONTINUE WITH GOOGLE", guest: "CONTINUE AS GUEST",
      email: "EMAIL", emailHint: "Enter your email",
      nick: "NICKNAME", nickHint: "3–18 LETTERS OR NUMBERS",
      pass: "PASSWORD", passHint: "Create a password", passDesc: "8+ CHARACTERS, WITH LETTERS AND NUMBERS",
      remember: "REMEMBER ME", forgot: "FORGOT PASSWORD?",
      terms1: "By creating an account, you agree to our ", terms2: "Terms of Service", terms3: " and ", terms4: "Privacy Policy.",
      errFields: "YOU MUST FILL IN ALL THE FIELDS.",
      errAuth: "LOGIN FAILED.", errSignup: "ACCOUNT COULD NOT BE CREATED.",
      confirm: "CHECK YOUR EMAIL TO CONFIRM THE ACCOUNT.",
      inUse: "THIS EMAIL IS ALREADY REGISTERED.",
      nickTaken: "THAT NICKNAME IS TAKEN.", nickInvalid: "3–18 LETTERS OR NUMBERS.",
      authTitle: "LOGIN REQUIRED",
      authLike: "LIKE THIS FIT YOU NEED TO BE LOGGED IN.\n\nJOIN THE WEARS ON COMMUNITY, REFLECT YOUR STYLE AND BUILD YOUR ARCHIVE.",
      authComment: "JOIN THE CONVERSATION YOU NEED TO BE LOGGED IN.\n\nJOIN THE WEARS ON COMMUNITY, REFLECT YOUR STYLE AND BUILD YOUR ARCHIVE.",
      authFollow: "FOLLOW THIS ARTIST YOU NEED TO BE LOGGED IN.\n\nJOIN THE WEARS ON COMMUNITY, REFLECT YOUR STYLE AND BUILD YOUR ARCHIVE.",
      authJoin: "LOG IN / JOIN", cancel: "CANCEL", okay: "OKAY",
      comments: "COMMENTS", post: "POST", commentHint: "Pour your thoughts here...",
      noComments: "Be the first to comment!",
      saved: "SAVED FITS", accComments: "COMMENTS", accFollow: "FOLLOWING",
      changePhoto: "CHANGE PHOTO", publicOn: "PUBLIC PROFILE",
      publicDesc: "Allow others to see your archive.",
      logout: "LOG OUT", settings: "SETTINGS",
      noFollow: "NO ARTISTS FOLLOWED.",
      privateEmpty: "Your private feed is empty. Follow artists to curate your archive.",
      forgotSent: "CHECK YOUR EMAIL TO RESET THE PASSWORD.",
      sendReset: "SEND RESET LINK",
      commentsEmpty: "NO COMMENTS YET.",
      legalFooter: "© 2027 RACKSGRID",
      country: "COUNTRY", regionOpt: "CONTENT REGION (OPTIONAL)",
      regionDesc: "Controls the fashion culture and artists in your feed.",
      errorTitle: "ERROR", errorOk: "OKAY",
      editNick: "NICKNAME",
      close: "CLOSE",
    },
    tr: {
      home: "AKIŞ", stars: "YILDIZLAR", news: "DRIP HABER", join: "KATIL", account: "HESAP",
      search: "ARŞİV ARA", hint: "YILDIZ, MARKA, MODEL",
      searchPrompt: "YILDIZ, MARKA VEYA MODEL YAZIN.",
      searchBrands: "MARKALAR", searchPopular: "EN POPÜLER",
      viewAll: "TÜMÜNÜ GÖR",
      global: "GLOBAL", na: "KUZEY AMERİKA", eu: "AVRUPA", as: "ASYA",
      private: "ÖZEL AKIŞ",
      details: "FIT DETAYLARI", item: "1 PARÇA", items: "{n} PARÇA",
      empty: "BU BÖLGEDE İÇERİK YOK",
      feedSub: "THE ARCHIVE.",
      feedDesc: "LOOK’U ÇALIŞ. YILDIZLARI TAKİP ET. ARŞİVİNİ KUR.",
      feedIndex: "CANLI FIT",
      starsSub: "SANATÇILARI KEŞFET.",
      starsDesc: "KÜLTÜRÜ ŞEKİLLENDİREN KÜRATÖR SANATÇI ARŞİVİ. KEŞFET. İNCELE. BAĞLAN.",
      starsIndex: "ARŞİVDE",
      starsEmpty: "BU BÖLGEDE SANATÇI YOK.",
      az: "A-Z", trend: "TRENDING",
      newsSub: "GÜNLÜK DROP.",
      newsDesc: "KÜLTÜRDEN DISPATCH. DROP’U HYPE’LA. LOOK’U BİL.",
      newsIndex: "HABER",
      newsEmpty: "HABER YOK.", newsBy: "YAZAR",
      newsHype: "HYPE’LA", newsHyped: "HYPE’LANDI",
      authHype: "BU HABERİ HYPE’LAMAK İÇİN GİRİŞ YAPMANIZ GEREKİYOR.\n\nTHE WEARS ON TOPLULUĞUNA KATILIN, TARZINIZI YANSITIN, ARŞİVİNİZİ KURUN.",
      buy: "SATIN AL", visiting: "AÇILIYOR",
      plate: "THE WEARS ON ÜYE", artists: "SANATÇI",
      followers: "TAKİPÇİ", fits: "FIT",
      visit: "MAĞAZAYA GİT", sold: "SOLD OUT", exclusive: "EXCLUSIVE",
      inStock: "STOKTA", outStock: "STOK YOK", lowStock: "AZ STOK", friends: "FRIENDS & FAMILY",
      best: "GÜNÜN EN İYİ FİYATI", related: "BUNLARI DA BEĞENEBİLİRSİNİZ",
      lang: "DİL", en: "ENGLISH", tr: "TÜRKÇE",
      legal: "KULLANIM KOŞULLARI", privacy: "GİZLİLİK POLİTİKASI",
      connecting: "BAĞLANILIYOR", none: "SONUÇ YOK.", menu: "MENÜ",
      follow: "TAKİP ET", following: "TAKİP",
      welcomeLine: "MODA. MÜZİK. KÜLTÜR.", welcomeKicker: "THE ARCHIVE",
      joinDek: "MODA, MÜZİK VE KÜLTÜRÜN KÜRATÖR ARŞİVİ. YILDIZLARI TAKİP ET. LOOK’U ÇALIŞ. ARŞİVİNİ KUR.",
      joinFollow: "TAKİP", joinFollowD: "KÜLTÜRÜ ŞEKİLLENDİREN SANATÇILARDAN ÖZEL BİR AKIŞ KUR.",
      joinArchive: "ARŞİV", joinArchiveD: "FIT’LERİ VE PARÇALARI ÇALIŞ. LOOK’U BİL.",
      joinCulture: "KÜLTÜR", joinCultureD: "DRIP HABER’İ HYPE’LA. SOHBETE KATIL.",
      pieces: "PARÇA",
      logIn: "GİRİŞ YAP", create: "HESAP OLUŞTUR", or: "VEYA",
      apple: "APPLE İLE DEVAM ET", google: "GOOGLE İLE DEVAM ET", guest: "MİSAFİR OLARAK DEVAM ET",
      email: "E-POSTA", emailHint: "E-postanızı girin",
      nick: "NICKNAME", nickHint: "3–18 HARF VEYA RAKAM",
      pass: "ŞİFRE", passHint: "Şifre oluşturun", passDesc: "8+ KARAKTER, HARF VE RAKAM",
      remember: "BENİ HATIRLA", forgot: "ŞİFREMİ UNUTTUM?",
      terms1: "Hesap oluşturarak şunları kabul etmiş olursunuz: ", terms2: "Kullanım Koşulları", terms3: " ve ", terms4: "Gizlilik Politikası.",
      errFields: "TÜM ALANLARI DOLDURMANIZ GEREKİYOR.",
      errAuth: "GİRİŞ BAŞARISIZ.", errSignup: "HESAP AÇILAMADI.",
      confirm: "HESABI ONAYLAMAK İÇİN E-POSTANIZI KONTROL EDİN.",
      inUse: "BU E-POSTA ZATEN KAYITLI.",
      nickTaken: "BU NICKNAME ALINMIŞ.", nickInvalid: "3–18 HARF VEYA RAKAM.",
      authTitle: "GİRİŞ GEREKLİ",
      authLike: "BU FIT’İ BEĞENMEK İÇİN GİRİŞ YAPMANIZ GEREKİYOR.\n\nTHE WEARS ON TOPLULUĞUNA KATILIN, TARZINIZI YANSITIN, ARŞİVİNİZİ KURUN.",
      authComment: "SOHBETE KATILMAK İÇİN GİRİŞ YAPMANIZ GEREKİYOR.\n\nTHE WEARS ON TOPLULUĞUNA KATILIN, TARZINIZI YANSITIN, ARŞİVİNİZİ KURUN.",
      authFollow: "BU SANATÇIYI TAKİP ETMEK İÇİN GİRİŞ YAPMANIZ GEREKİYOR.\n\nTHE WEARS ON TOPLULUĞUNA KATILIN, TARZINIZI YANSITIN, ARŞİVİNİZİ KURUN.",
      authJoin: "GİRİŞ / ÜYE OL", cancel: "İPTAL", okay: "TAMAM",
      comments: "YORUMLAR", post: "GÖNDER", commentHint: "Yorumunuzu yazın...",
      noComments: "İlk yorumu siz yapın.",
      saved: "KAYITLI FIT", accComments: "YORUMLAR", accFollow: "TAKİP",
      changePhoto: "FOTOĞRAFI DEĞİŞTİR", publicOn: "HERKESE AÇIK PROFİL",
      publicDesc: "Başkalarının arşivinizi görmesine izin verin.",
      logout: "ÇIKIŞ YAP", settings: "AYARLAR",
      noFollow: "TAKİP EDİLEN SANATÇI YOK.",
      privateEmpty: "Özel akışın boş. Sanatçı takip et, arşivini kur.",
      forgotSent: "ŞİFRE SIFIRLAMAK İÇİN E-POSTANI KONTROL ET.",
      sendReset: "SIFIRLAMA LİNKİ GÖNDER",
      commentsEmpty: "HENÜZ YORUM YOK.",
      legalFooter: "© 2027 RACKSGRID",
      country: "ÜLKE", regionOpt: "İÇERİK BÖLGESİ (OPSİYONEL)",
      regionDesc: "Akışındaki moda kültürünü ve sanatçıları belirler.",
      errorTitle: "HATA", errorOk: "TAMAM",
      editNick: "NICKNAME",
      close: "KAPAT",
    },
  };

  let lastRoute = "";
  let lastReady = false;
  let enterTimer = 0;
  let pulseTimer = 0;
  let pulseBusy = false;
  let pulseBound = false;
  const tallyShown = (() => {
    try {
      const raw = JSON.parse(localStorage.getItem("tw.tally") || "{}");
      return { fits: Number(raw.fits) || 0, news: Number(raw.news) || 0 };
    } catch {
      return { fits: 0, news: 0 };
    }
  })();
  function saveTally() {
    try { localStorage.setItem("tw.tally", JSON.stringify({ fits: tallyShown.fits, news: tallyShown.news })); } catch { /* private */ }
  }
  function padCount(n, width = 2) {
    return String(Math.max(0, Math.round(Number(n) || 0))).padStart(width, "0");
  }
  function digitStrip(d) {
    return `<span class="tally-d"><span class="tally-strip" style="transform:translateY(-${Number(d) * 10}%)">${"0123456789".split("").map((n) => `<span>${n}</span>`).join("")}</span></span>`;
  }
  function tallyBlock(key, to) {
    const stored = tallyShown[key] || 0;
    const target = state.ready ? (Number(to) || 0) : stored;
    const from = stored;
    const width = Math.max(2, String(target).length, String(from).length);
    const shown = padCount(state.ready ? from : target, width);
    return `<b class="tally" data-tally="${esc(key)}" data-to="${target}" aria-label="${padCount(target, width)}">${[...shown].map(digitStrip).join("")}</b>`;
  }
  function setTallyDigits(el, n) {
    const width = Math.max(2, String(n).length, el.querySelectorAll(".tally-d").length);
    const s = padCount(n, width);
    if (el.querySelectorAll(".tally-d").length !== s.length) el.innerHTML = [...s].map(digitStrip).join("");
    el.querySelectorAll(".tally-strip").forEach((strip, i) => {
      strip.style.transform = `translateY(-${Number(s[i]) * 10}%)`;
    });
    el.setAttribute("aria-label", s);
  }
  function glyphLeft(el) {
    const cs = getComputedStyle(el);
    const ctx = document.createElement("canvas").getContext("2d");
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const ch = (el.textContent || "").trim()[0];
    if (!ch) return 0;
    return ctx.measureText(ch).actualBoundingBoxLeft || 0;
  }
  function bindMastAlign(root) {
    const k = root.querySelector(".stars-lockup .kicker");
    const h = root.querySelector(".stars-lockup .display-title");
    if (!k || !h) return;
    const run = () => {
      k.style.marginLeft = "0px";
      const delta = (h.getBoundingClientRect().left + glyphLeft(h)) - (k.getBoundingClientRect().left + glyphLeft(k));
      if (Number.isFinite(delta) && Math.abs(delta) < 8) k.style.marginLeft = `${delta}px`;
    };
    run();
    if (document.fonts && document.fonts.status !== "loaded") document.fonts.ready.then(run);
  }
  function bindTallies(root) {
    root.querySelectorAll(".tally").forEach((el) => {
      if (!state.ready) return;
      const key = el.getAttribute("data-tally");
      const to = Number(el.getAttribute("data-to") || 0);
      const from = tallyShown[key] || 0;
      const wrap = el.closest(".stars-count");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (from === to) {
        el.style.setProperty("--tally-t", "0s");
        setTallyDigits(el, to);
        wrap?.classList.remove("is-tick");
        return;
      }
      el.style.setProperty("--tally-t", `${Math.min(1.05, 0.42 + Math.abs(to - from) * 0.07)}s`);
      setTallyDigits(el, from);
      const go = () => {
        if (to > from) wrap?.classList.add("is-tick");
        setTallyDigits(el, to);
        tallyShown[key] = to;
        saveTally();
        window.setTimeout(() => wrap?.classList.remove("is-tick"), 720);
      };
      tallyShown[key] = to;
      saveTally();
      if (reduce) go();
      else requestAnimationFrame(() => requestAnimationFrame(go));
    });
  }

  const state = {
    lang: localStorage.getItem("tw.lang") === "tr" ? "tr" : "en",
    region: "Global",
    privateFeed: false,
    starRegion: "ALL",
    trending: false,
    artists: [],
    fits: [],
    pieces: [],
    news: [],
    ready: false,
    fail: false,
    session: null,
    me: null,
    liked: new Set(),
    followed: new Set(),
    likeCounts: {},
    comments: {},
    hyped: new Set(),
    hypeCounts: {},
    remember: true,
    authErr: "",
    busy: false,
    country: localStorage.getItem("tw.country") || "United States",
    contentRegion: localStorage.getItem("tw.contentRegion") || "Global",
    passShown: false,
    searchQ: "",
    searchSort: "az",
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const t = (k) => copy[state.lang][k] || copy.en[k] || k;
  const esc = (s) => String(s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const up = (s) => String(s ?? "").trim().toUpperCase();
  const logged = () => !!(state.session && state.session.access_token);

  function nickOf(raw) {
    let s = String(raw || "").trim().toUpperCase();
    while (s.startsWith("@")) s = s.slice(1).trim().toUpperCase();
    s = s.replace(/İ/g, "I").replace(/Ş/g, "S").replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ö/g, "O").replace(/Ç/g, "C");
    return s.replace(/[^A-Z0-9]/g, "");
  }
  const nickOk = (n) => /^[A-Z0-9]{3,18}$/.test(n);

  function money(n) {
    if (n == null || n === "") return "—";
    const num = Number(n);
    if (!Number.isFinite(num)) return String(n);
    const d = Math.round(num).toString();
    let out = "$";
    for (let i = 0; i < d.length; i++) {
      out += d[i];
      const left = d.length - i - 1;
      if (left > 0 && left % 3 === 0) out += ".";
    }
    return out;
  }

  function asList(v) {
    if (v == null || v === "") return [];
    if (Array.isArray(v)) return v;
    const s = String(v).trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try { const j = JSON.parse(s); if (Array.isArray(j)) return j; } catch {}
      try { const j = JSON.parse(s.replace(/'/g, '"')); if (Array.isArray(j)) return j; } catch {}
    }
    return [s];
  }

  function photos(row, max = 3) {
    const out = [];
    const add = (v) => {
      if (v == null) return;
      if (Array.isArray(v)) { v.forEach(add); return; }
      let s = String(v).trim();
      if (!s || s === "null") return;
      if (s.startsWith("[") && s.endsWith("]")) { asList(s).forEach(add); return; }
      if (!out.includes(s) && out.length < max) out.push(s);
    };
    add(row.image_urls || row.imageUrls);
    add(row.image_url || row.imageUrl);
    add(row.photos);
    add(row.photo_url);
    return out;
  }
  function imgTag(url, alt, attrs = "") {
    const orig = String(url || "").trim();
    if (!orig) return "";
    const extra = attrs ? ` ${attrs}` : "";
    return `<img src="${esc(orig)}" alt="${esc(alt || "")}" decoding="async" draggable="false"${extra}>`;
  }
  function newsPlateClass(url) {
    return /\.(png|webp)(?:$|\?|#)/i.test(String(url || "")) ? "is-cutout" : "is-fill";
  }
  function asVault(v) {
    if (v === true || v === 1) return true;
    const s = String(v ?? "").trim().toLowerCase();
    return s === "true" || s === "t" || s === "1";
  }
  function stamp(row) {
    const raw = row.created_at || row.createdAt || row.date || row.updated_at;
    const d = raw ? new Date(raw) : null;
    return d && !Number.isNaN(d.valueOf()) ? d : null;
  }
  function ago(d) {
    if (!d) return "";
    const s = Math.max(1, Math.floor((Date.now() - d.getTime()) / 1000));
    if (s < 60) return `${s} SECS AGO`;
    if (s < 3600) return `${Math.floor(s / 60)} MINS AGO`;
    if (s < 86400) return `${Math.floor(s / 3600)} HOURS AGO`;
    if (s < 604800) return `${Math.floor(s / 86400)} DAYS AGO`;
    return d.toLocaleDateString(state.lang === "tr" ? "tr-TR" : "en-GB", { day: "numeric", month: "short" }).toUpperCase();
  }
  function continent(region) {
    if (region === "TR" || region === "EU") return "Europe";
    if (region === "ASIA") return "Asia";
    if (region === "AFRICA") return "Global";
    return "North America";
  }
  function regionForCountry(country) {
    const c = up(country).replace(/İ/g, "I");
    if (/TURK|TURKIYE|TÜRKIYE|^TR$/.test(c)) return "TR";
    if (/UNITED KINGDOM|ENGLAND|BRITAIN|FRANCE|GERMANY|ITALY|SPAIN|EUROPE|^EU$|^UK$/.test(c)) return "EU";
    if (/CANADA/.test(c)) return "CANADA";
    if (/NIGERIA|GHANA|AFRICA/.test(c)) return "AFRICA";
    if (/JAPAN|CHINA|KOREA|HONG KONG|TAIWAN|ASIA/.test(c)) return "ASIA";
    if (/UNITED STATES|^USA$|^US$/.test(c)) return "USA";
    return "";
  }
  function mapArtist(row) {
    const name = up(row.name);
    const country = up(row.country || row.nation);
    let region = up(row.region);
    if (!["USA", "TR", "EU", "CANADA", "ASIA", "AFRICA", "ALL"].includes(region)) region = regionForCountry(country);
    if (!region) region = "ALL";
    const ig = String(row.instagram || row.ig || "").replace(/^@/, "");
    return {
      id: String(row.id || ""),
      name,
      country,
      region,
      continent: continent(region),
      imageUrl: row.image_url || row.imageUrl || "",
      instagram: ig,
    };
  }
  function mapFit(row, byId) {
    const artistId = String(row.artist_id || row.artistId || "");
    const guestId = String(row.guest_artist_id || row.guestArtistId || "");
    const pics = photos(row);
    const title = String(row.title || "");
    const tag = String(row.tag || "");
    const artistName = byId[artistId] || up(row.artist || row.artist_name);
    const guestName = guestId && byId[guestId] && byId[guestId] !== artistName ? byId[guestId] : "";
    return {
      id: String(row.id || ""),
      artistId,
      artistName,
      guestArtistId: guestId,
      guestArtistName: guestName,
      imageUrl: pics[0] || "",
      imageUrls: pics,
      title,
      tag,
      date: stamp(row),
      isVault: asVault(row.is_vault),
      isStory: title.toUpperCase().includes("STORY") || tag.toUpperCase() === "STORY",
    };
  }
  function mapPiece(row) {
    return {
      id: String(row.id || ""),
      outfitId: String(row.outfit_id || row.outfitId || ""),
      artistId: String(row.artist_id || row.artistId || ""),
      brand: up(row.brand || "BRAND"),
      name: up(row.title || "ITEM"),
      colorway: up(row.color || row.colorway),
      price: money(row.price),
      imageUrl: row.image_url || row.imageUrl || "",
      logoUrl: row.logo_url || row.logoUrl || row.brand_logo || row.brandLogo || "",
      purchaseUrl: row.purchase_url || row.purchaseUrl || "",
      listings: row.listings,
      availability: String(row.availability || row.access || ""),
      isVault: asVault(row.is_vault) || String(row.archive_id || row.archiveId || "").length > 0,
    };
  }
  function mapNews(row) {
    const pics = photos(row, 5);
    return {
      id: String(row.id || ""),
      category: up(row.category || "CULTURE"),
      title: row.title || "",
      dek: row.dek || row.description || "",
      body: row.body || row.content || "",
      source: up(row.source || "THE WEARS EDITORIAL"),
      imageUrl: pics[0] || "",
      photos: pics,
      createdAt: stamp(row),
      productName: up(row.product_name || row.productName),
      releaseDate: up(row.release_date || row.releaseDate),
      buyUrl: String(row.buy_url || row.buyUrl || "").trim(),
      buyNote: up(row.buy_note || row.buyNote),
      sku: up(row.sku),
    };
  }

  function headers(extra = {}) {
    const token = state.session?.access_token || KEY;
    return { apikey: KEY, Authorization: `Bearer ${token}`, ...extra };
  }

  async function sb(table, qs, opt = {}) {
    const r = await fetch(`${SB}/rest/v1/${table}?${qs}`, {
      method: opt.method || "GET",
      headers: headers({
        ...(opt.body ? { "Content-Type": "application/json" } : {}),
        ...(opt.prefer ? { Prefer: opt.prefer } : { Range: "0-999" }),
      }),
      body: opt.body ? JSON.stringify(opt.body) : undefined,
    });
    if (r.status === 401 && state.session) {
      const ok = await refreshSession();
      if (ok) return sb(table, qs, opt);
    }
    if (!r.ok) throw new Error(`${table}:${r.status}`);
    const text = await r.text();
    return text ? JSON.parse(text) : null;
  }

  async function rpc(name, body = {}) {
    const r = await fetch(`${SB}/rest/v1/rpc/${name}`, {
      method: "POST",
      headers: headers({ "Content-Type": "application/json" }),
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(name);
    return r.json();
  }

  async function auth(path, body) {
    const r = await fetch(`${SB}/auth/v1/${path}`, {
      method: "POST",
      headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw Object.assign(new Error(data.error_description || data.msg || data.error || "auth"), { data, status: r.status });
    return data;
  }

  function saveSession(sess) {
    if (!sess || !sess.access_token) { clearSession(); return; }
    const expires = Date.now() + (Number(sess.expires_in || 3600) * 1000);
    state.session = { access_token: sess.access_token, refresh_token: sess.refresh_token, expires_at: expires, user: sess.user || state.session?.user };
    if (state.remember) localStorage.setItem("tw.session", JSON.stringify(state.session));
    else sessionStorage.setItem("tw.session", JSON.stringify(state.session));
  }
  function clearSession() {
    state.session = null;
    state.me = null;
    state.liked = new Set();
    state.followed = new Set();
    localStorage.removeItem("tw.session");
    sessionStorage.removeItem("tw.session");
  }
  function restoreSession() {
    try {
      const raw = localStorage.getItem("tw.session") || sessionStorage.getItem("tw.session");
      if (raw) state.session = JSON.parse(raw);
    } catch { state.session = null; }
  }

  async function refreshSession() {
    if (!state.session?.refresh_token) return false;
    try {
      const data = await auth("token?grant_type=refresh_token", { refresh_token: state.session.refresh_token });
      saveSession(data);
      return true;
    } catch {
      clearSession();
      return false;
    }
  }

  async function hydrateMe() {
    if (!logged()) return;
    try {
      const r = await fetch(`${SB}/auth/v1/user`, { headers: headers() });
      if (!r.ok) throw new Error("user");
      const user = await r.json();
      state.session.user = user;
      let row = {};
      try {
        const rows = await sb("users", `select=id,username,profile_image_url,is_public,is_premium,is_banned,created_at&id=eq.${user.id}`);
        row = rows?.[0] || {};
      } catch {
        try {
          const rows = await sb("wears_public_nicks", `select=id,username,profile_image_url,is_public,is_premium&id=eq.${user.id}`);
          row = rows?.[0] || {};
        } catch { row = {}; }
      }
      if (row.is_banned === true) { await signOut(); return; }
      state.me = {
        id: user.id,
        email: user.email || "",
        username: nickOf(row.username || user.email?.split("@")[0] || ""),
        avatar: row.profile_image_url || "",
        isPublic: row.is_public !== false,
        isPremium: row.is_premium === true || row.is_premium === "true",
      };
      await Promise.all([pullMyLikes(), pullMyFollows(), pullHypes()]);
    } catch {
      /* keep token; catalog still works */
    }
  }

  async function pullMyLikes() {
    if (!logged()) return;
    try {
      const rows = await sb("user_liked_outfits", `select=outfit_id&user_id=eq.${state.me.id}`);
      state.liked = new Set((rows || []).map((r) => String(r.outfit_id)));
    } catch { /* rls */ }
  }
  async function pullMyFollows() {
    if (!logged()) return;
    try {
      const rows = await sb("user_follows_artist", `select=artist_id&user_id=eq.${state.me.id}`);
      const names = new Set();
      for (const r of rows || []) {
        const a = state.artists.find((x) => x.id === String(r.artist_id));
        if (a) names.add(a.name);
      }
      state.followed = names;
    } catch { /* rls */ }
  }
  async function pullLikeCounts() {
    try {
      const rows = await rpc("wears_outfit_like_counts");
      const map = {};
      for (const row of rows || []) {
        const id = String(row.outfit_id || row.outfitId || "");
        if (id) map[id] = Number(row.likes || 0);
      }
      state.likeCounts = map;
    } catch {
      try {
        const rows = await sb("user_liked_outfits", "select=outfit_id");
        const map = {};
        for (const r of rows || []) {
          const id = String(r.outfit_id);
          map[id] = (map[id] || 0) + 1;
        }
        if (Object.values(map).every((n) => n <= 1) && Object.keys(state.likeCounts).length) return;
        state.likeCounts = map;
      } catch { /* empty */ }
    }
  }
  async function pullHypes() {
    try {
      const rows = await sb("drip_news_hypes", "select=news_id,user_id");
      const counts = {};
      const mine = new Set();
      const uid = state.me?.id;
      for (const r of rows || []) {
        const id = String(r.news_id || "");
        if (!id) continue;
        counts[id] = (counts[id] || 0) + 1;
        if (uid && String(r.user_id) === uid) mine.add(id);
      }
      state.hypeCounts = counts;
      if (uid) state.hyped = mine;
    } catch { /* rls / missing table */ }
  }
  async function pullComments(ids) {
    const want = [...new Set(ids.filter(Boolean))];
    if (!want.length) return;
    const q = `select=id,user_id,text,created_at,outfit_id,username,avatar_url&outfit_id=in.(${want.join(",")})&order=created_at.desc`;
    try {
      const rows = await sb("comments", q);
      for (const id of want) state.comments[id] = [];
      for (const row of rows || []) {
        const id = String(row.outfit_id);
        (state.comments[id] ||= []).push({
          id: String(row.id),
          userId: String(row.user_id),
          text: row.text || "",
          at: stamp(row),
          name: nickOf(row.username) || "MEMBER",
          avatar: row.avatar_url || "",
        });
      }
    } catch {
      try {
        const rows = await sb("comments", `select=id,user_id,text,created_at,outfit_id&outfit_id=in.(${want.join(",")})&order=created_at.desc`);
        for (const id of want) state.comments[id] = [];
        for (const row of rows || []) {
          const id = String(row.outfit_id);
          (state.comments[id] ||= []).push({
            id: String(row.id),
            userId: String(row.user_id),
            text: row.text || "",
            at: stamp(row),
            name: "MEMBER",
            avatar: "",
          });
        }
      } catch { /* none */ }
    }
  }

  async function load() {
    try {
      const [artists, outfits, items, news] = await Promise.all([
        sb("artists", "select=*"),
        sb("outfits", "select=*"),
        sb("items", "select=*"),
        sb("drip_news", "select=*&order=created_at.desc").catch(() => []),
      ]);
      const mappedA = artists.map(mapArtist).sort((a, b) => a.name.localeCompare(b.name));
      state.artists = mappedA;
      applyFits(outfits);
      state.pieces = items.map(mapPiece).filter((p) => !p.isVault);
      state.news = (news || []).map(mapNews);
      state.ready = true;
      state.fail = false;
      await Promise.all([
        pullLikeCounts(),
        pullHypes(),
        pullComments(state.fits.slice(0, 24).map((f) => f.id)),
        logged() ? pullMyFollows() : null,
      ]);
    } catch {
      state.ready = true;
      state.fail = true;
    }
    render();
    startPulse();
  }

  function catalogIds(rows) {
    return (rows || []).map((r) => r.id).join("\0");
  }
  function applyFits(outfits) {
    const byId = Object.fromEntries(state.artists.map((a) => [a.id, a.name]));
    state.fits = outfits.map((r) => mapFit(r, byId)).filter((f) => !f.isVault && !f.isStory).sort((a, b) => (b.date || 0) - (a.date || 0));
  }
  async function pulseCatalog() {
    if (pulseBusy || !state.ready || document.hidden) return;
    pulseBusy = true;
    try {
      const [outfits, news] = await Promise.all([
        sb("outfits", "select=*"),
        sb("drip_news", "select=*&order=created_at.desc").catch(() => null),
      ]);
      const prevFits = catalogIds(state.fits);
      const prevNews = catalogIds(state.news);
      applyFits(outfits);
      if (news) state.news = (news || []).map(mapNews);
      const fitsChanged = catalogIds(state.fits) !== prevFits;
      const newsChanged = catalogIds(state.news) !== prevNews;
      if (!fitsChanged && !newsChanged) return;
      if (fitsChanged) {
        try {
          const items = await sb("items", "select=*");
          state.pieces = items.map(mapPiece).filter((p) => !p.isVault);
        } catch { /* keep pieces */ }
        pullLikeCounts();
        pullComments(state.fits.slice(0, 24).map((f) => f.id));
      }
      const path = hash().path;
      if ((fitsChanged && !path) || (newsChanged && path === "news")) render();
    } catch { /* keep */ }
    finally { pulseBusy = false; }
  }
  function startPulse() {
    window.clearInterval(pulseTimer);
    pulseTimer = window.setInterval(pulseCatalog, 20000);
    if (!pulseBound) {
      pulseBound = true;
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) pulseCatalog();
      });
    }
  }

  function artistByName(name) {
    const n = up(name);
    return state.artists.find((a) => a.name === n);
  }
  function fitArtists(fit) {
    const names = [];
    if (fit?.artistName) names.push(fit.artistName);
    if (fit?.guestArtistName && fit.guestArtistName !== fit.artistName) names.push(fit.guestArtistName);
    return names;
  }
  function fitHasArtist(fit, name) {
    const n = up(name);
    return fitArtists(fit).some((x) => x === n);
  }
  function fitsForArtist(name) {
    const n = up(name);
    return state.fits.filter((f) => fitHasArtist(f, n));
  }
  function piecesForFit(id) {
    if (!id) return [];
    return state.pieces.filter((p) => p.outfitId === id);
  }
  function feedFits() {
    return state.fits.filter((f) => {
      const names = fitArtists(f);
      if (!names.length) return false;
      if (state.privateFeed) return names.some((n) => state.followed.has(n));
      if (state.region === "Global") return true;
      return names.some((n) => artistByName(n)?.continent === state.region);
    });
  }

  function hash() {
    const h = (location.hash || "#/").replace(/^#/, "");
    if (h.includes("access_token=")) return { path: "", id: "" };
    const parts = h.split("/").filter(Boolean);
    return { path: parts[0] || "", id: decodeURIComponent(parts.slice(1).join("/") || "") };
  }
  function go(to) {
    if (location.hash === to) render();
    else location.hash = to;
  }

  function ava(url, name, cls = "ava") {
    const letter = (name || "?").replace(/[^A-Z0-9]/g, "").slice(0, 2) || "?";
    const size = cls.includes("xl") ? " xl" : cls.includes("lg") ? " lg" : "";
    if (url) return `<span class="ava${size}"><img src="${esc(url)}" alt=""></span>`;
    return `<span class="mark${size}">${esc(letter)}</span>`;
  }

  function bfield(label, name, type, placeholder, icon, extra = "") {
    return `<div class="bfield">
      <div>
        <label>${esc(label)}</label>
        <input name="${esc(name)}" type="${esc(type)}" placeholder="${esc(placeholder)}" ${extra}>
      </div>
      ${icon}
    </div>`;
  }

  function selectField(label, key, value) {
    return `<button class="select-field" type="button" data-pick="${esc(key)}">
      <span><em>${esc(label)}</em><strong>${esc(value).toUpperCase()}</strong></span>${I.fwd}
    </button>`;
  }

  function errorDlg(msg) {
    showDlg(`
      <h2>${I.warn} ${t("errorTitle")}</h2>
      <p>${esc(msg)}</p>
      <div class="dlg-actions">
        <button class="fill" type="button" data-close-dlg>${t("errorOk")}</button>
      </div>
    `);
  }

  function snack(msg) {
    $(".snack")?.remove();
    const el = document.createElement("div");
    el.className = "snack";
    el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function showSheet(html) {
    const el = $("#sheet");
    el.hidden = false;
    el.innerHTML = `<div class="sheet-card">${html}</div>`;
    el.onclick = (e) => {
      if (e.target === el || e.target.closest("[data-close]")) hideSheet();
    };
  }
  function hideSheet() {
    const el = $("#sheet");
    el.hidden = true;
    el.innerHTML = "";
  }
  function showDlg(html) {
    const el = $("#dlg");
    el.hidden = false;
    el.innerHTML = `<div class="dlg-card">${html}</div>`;
    el.onclick = (e) => { if (e.target === el) el.hidden = true; };
  }
  function hideDlg() { $("#dlg").hidden = true; $("#dlg").innerHTML = ""; }

  function needAuth(kind) {
    const body = kind === "comment" ? t("authComment") : kind === "follow" ? t("authFollow") : kind === "hype" ? t("authHype") : t("authLike");
    showDlg(`
      <h2>${I.key} ${t("authTitle")}</h2>
      <p>${esc(body).replace(/\n/g, "<br>")}</p>
      <div class="dlg-actions">
        <button class="ghost" type="button" data-close-dlg>${t("cancel")}</button>
        <button class="fill" type="button" data-go="#/join">${t("authJoin")}</button>
      </div>
    `);
  }

  function openDrawer() {
    const el = $("#drawer");
    if (!el) return;
    el.hidden = false;
    $("#btnMenu")?.setAttribute("aria-expanded", "true");
    paintChrome();
  }
  function closeDrawer() {
    const el = $("#drawer");
    if (!el) return;
    el.hidden = true;
    $("#btnMenu")?.setAttribute("aria-expanded", "false");
  }

  function searchRank(text, qFold) {
    if (!qFold) return 99;
    if (nickOf(text).startsWith(qFold)) return 0;
    for (const part of String(text || "").split(/[\s,;:|/\\+._\-]+/)) {
      if (!part) continue;
      if (nickOf(part).startsWith(qFold)) return 1;
    }
    return 99;
  }
  function searchHit(text, qFold) { return searchRank(text, qFold) < 99; }
  function searchAlpha(a, b) { return nickOf(a).localeCompare(nickOf(b)); }
  function modelKey(p) { return `${nickOf(p.brand)}|${nickOf(p.name)}|${nickOf(p.colorway)}`; }
  function brandLetters(name) {
    const parts = up(name).replace(/\$/g, "").split(/\s+/).filter(Boolean);
    if (!parts.length) return "—";
    if (parts.length === 1) return parts[0].slice(0, Math.min(2, parts[0].length));
    return `${parts[0][0]}${parts[1][0]}`;
  }
  const BRAND_DOMAINS = {
    NIKE: "nike.com", JORDAN: "jordan.com", ADIDAS: "adidas.com", YEEZY: "adidas.com",
    PUMA: "puma.com", "NEW BALANCE": "newbalance.com", ASICS: "asics.com", SALOMON: "salomon.com",
    CONVERSE: "converse.com", VANS: "vans.com", REEBOK: "reebok.com",
    "THE NORTH FACE": "thenorthface.com", ARCTERYX: "arcteryx.com", "ARC'TERYX": "arcteryx.com",
    MONCLER: "moncler.com", "STONE ISLAND": "stoneisland.com",
    GUCCI: "gucci.com", "LOUIS VUITTON": "louisvuitton.com", LV: "louisvuitton.com",
    DIOR: "dior.com", CHANEL: "chanel.com", PRADA: "prada.com", "MIU MIU": "miumiu.com",
    HERMES: "hermes.com", FENDI: "fendi.com", VERSACE: "versace.com", BALENCIAGA: "balenciaga.com",
    "SAINT LAURENT": "ysl.com", YSL: "ysl.com", CELINE: "celine.com", LOEWE: "loewe.com",
    "BOTTEGA VENETA": "bottegaveneta.com", BURBERRY: "burberry.com", VALENTINO: "valentino.com",
    "OFF WHITE": "off---white.com", "OFF-WHITE": "off---white.com",
    "CHROME HEARTS": "www.chromehearts.com", SUPREME: "supreme.com", STUSSY: "stussy.com",
    BAPE: "bape.com", "FEAR OF GOD": "fearofgod.com", AMIRI: "amiri.com",
    DIESEL: "diesel.com", KAPITAL: "kapital.jp", CARTIER: "cartier.com",
    "RALPH LAUREN": "ralphlauren.com", "CALVIN KLEIN": "calvinklein.com",
    "COMME DES GARCONS": "comme-des-garcons.com", "VIVIENNE WESTWOOD": "viviennewestwood.com",
    SICKO: "sicko.com",
  };
  const BRAND_LOGO_DIRECT = {
    CHROMEHEARTS: "https://www.chromehearts.com/on/demandware.static/Sites-ChromeHearts-Site/-/default/dwde49e956/images/favicons/apple-touch-icon.png",
  };
  const brandDomainNick = Object.fromEntries(Object.entries(BRAND_DOMAINS).map(([k, d]) => [nickOf(k), d]));
  function brandLogoUrls(brand) {
    const key = nickOf(brand);
    const urls = [];
    const add = (u) => {
      const v = String(u || "").trim();
      if (/^https?:\/\//.test(v) && !urls.includes(v)) urls.push(v);
    };
    for (const p of state.pieces) {
      if (nickOf(p.brand) === key) add(p.logoUrl);
    }
    add(BRAND_LOGO_DIRECT[key]);
    let domain = brandDomainNick[key];
    if (!domain) {
      let best = "";
      for (const [k, d] of Object.entries(brandDomainNick)) {
        if (k && key.includes(k) && k.length > best.length) { best = k; domain = d; }
      }
    }
    if (domain) {
      const host = domain.replace(/^www\./, "");
      add(`https://cdn.brandfetch.io/${host}/w/400/h/400/theme/light/icon.jpeg`);
      add(`https://www.google.com/s2/favicons?sz=256&domain=${domain}`);
    }
    return urls;
  }
  function brandMark(name, size) {
    const letters = brandLetters(name);
    const urls = brandLogoUrls(name);
    const img = urls.length
      ? `<img src="${esc(urls[0])}" alt="" referrerpolicy="no-referrer" data-brand-logo="${esc(urls.join("|"))}">`
      : "";
    return `<span class="bmark${size === "lg" ? " lg" : ""}${urls.length ? " is-letters" : ""}">${img}${esc(letters)}</span>`;
  }
  function bindBrandMarks(root = document) {
    root.querySelectorAll("img[data-brand-logo]").forEach((img) => {
      if (img.dataset.bound) return;
      img.dataset.bound = "1";
      const urls = String(img.dataset.brandLogo || "").split("|").filter(Boolean);
      let i = 0;
      const box = img.closest(".bmark");
      const ok = () => box?.classList.remove("is-letters");
      img.addEventListener("load", ok);
      if (img.complete && img.naturalWidth) ok();
      img.addEventListener("error", () => {
        i += 1;
        if (i < urls.length) img.src = urls[i];
        else {
          img.remove();
          box?.classList.add("is-letters");
        }
      });
    });
  }
  function uniqueByModel(list) {
    const seen = new Set();
    const out = [];
    for (const p of list) {
      const k = modelKey(p);
      if (seen.has(k)) continue;
      seen.add(k);
      out.push(p);
    }
    return out;
  }
  function countLabel(n) {
    return n === 1 ? t("item") : t("items").replace("{n}", String(n));
  }
  function starHits(qFold) {
    const stars = state.artists.filter((a) => searchHit(a.name, qFold));
    stars.sort((a, b) => {
      if (state.searchSort === "popular") {
        const d = fitsForArtist(b.name).length - fitsForArtist(a.name).length;
        if (d) return d;
      }
      const ra = searchRank(a.name, qFold);
      const rb = searchRank(b.name, qFold);
      if (ra !== rb) return ra - rb;
      return searchAlpha(a.name, b.name);
    });
    return stars;
  }
  function brandHits(qFold) {
    const catalog = state.pieces;
    const matchedBrands = new Set();
    const matchedKeys = new Set();
    for (const piece of catalog) {
      if (searchHit(piece.brand, qFold)) matchedBrands.add(piece.brand);
      const color = piece.colorway && !piece.colorway.includes("#") ? piece.colorway : "";
      if (searchHit(piece.name, qFold) || (color && searchHit(color, qFold))) matchedKeys.add(modelKey(piece));
    }
    const groups = [];
    const seenBrand = new Set();
    for (const piece of catalog) {
      const brand = piece.brand;
      if (seenBrand.has(brand)) continue;
      seenBrand.add(brand);
      const brandHit = matchedBrands.has(brand);
      const all = catalog.filter((p) => p.brand === brand);
      const models = [];
      const seenModel = new Set();
      for (const p of all) {
        const key = modelKey(p);
        if (seenModel.has(key)) continue;
        if (!brandHit && !matchedKeys.has(key)) continue;
        seenModel.add(key);
        models.push(p);
      }
      if (!models.length) continue;
      models.sort((a, b) => {
        if (state.searchSort === "popular") {
          const ca = all.filter((p) => modelKey(p) === modelKey(a)).length;
          const cb = all.filter((p) => modelKey(p) === modelKey(b)).length;
          if (ca !== cb) return cb - ca;
        }
        return searchAlpha(a.name, b.name);
      });
      groups.push({ brand, popularity: all.length, models: models.slice(0, 8), total: uniqueByModel(all).length });
    }
    groups.sort((a, b) => {
      if (state.searchSort === "popular" && a.popularity !== b.popularity) return b.popularity - a.popularity;
      const ra = searchRank(a.brand, qFold);
      const rb = searchRank(b.brand, qFold);
      if (ra !== rb) return ra - rb;
      return searchAlpha(a.brand, b.brand);
    });
    return groups;
  }
  function searchHitsHtml() {
    const qFold = nickOf(state.searchQ);
    if (!qFold) return `<p class="empty">${t("searchPrompt")}</p>`;
    const stars = starHits(qFold);
    const brands = brandHits(qFold);
    if (!stars.length && !brands.length) return `<p class="empty">${t("none")}</p>`;
    const starBlock = stars.length ? `<div class="search-col">
      <p class="search-sec">${t("stars")}</p>
      ${stars.map((a) => `<button class="search-star" type="button" data-go="#/s/${encodeURIComponent(a.name)}">
        ${ava(a.imageUrl, a.name)}
        <span class="search-star-copy"><b>${esc(a.name)}</b></span>
        ${a.country ? `<em>${esc(a.country)}</em>` : ""}
      </button>`).join("")}
    </div>` : "";
    const brandBlock = brands.length ? `<div class="search-col">
      <p class="search-sec">${t("searchBrands")}</p>
      ${brands.map((g) => `
        <button class="search-brand" type="button" data-go="#/b/${encodeURIComponent(g.brand)}">
          ${brandMark(g.brand)}
          <span class="search-brand-copy"><b>${esc(g.brand)}</b><em>${esc(countLabel(g.total))}</em></span>
          ${I.fwd}
        </button>
        ${g.models.map((p) => `<button class="search-model" type="button" data-go="#/p/${encodeURIComponent(p.id)}">
          <span>${esc(p.name)}</span><b>${esc(p.price)}</b>
        </button>`).join("")}
        <button class="search-all" type="button" data-go="#/b/${encodeURIComponent(g.brand)}">${t("viewAll")}</button>
      `).join("")}
    </div>` : "";
    return `<div class="search-board${stars.length && brands.length ? " is-split" : ""}">${starBlock}${brandBlock}</div>`;
  }
  function searchPage() {
    const azOn = state.searchSort !== "popular";
    return `<div class="search-page">
      <header class="search-head">
        <button class="sq" type="button" data-back>${I.back}</button>
        <h1>${t("search")}</h1>
        <span class="search-head-gap" aria-hidden="true"></span>
      </header>
      <input id="q" class="search-input" type="search" autocomplete="off" spellcheck="false" placeholder="${esc(t("hint"))}" value="${esc(state.searchQ)}">
      <div class="sort search-sort">
        <button type="button" class="${azOn ? "" : "is-on"}" data-search-sort="popular">${t("searchPopular")}</button>
        <button type="button" class="${azOn ? "is-on" : ""}" data-search-sort="az">${t("az")}</button>
      </div>
      <div id="hits" class="search-hits">${searchHitsHtml()}</div>
    </div>`;
  }
  function searchUI() { hideSheet(); go("#/search"); }
  function bindSearch() {
    const input = $("#q");
    if (!input) return;
    input.addEventListener("input", () => {
      state.searchQ = input.value;
      const hits = $("#hits");
      if (hits) {
        hits.innerHTML = searchHitsHtml();
        bindBrandMarks(hits);
      }
    });
    const active = document.activeElement;
    if (!active || active === document.body || active.id === "btnSearch" || active.id === "btnSearchDrawer") {
      setTimeout(() => input.focus(), 30);
    }
  }
  function archiveCard(p) {
    return `<button class="acard" type="button" data-go="#/p/${encodeURIComponent(p.id)}">
      <div class="acard-pic">${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="">` : ""}</div>
      <div class="acard-copy">
        <em>${esc(p.brand)}</em>
        <strong>${esc(p.name)}</strong>
        <b>${esc(p.price)}</b>
      </div>
    </button>`;
  }
  function brandPage(id) {
    const key = nickOf(id);
    const all = uniqueByModel(state.pieces.filter((p) => nickOf(p.brand) === key)).sort((a, b) => searchAlpha(a.name, b.name));
    if (!all.length) return `<p class="empty">${t("none")}</p>`;
    const brand = all[0].brand;
    return `<div class="brand-page">
      <div class="back-row"><button class="sq" type="button" data-back>${I.back}</button></div>
      <article class="plate">
        <header class="plate-head">${t("searchBrands")}</header>
        <div class="plate-body">
          ${brandMark(brand, "lg")}
          <h1>${esc(brand)}</h1>
          <span class="stamp">${esc(countLabel(all.length))}</span>
        </div>
      </article>
      <div class="brand-grid ${all.length === 1 ? "is-1" : all.length === 2 ? "is-2" : "is-many"}">${all.map(archiveCard).join("")}</div>
    </div>`;
  }

  function pieceCard(p) {
    return `<button class="pcard" type="button" data-go="#/p/${encodeURIComponent(p.id)}">
      <div class="pcard-pic">${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="">` : ""}</div>
      <div class="pcard-copy">
        <em>${esc(p.brand)}</em>
        <strong>${esc(p.name)}</strong>
      </div>
      <span class="pcard-price">${esc(p.price)}</span>
    </button>`;
  }
  function carouselNav(n) {
    if (n < 2) return "";
    return `<button class="photo-nav prev" type="button" data-car-step="-1" aria-label="Previous">${I.prev}</button>
      <button class="photo-nav next" type="button" data-car-step="1" aria-label="Next">${I.next}</button>
      <span class="photo-count">1/${n}</span>
      <div class="dots">${Array.from({ length: n }, (_, i) => `<i class="${i ? "" : "on"}" data-car-to="${i}"></i>`).join("")}</div>`;
  }
  function carousel(urls, alt, likeId) {
    if (!urls.length) return `<div class="photo"></div>`;
    const slides = urls.map((u, i) => imgTag(u, alt, `data-i="${i}"${i ? " hidden" : ' fetchpriority="high"'}`)).join("");
    return `<div class="photo" data-car="${urls.length}"${likeId ? ` data-dblike="${esc(likeId)}"` : ""}>${slides}${carouselNav(urls.length)}</div>`;
  }
  function bindCarousel(root) {
    root.querySelectorAll("[data-car]").forEach((el) => {
      const imgs = [...el.querySelectorAll("img")];
      if (imgs.length < 2) return;
      const dots = [...el.querySelectorAll(".dots i")];
      const count = el.querySelector(".photo-count");
      let i = 0;
      const onChrome = (node) => node && node.closest(".photo-nav, [data-car-step], [data-car-to], .dots");
      const show = (n) => {
        i = (n + imgs.length) % imgs.length;
        imgs.forEach((im, k) => { im.hidden = k !== i; });
        dots.forEach((d, k) => d.classList.toggle("on", k === i));
        if (count) count.textContent = `${i + 1}/${imgs.length}`;
      };
      el.addEventListener("click", (e) => {
        if (!onChrome(e.target)) return;
        e.preventDefault();
        e.stopPropagation();
        const step = e.target.closest("[data-car-step]");
        if (step) { show(i + Number(step.dataset.carStep)); return; }
        const to = e.target.closest("[data-car-to]");
        if (to) show(Number(to.dataset.carTo));
      });
      let x0 = 0;
      let y0 = 0;
      let pid = 0;
      el.addEventListener("pointerdown", (e) => {
        if (onChrome(e.target)) return;
        x0 = e.clientX;
        y0 = e.clientY;
        pid = e.pointerId;
      });
      el.addEventListener("pointerup", (e) => {
        if (e.pointerId !== pid) return;
        pid = 0;
        const dx = e.clientX - x0;
        const dy = e.clientY - y0;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          e.preventDefault();
          e.stopPropagation();
          show(i + (dx < 0 ? 1 : -1));
        }
      });
      el.addEventListener("dblclick", (e) => {
        if (onChrome(e.target)) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }
        const id = el.dataset.dblike;
        if (id) { e.preventDefault(); e.stopPropagation(); toggleLike(id); }
      });
      el.tabIndex = 0;
      el.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); show(i + 1); }
        if (e.key === "ArrowLeft") { e.preventDefault(); show(i - 1); }
      });
    });
  }

  function feedPost(fit) {
    const names = fitArtists(fit);
    const a = artistByName(names[0]);
    const b = names[1] ? artistByName(names[1]) : null;
    const pcs = piecesForFit(fit.id);
    const items = pcs.length === 1 ? t("item") : t("items").replace("{n}", String(pcs.length));
    const liked = state.liked.has(fit.id);
    const nLike = state.likeCounts[fit.id] ?? (liked ? 1 : 0);
    const nCom = (state.comments[fit.id] || []).length;
    const avatars = names.length > 1
      ? `<div class="feed-pair">${names.map((n, i) => {
          const who = i ? b : a;
          return `<button type="button" data-go="#/s/${encodeURIComponent(n)}">${ava(who?.imageUrl, n)}</button>`;
        }).join("")}</div>`
      : `<button type="button" data-go="#/s/${encodeURIComponent(names[0] || "")}">${ava(a?.imageUrl, names[0])}</button>`;
    const who = `<p class="feed-name">${names.map((n, i) => `${i ? `<span class="feed-x">×</span>` : ""}<button type="button" data-go="#/s/${encodeURIComponent(n)}">${esc(n)}</button>`).join("")}</p>`;
    return `<article class="feed-post">
      <div class="feed-media">
        ${carousel(fit.imageUrls.length ? fit.imageUrls : (fit.imageUrl ? [fit.imageUrl] : []), names.join(" × "), fit.id)}
      </div>
      <div class="feed-side">
        <header class="feed-head${names.length > 1 ? " is-couple" : ""}">
          ${avatars}
          <div class="feed-who">
            ${who}
            <p class="feed-ago">${esc(ago(fit.date))}</p>
          </div>
          <button class="act feed-more" type="button" data-more="${esc(names[0] || "")}" aria-label="more">${I.more}</button>
        </header>
        <div class="actions">
          <button class="act is-heart ${liked ? "on" : ""}" type="button" data-like="${esc(fit.id)}">${liked ? I.heart : I.heartO}<b>${nLike || "0"}</b></button>
          <button class="act" type="button" data-comment="${esc(fit.id)}">${I.chat}<b>${nCom || "0"}</b></button>
          <button class="act" type="button" data-save="${esc(fit.id)}">${I.mark}</button>
        </div>
        ${pcs.length ? `<section class="feed-archive">
          <div class="feed-archive-h">
            <p class="kicker">${t("details")}</p>
            <span>${esc(items)}</span>
          </div>
          <hr class="rule">
          <div class="pieces">${pcs.slice(0, 5).map((p) => pieceCard(p)).join("")}</div>
        </section>` : ""}
      </div>
    </article>`;
  }

  function home() {
    const zones = [
      ["Global", t("global")],
      ["North America", t("na")],
      ["Europe", t("eu")],
      ["Asia", t("as")],
    ];
    const rows = feedFits().slice(0, 24);
    const emptyPrivate = state.privateFeed && !rows.length && state.ready;
    const nFit = state.fits.length;
    return `<div class="feed-col">
      <header class="stars-mast">
        <div class="stars-lockup">
          <p class="kicker">${t("feedSub")}</p>
          <h1 class="display-title">${t("home")}</h1>
        </div>
        <div class="stars-count">
          ${tallyBlock("fits", nFit)}
          <span>${t("feedIndex")}</span>
        </div>
      </header>
      <p class="stars-dek">${t("feedDesc")}</p>
      <div class="stars-rail">
        <div class="stars-regions">${zones.map(([id, label]) => `<button class="chip ${!state.privateFeed && state.region === id ? "is-on" : ""}" type="button" data-feed-region="${esc(id)}">${esc(label)}</button>`).join("")}</div>
        <div class="stars-sort">
          <button type="button" class="${state.privateFeed ? "is-on" : ""}" data-private><span class="lock">${I.lock} ${t("private")}</span></button>
        </div>
      </div>
      ${!state.ready ? `<p class="empty">${t("connecting")}</p>` : ""}
      ${state.ready && state.fail ? `<p class="empty">${t("connecting")}</p>` : ""}
      ${emptyPrivate ? `<p class="empty">${esc(t("privateEmpty"))}</p>` : ""}
      ${state.ready && !state.fail && !emptyPrivate && !rows.length ? `<p class="empty">${t("empty")}</p>` : rows.map(feedPost).join("")}
    </div>`;
  }

  function starPlate(a) {
    const n = fitsForArtist(a.name).length;
    const letter = (a.name || "?").replace(/[^A-Z0-9]/g, "").slice(0, 2) || "?";
    const pic = a.imageUrl
      ? `<img src="${esc(a.imageUrl)}" alt="">`
      : `<span class="star-plate-mark">${esc(letter)}</span>`;
    const zone = a.region && a.region !== "ALL" ? a.region : "";
    return `<button class="star-plate" type="button" data-go="#/s/${encodeURIComponent(a.name)}">
      <div class="star-plate-pic">${pic}</div>
      <div class="star-plate-copy">
        <p class="kicker">${esc(a.country || zone)}</p>
        <h2>${esc(a.name)}</h2>
        <p class="star-meta">${n ? `<span>${String(n).padStart(2, "0")} ${t("fits")}</span>` : `<span></span>`}<span>${esc(zone)}</span></p>
      </div>
    </button>`;
  }
  function stars() {
    const chips = ["ALL", "USA", "TR", "EU", "CANADA", "ASIA", "AFRICA"];
    let list = state.artists.filter((a) => state.starRegion === "ALL" || a.region === state.starRegion);
    if (state.trending) {
      const count = (n) => fitsForArtist(n).length;
      list = [...list].sort((a, b) => count(b.name) - count(a.name) || a.name.localeCompare(b.name));
    }
    const total = state.artists.length;
    return `<div class="stars-page">
      <header class="stars-mast">
        <div class="stars-lockup">
          <p class="kicker">${t("starsSub")}</p>
          <h1 class="display-title">${t("stars")}</h1>
        </div>
        <div class="stars-count">
          <b>${String(total).padStart(2, "0")}</b>
          <span>${t("starsIndex")}</span>
        </div>
      </header>
      <p class="stars-dek">${t("starsDesc")}</p>
      <div class="stars-rail">
        <div class="stars-regions">${chips.map((c) => `<button class="chip ${state.starRegion === c ? "is-on" : ""}" type="button" data-chip="${c}">${c}</button>`).join("")}</div>
        <div class="stars-sort">
          <button type="button" class="${state.trending ? "" : "is-on"}" data-trend="0">${t("az")}</button>
          <button type="button" class="${state.trending ? "is-on" : ""}" data-trend="1">${t("trend")}</button>
        </div>
      </div>
      ${!state.ready ? `<p class="empty">${t("connecting")}</p>` : list.length ? `<div class="stars">${list.map(starPlate).join("")}</div>` : `<p class="empty">${t("starsEmpty")}</p>`}
    </div>`;
  }

  function news() {
    const rows = state.news;
    return `<div class="news-list">
      <header class="stars-mast">
        <div class="stars-lockup">
          <p class="kicker">${t("newsSub")}</p>
          <h1 class="display-title">${t("news")}</h1>
        </div>
        <div class="stars-count">
          ${tallyBlock("news", rows.length)}
          <span>${t("newsIndex")}</span>
        </div>
      </header>
      <p class="stars-dek">${t("newsDesc")}</p>
      ${!state.ready ? `<p class="empty">${t("connecting")}</p>` : rows.length ? rows.map((n) => `
        <a class="news-card" href="#/n/${encodeURIComponent(n.id)}">
          ${n.imageUrl ? `<div class="news-cover">${imgTag(n.imageUrl, n.title, `class="${newsPlateClass(n.imageUrl)}"`)}</div>` : `<div class="news-cover"></div>`}
          <div class="news-card-copy">
            <div class="news-card-meta"><span class="tag">${esc(n.category)}</span><time>${esc(ago(n.createdAt))}</time></div>
            <h2>${esc(n.title)}</h2>
            ${n.dek ? `<p class="dek">${esc(n.dek)}</p>` : ""}
            <div class="news-card-foot"><span>${t("newsBy")} ${esc(n.source)}</span>${I.fwd}</div>
          </div>
        </a>`).join("") : `<p class="empty">${t("newsEmpty")}</p>`}
    </div>`;
  }

  const COUNTRIES = ["United States", "United Kingdom", "France", "Germany", "Italy", "Poland", "Netherlands", "Portugal", "Spain", "Türkiye", "Ukraine", "Japan", "South Korea"];
  const REGIONS = ["Global", "North America", "Europe", "Asia"];

  function welcomeLines() {
    return t("welcomeLine").split(".").map((s) => s.trim()).filter(Boolean)
      .map((s) => `<span>${esc(s)}.</span>`).join("");
  }
  function authHero(opt = {}) {
    const nArt = state.artists.length;
    const nFit = state.fits.length;
    const nPiece = state.pieces.length;
    return `<div class="auth-hero">
      ${opt.back ? `<button class="sq auth-back" type="button" data-go="#/join">${I.back}</button>` : ""}
      <p class="kicker">${t("welcomeKicker")}</p>
      <h1 class="auth-display">${welcomeLines()}</h1>
      <p class="auth-lede">${t("joinDek")}</p>
      <ol class="auth-index">
        <li><b>01</b><div><em>${t("joinFollow")}</em><p>${t("joinFollowD")}</p></div></li>
        <li><b>02</b><div><em>${t("joinArchive")}</em><p>${t("joinArchiveD")}</p></div></li>
        <li><b>03</b><div><em>${t("joinCulture")}</em><p>${t("joinCultureD")}</p></div></li>
      </ol>
      <dl class="auth-stats">
        <div><dt>${t("artists")}</dt><dd>${String(nArt || 0).padStart(2, "0")}</dd></div>
        <div><dt>${t("fits")}</dt><dd>${String(nFit || 0).padStart(2, "0")}</dd></div>
        <div><dt>${t("pieces")}</dt><dd>${String(nPiece || 0).padStart(2, "0")}</dd></div>
      </dl>
    </div>`;
  }
  function authLang() {
    return `<div class="lang-row">
      <button class="lang-chip ${state.lang === "en" ? "is-on" : ""}" type="button" data-lang="en">EN</button>
      <button class="lang-chip ${state.lang === "tr" ? "is-on" : ""}" type="button" data-lang="tr">TR</button>
    </div>`;
  }
  function authDesk(title, inner) {
    return `<article class="auth-desk">
      <header class="auth-desk-h">${esc(title)}</header>
      <div class="auth-desk-body">${inner}</div>
    </article>`;
  }
  function joinPage() {
    return `<div class="auth-page auth-join">
      ${authHero()}
      ${authDesk(t("join"), `
        ${authLang()}
        <button class="cta" type="button" data-go="#/login">${t("logIn")}</button>
        <button class="cta is-fill" type="button" data-go="#/create">${t("create")}</button>
        <div class="or-row"><i></i>${t("or")}<i></i></div>
        <button class="social-btn" type="button" data-oauth="apple">${I.apple} ${t("apple")}</button>
        <button class="social-btn" type="button" data-oauth="google">${I.google} ${t("google")}</button>
        <button class="guest-link" type="button" data-go="#/">${t("guest")}</button>
        <p class="legal-mini">${t("terms1")}<a href="terms.html">${t("terms2")}</a>${t("terms3")}<a href="privacy.html">${t("terms4")}</a></p>
        <p class="legal-mini">${t("legalFooter")}</p>
      `)}
    </div>`;
  }

  function loginPage() {
    const passType = state.passShown ? "text" : "password";
    const passIco = state.passShown ? I.eye : I.eyeOff;
    return `<div class="auth-page auth-form">
      ${authHero({ back: true })}
      ${authDesk(t("logIn"), `
        ${authLang()}
        ${state.authErr ? `<p class="err">${esc(state.authErr)}</p>` : ""}
        <form id="loginForm">
          ${bfield(t("email"), "email", "email", t("emailHint"), `<span class="bfield-ico">${I.mail}</span>`, 'autocomplete="username"')}
          ${bfield(t("pass"), "password", passType, t("passHint"), `<button class="bfield-ico" type="button" data-toggle-pass>${passIco}</button>`, 'autocomplete="current-password"')}
          <button class="check ${state.remember ? "is-on" : ""}" type="button" data-remember><i>${state.remember ? I.check : ""}</i> ${t("remember")}</button>
          <button class="forgot" type="button" data-forgot>${t("forgot")}</button>
          <button class="cta is-fill ${state.busy ? "is-busy" : ""}" type="submit">${t("logIn")}</button>
        </form>
      `)}
    </div>`;
  }

  function createPage() {
    const passType = state.passShown ? "text" : "password";
    const passIco = state.passShown ? I.eye : I.eyeOff;
    const langLabel = state.lang === "tr" ? "Türkçe" : "English";
    return `<div class="auth-page auth-form">
      ${authHero({ back: true })}
      ${authDesk(t("create"), `
        ${authLang()}
        ${state.authErr ? `<p class="err">${esc(state.authErr)}</p>` : ""}
        <form id="createForm">
          ${bfield(t("email"), "email", "email", t("emailHint"), `<span class="bfield-ico">${I.mail}</span>`, 'autocomplete="email"')}
          ${bfield(t("nick"), "username", "text", t("nickHint"), `<span class="bfield-ico">${I.personO}</span>`, 'maxlength="18" autocomplete="nickname"')}
          ${bfield(t("pass"), "password", passType, t("passHint"), `<button class="bfield-ico" type="button" data-toggle-pass>${passIco}</button>`, 'autocomplete="new-password"')}
          <p class="hint">${t("passDesc")}</p>
          ${selectField(t("country"), "country", state.country)}
          ${selectField(t("lang"), "language", langLabel)}
          ${selectField(t("regionOpt"), "region", state.contentRegion)}
          <p class="hint">${t("regionDesc")}</p>
          <button class="cta is-row ${state.busy ? "is-busy" : ""}" type="submit">${t("create")} ${I.fwd}</button>
        </form>
        <p class="legal-mini">${t("terms1")}<a href="terms.html">${t("terms2")}</a>${t("terms3")}<a href="privacy.html">${t("terms4")}</a></p>
      `)}
    </div>`;
  }

  function accountPage() {
    if (!logged() || !state.me) return joinPage();
    const me = state.me;
    const mine = [];
    for (const id of Object.keys(state.comments)) {
      for (const c of state.comments[id]) if (c.userId === me.id) mine.push(c);
    }
    const followed = [...state.followed];
    return `
      <article class="plate">
        <header class="plate-head">${t("plate")}</header>
        <div class="plate-body">
          <label class="photo-edit">
            ${ava(me.avatar, me.username, "ava lg")}
            <span class="cam">${I.cam}</span>
            <input id="avatarFile" type="file" accept="image/*" hidden>
          </label>
          <button type="button" class="ig-handle" data-pick-photo>${t("changePhoto")}</button>
          <h1><input class="nick-inline" maxlength="18" value="${esc(me.username)}" data-nick-input aria-label="${t("editNick")}"></h1>
        </div>
      </article>
      <div class="account-stats">
        <div><em>${t("saved")}</em><b>—</b></div>
        <div><em>${t("accComments")}</em><b>${mine.length}</b></div>
        <div><em>${t("accFollow")}</em><b>${followed.length}</b></div>
      </div>
      <div class="pad" style="padding-top:0">
        <button class="check ${me.isPublic ? "is-on" : ""}" type="button" data-public><i>${me.isPublic ? I.check : ""}</i> ${t("publicOn")}</button>
        <p class="hint" style="margin:0 0 24px;font-size:9px;font-weight:700;letter-spacing:1px;color:var(--ink54)">${t("publicDesc")}</p>
        <p class="kicker">${t("accFollow")}</p>
        ${followed.length ? followed.map((n) => {
          const a = artistByName(n);
          return `<button class="followed-row" type="button" data-go="#/s/${encodeURIComponent(n)}">${ava(a?.imageUrl, n, "ava")}<span>${esc(n)}</span></button>`;
        }).join("") : `<p class="empty" style="padding:24px 0">${t("noFollow")}</p>`}
        <p class="kicker" style="margin-top:28px">${t("accComments")}</p>
        ${mine.length ? mine.slice(0, 8).map((c) => `<div class="comment">${ava(me.avatar, me.username)}<div><p>${esc(c.text)}</p><em>${esc(ago(c.at))}</em></div></div>`).join("") : `<p class="empty" style="padding:24px 0">${t("commentsEmpty")}</p>`}
        <button class="cta" type="button" data-logout style="margin-top:32px">${t("logout")}</button>
      </div>
    `;
  }

  function starPage(name) {
    const a = artistByName(name);
    const fits = fitsForArtist(name);
    if (!a && !fits.length) return `<p class="empty">${t("none")}</p>`;
    const who = a?.name || up(name);
    const on = state.followed.has(who);
    const ig = a?.instagram;
    return `
      <div class="back-row"><button class="sq" type="button" data-go="#/stars">${I.back}</button></div>
      <article class="plate">
        <header class="plate-head">${ig ? `<a class="plate-ig" href="https://instagram.com/${esc(ig)}" target="_blank" rel="noopener">${I.ig}</a>` : ""}<span>${t("artists")}</span></header>
        <div class="plate-body">
          ${ava(a?.imageUrl, who, "ava lg")}
          <h1>${esc(who)}</h1>
          ${a?.country ? `<span class="stamp">${esc(a.country)}</span>` : ""}
          ${ig ? `<a class="ig-handle" href="https://instagram.com/${esc(ig)}" target="_blank" rel="noopener">@${esc(up(ig))}</a>` : ""}
          <button class="follow ${on ? "is-on" : ""}" type="button" data-follow="${esc(who)}">${on ? t("following") : t("follow")}</button>
        </div>
      </article>
      <div class="stats">
        <div><em>${t("followers")}</em><b>—</b></div>
        <div><em>${t("fits")}</em><b>${fits.length}</b></div>
      </div>
      <div class="grid3">${fits.map((f) => `
        <button type="button" data-go="#/f/${encodeURIComponent(f.id)}">${f.imageUrl ? `<img src="${esc(f.imageUrl)}" alt="">` : ""}</button>
      `).join("")}</div>
    `;
  }

  function fitPage(id) {
    const fit = state.fits.find((f) => f.id === id);
    if (!fit) return `<p class="empty">${t("none")}</p>`;
    return `<div class="feed-col"><div class="back-row"><button class="sq" type="button" data-go="#/">${I.back}</button></div>${feedPost(fit)}</div>`;
  }

  function asListings(raw) {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string" && raw.trim()) {
      try {
        const j = JSON.parse(raw);
        if (Array.isArray(j)) return j;
      } catch { /* ignore */ }
    }
    return [];
  }
  function normAvail(raw) {
    const s = String(raw ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
    if (!s || s === "in" || s === "in_stock" || s === "available" || s === "stock") return "in_stock";
    if (["out", "sold", "sold_out", "soldout", "out_of_stock", "oos"].includes(s)) return "sold_out";
    if (s === "exclusive") return "exclusive";
    if (["friends", "friends_family", "friends_and_family", "fnf", "f_and_f"].includes(s) || s === "f&f") return "friends_family";
    if (s === "low" || s === "low_stock") return "low_stock";
    return "in_stock";
  }
  function listingStock(raw) {
    const s = String(raw ?? "in").trim().toLowerCase().replace(/[\s-]+/g, "_");
    if (["out", "sold", "sold_out", "soldout", "out_of_stock", "oos"].includes(s)) return "out";
    if (s === "low" || s === "low_stock") return "low";
    return "in";
  }
  function pieceAvail(p) {
    const fromCol = normAvail(p.availability);
    let fromList = "in_stock";
    for (const item of asListings(p.listings)) {
      if (!item || typeof item !== "object") continue;
      if (item._tw === "avail" || item.kind === "meta") {
        fromList = normAvail(item.availability);
        break;
      }
    }
    if (fromCol !== "in_stock") return fromCol;
    if (fromList !== "in_stock") return fromList;
    return "in_stock";
  }
  function availLabel(kind) {
    if (kind === "sold_out") return t("sold");
    if (kind === "exclusive") return t("exclusive");
    if (kind === "friends_family") return t("friends");
    if (kind === "low_stock") return t("lowStock");
    return t("inStock");
  }
  function listingTag(status) {
    const label = status === "out" ? t("outStock") : status === "low" ? t("lowStock") : t("inStock");
    return `<span class="stock"><i class="stock-dot is-${status}"></i>${esc(label)}</span>`;
  }
  function listings(p) {
    const rows = [];
    for (const item of asListings(p.listings)) {
      if (!item || typeof item !== "object") continue;
      if (item._tw === "avail" || item.kind === "meta") continue;
      const url = String(item.url || item.href || item.link || "").trim();
      let store = up(item.store || item.name);
      if (!store || store === "STORE") store = url ? storeFromUrl(url) : "";
      if (!store && !url) continue;
      rows.push({
        store: store || "STORE",
        url,
        price: item.price ? String(item.price) : p.price,
        status: listingStock(item.status),
      });
    }
    if (p.purchaseUrl && !rows.some((r) => r.url === p.purchaseUrl)) {
      rows.push({ store: storeFromUrl(p.purchaseUrl), url: p.purchaseUrl, price: p.price, status: "in" });
    }
    return rows;
  }
  function storeFromUrl(href) {
    try {
      let host = new URL(href.startsWith("http") ? href : `https://${href}`).hostname.replace(/^www\./, "");
      return host.split(".")[0].replace(/[^a-z0-9]/gi, "").toUpperCase() || "STORE";
    } catch { return "STORE"; }
  }
  const TASTE_CAP = 120;
  const viewAt = {};
  function loadTaste() {
    try {
      const raw = JSON.parse(localStorage.getItem("tw.taste") || "{}");
      return raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
    } catch { return {}; }
  }
  function saveTaste(next) {
    try { localStorage.setItem("tw.taste", JSON.stringify(next)); } catch {}
  }
  function pieceArtistName(p) {
    if (!p) return "";
    if (p.artistName) return up(p.artistName);
    const a = state.artists.find((x) => x.id === p.artistId);
    if (a?.name) return a.name;
    const f = state.fits.find((x) => x.id === p.outfitId);
    return f?.artistName || "";
  }
  function pieceTokens(p) {
    const raw = [p.brand, p.name, p.colorway].map((v) => up(v)).join(" ");
    const out = [];
    const seen = new Set();
    const stop = new Set(["THE", "AND", "WITH", "FOR", "FROM", "OF", "A", "AN", "IN", "ON", "BY", "X", "NEW", "OLD", "EDITION", "PACK", "SET"]);
    for (const part of raw.split(/[^A-Z0-9]+/)) {
      if (part.length < 2 || stop.has(part) || seen.has(part)) continue;
      seen.add(part);
      out.push(part);
    }
    return out;
  }
  function piecePriceUsd(p) {
    const raw = String(p.price || "");
    if (!raw || raw === "—" || /SOLD|EXCLUSIVE/.test(up(raw))) return null;
    const digits = raw.replace(/[^0-9]/g, "");
    if (!digits) return null;
    const n = Number(digits);
    return Number.isFinite(n) ? n : null;
  }
  function nearScore(a, b) {
    let s = 0;
    if (a.brand && a.brand === b.brand) s += 42;
    const artA = pieceArtistName(a);
    const artB = pieceArtistName(b);
    if (artA && artA === artB) s += 16;
    const tokensB = new Set(pieceTokens(b));
    let overlap = 0;
    for (const tok of pieceTokens(a)) if (tokensB.has(tok)) overlap += 1;
    if (overlap) s += Math.min(28, overlap * 7);
    const colorA = up(a.colorway).trim();
    const colorB = up(b.colorway).trim();
    if (colorA && colorB) {
      if (colorA === colorB) s += 14;
      else {
        const ca = new Set(colorA.split(/[^A-Z0-9]+/).filter((x) => x.length > 2));
        const cb = new Set(colorB.split(/[^A-Z0-9]+/).filter((x) => x.length > 2));
        for (const x of ca) if (cb.has(x)) { s += 8; break; }
      }
    }
    const pa = piecePriceUsd(a);
    const pb = piecePriceUsd(b);
    if (pa && pb) {
      const da = pa > pb ? pa / pb : pb / pa;
      if (da <= 1.25) s += 12;
      else if (da <= 2) s += 7;
      else if (da <= 4) s += 3;
    }
    return s;
  }
  function tasteRowScore(row) {
    let n = (row.score || 0) + (row.views || 0) * 2;
    const at = row.at || 0;
    if (at) {
      const age = Date.now() - at;
      if (age < 3 * 86400000) n += 10;
      else if (age < 14 * 86400000) n += 5;
    }
    return n;
  }
  function notePiece(piece, kind) {
    if (!piece?.id) return;
    const now = Date.now();
    if (kind === "view") {
      if (now - (viewAt[piece.id] || 0) < 8000) return;
      viewAt[piece.id] = now;
    }
    const next = loadTaste();
    const row = { ...(next[piece.id] || {}) };
    const add = kind === "visit" ? 10 : 2;
    if (kind === "view") row.views = (row.views || 0) + 1;
    row.score = (row.score || 0) + add;
    row.at = now;
    next[piece.id] = row;
    const keys = Object.keys(next);
    if (keys.length > TASTE_CAP) {
      keys.sort((a, b) => {
        const d = tasteRowScore(next[a]) - tasteRowScore(next[b]);
        return d || (next[a].at || 0) - (next[b].at || 0);
      });
      for (const k of keys) {
        if (Object.keys(next).length <= TASTE_CAP) break;
        if (k === piece.id) continue;
        delete next[k];
      }
    }
    saveTaste(next);
  }
  function tasteWeights(field) {
    const taste = loadTaste();
    const ranked = Object.entries(taste).sort((a, b) => tasteRowScore(b[1]) - tasteRowScore(a[1])).slice(0, 16);
    const weights = {};
    for (const [id, row] of ranked) {
      const piece = state.pieces.find((x) => x.id === id);
      if (!piece) continue;
      const w = Math.min(80, Math.max(1, tasteRowScore(row)));
      if (field === "brand") {
        if (piece.brand) weights[piece.brand] = (weights[piece.brand] || 0) + w;
      } else if (field === "token") {
        for (const tok of pieceTokens(piece)) weights[tok] = (weights[tok] || 0) + w;
      } else if (field === "color") {
        const c = up(piece.colorway).trim();
        if (c) weights[c] = (weights[c] || 0) + w;
      } else if (field === "artist") {
        const art = pieceArtistName(piece);
        if (art) weights[art] = (weights[art] || 0) + w;
      }
    }
    return weights;
  }
  function tasteAffinity(piece, ctx) {
    const { brands, tokens, colors, artists, prices } = ctx;
    if (!Object.keys(brands).length && !Object.keys(tokens).length) return 0;
    let s = 0;
    if (piece.brand) s += Math.min(36, Math.round((brands[piece.brand] || 0) / 4));
    const art = pieceArtistName(piece);
    if (art) s += Math.min(18, Math.round((artists[art] || 0) / 6));
    let tokenHit = 0;
    for (const tok of pieceTokens(piece)) tokenHit += tokens[tok] || 0;
    s += Math.min(28, Math.round(tokenHit / 8));
    const color = up(piece.colorway).trim();
    if (color) s += Math.min(12, Math.round((colors[color] || 0) / 6));
    const usd = piecePriceUsd(piece);
    if (usd != null && prices.length) {
      const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
      if (mean > 0) {
        const da = usd > mean ? usd / mean : mean / usd;
        if (da <= 1.35) s += 8;
        else if (da <= 2.2) s += 4;
      }
    }
    return s;
  }
  function relatedPieces(piece) {
    const live = state.pieces;
    if (!live.length) return [];
    const pool = live.filter((x) => x.id !== piece.id && (x.brand !== piece.brand || x.name !== piece.name));
    if (!pool.length) return [];
    const taste = loadTaste();
    const hasTaste = Object.keys(taste).length > 0;
    const followed = new Set([...state.followed].map(up));
    const brands = hasTaste ? tasteWeights("brand") : {};
    const tokens = hasTaste ? tasteWeights("token") : {};
    const colors = hasTaste ? tasteWeights("color") : {};
    const artists = hasTaste ? tasteWeights("artist") : {};
    const prices = [];
    if (hasTaste) {
      const rankedTaste = Object.entries(taste).sort((a, b) => tasteRowScore(b[1]) - tasteRowScore(a[1]));
      for (const [id] of rankedTaste.slice(0, 16)) {
        const row = state.pieces.find((x) => x.id === id);
        const usd = row ? piecePriceUsd(row) : null;
        if (usd != null) prices.push(usd);
      }
    }
    const rank = (p) => {
      let n = 0;
      if (hasTaste) {
        n += (taste[p.id] ? tasteRowScore(taste[p.id]) : 0) * 14;
        n += tasteAffinity(p, { brands, tokens, colors, artists, prices }) * 5;
        n += nearScore(p, piece);
      } else {
        n += nearScore(p, piece) * 4;
      }
      const art = pieceArtistName(p);
      if (art && followed.has(art)) n += 8;
      return n;
    };
    return pool.sort((a, b) => {
      const d = rank(b) - rank(a);
      return d || a.id.localeCompare(b.id);
    }).slice(0, 8);
  }
  function piecePage(id) {
    const p = state.pieces.find((x) => x.id === id);
    if (!p) return `<p class="empty">${t("none")}</p>`;
    const status = pieceAvail(p);
    const can = status === "in_stock";
    const rows = listings(p);
    const href = rows[0]?.url || "";
    const related = relatedPieces(p);
    notePiece(p, "view");
    const visitLabel = can ? t("visit") : availLabel(status);
    return `
      <div class="pdp">
        <div class="product">
          <div class="product-pic">${p.imageUrl ? `<img src="${esc(p.imageUrl)}" alt="">` : ""}</div>
          <div class="product-info">
            <button class="sq product-back" type="button" data-back>${I.back}</button>
            <button class="brand" type="button" data-go="#/b/${encodeURIComponent(p.brand)}">${esc(p.brand)}</button>
            <div class="product-row"><h1>${esc(p.name)}</h1><b>${esc(p.price)}</b></div>
            ${p.colorway && !p.colorway.includes("#") ? `<p class="kicker product-color">${esc(p.colorway)}</p>` : ""}
            ${!can ? `<p class="kicker product-status">${esc(availLabel(status))}</p>` : ""}
            ${can && href ? `<a class="visit" href="${esc(href)}" target="_blank" rel="noopener" data-visit>${esc(visitLabel)}</a>` : `<span class="visit is-off">${esc(visitLabel)}</span>`}
            ${rows.length ? `<p class="kicker product-k">${t("best")}</p><div class="stores">${rows.map((r) => {
              const inner = `<span class="store-name">${esc(r.store)}</span><span class="store-price">${esc(r.price)}</span>${listingTag(r.status)}`;
              return r.url
                ? `<a class="store" href="${esc(r.url)}" target="_blank" rel="noopener" data-visit>${inner}</a>`
                : `<div class="store">${inner}</div>`;
            }).join("")}</div>` : ""}
          </div>
        </div>
        ${related.length ? `<section class="related-block">
          <p class="kicker">${t("related")}</p>
          <hr class="rule">
          <div class="related">${related.map(archiveCard).join("")}</div>
        </section>` : ""}
      </div>
    `;
  }
  function hypeBox(id) {
    if (!id) return "";
    const on = state.hyped.has(id);
    const n = state.hypeCounts[id] || 0;
    return `<div class="hype">
      <div class="hype-row">
        <button type="button" class="${on ? "" : "is-on"}" data-hype="${esc(id)}" data-on="0">OFF</button>
        <button type="button" class="hype-pill ${on ? "is-on" : ""}" data-hype="${esc(id)}" data-on="${on ? "0" : "1"}" aria-label="${t("newsHype")}"><i></i></button>
        <button type="button" class="${on ? "is-on" : ""}" data-hype="${esc(id)}" data-on="1">ON</button>
      </div>
      <span class="hype-label ${on ? "is-on" : ""}">${on ? t("newsHyped") : t("newsHype")}</span>
      ${n ? `<span class="hype-n">${n}</span>` : ""}
    </div>`;
  }
  function newsPage(id) {
    const n = state.news.find((x) => x.id === id);
    if (!n) return `<p class="empty">${t("none")}</p>`;
    const dek = (n.dek || "").trim();
    const body = (n.body || "").trim();
    const article = body || dek;
    const buy = n.buyUrl;
    const hasProduct = [n.productName, n.releaseDate, n.buyNote, n.sku].some((v) => v);
    const href = buy && !/^https?:\/\//i.test(buy) ? `https://${buy}` : buy;
    return `<article class="article">
      <button class="sq article-back" type="button" data-go="#/news">${I.back}</button>
      <p class="kicker">${esc(n.category)}</p>
      <h1>${esc(n.title)}</h1>
      <p class="article-by">${esc(n.source)} · ${esc(ago(n.createdAt))}</p>
      ${n.photos.length ? `<div class="news-pager" data-car="${n.photos.length}">${n.photos.map((u, i) => imgTag(u, n.title, `class="${newsPlateClass(u)}" data-i="${i}"${i ? " hidden" : ""}`)).join("")}${carouselNav(n.photos.length)}</div>` : ""}
      ${hasProduct ? `<div class="spec">
        <div class="spec-row"><em>NAME</em><span>${esc(n.productName || "—")}</span></div>
        <div class="spec-row"><em>SKU</em><span>${esc(n.sku || "—")}</span></div>
        <div class="spec-row"><em>RELEASE DATE</em><span>${esc(n.releaseDate || "—")}</span></div>
        ${n.buyNote ? `<div class="spec-row"><em>NOTE</em><span>${esc(n.buyNote)}</span></div>` : ""}
      </div>` : ""}
      ${dek && body ? `<p class="dek-lead">${esc(dek)}</p>` : ""}
      ${article ? `<p class="body">${esc(article)}</p>` : ""}
      <div class="news-tools">
        ${hypeBox(n.id)}
        ${href ? `<a class="buy-bar" href="${esc(href)}" target="_blank" rel="noopener" data-visit>${t("buy")}</a>` : ""}
      </div>
    </article>`;
  }

  function paintComments(id) {
    const rows = state.comments[id] || [];
    showSheet(`
      <div class="comments-sheet">
        <div class="sheet-head">
          <span></span>
          <p>${t("comments")} (${rows.length})</p>
          <button type="button" data-close aria-label="close">${I.close}</button>
        </div>
        <div class="comments">${rows.length ? rows.map((c) => `
          <div class="comment">${ava(c.avatar, c.name)}<div><p><b>${esc(c.name)}</b> ${esc(c.text)}</p><em>${esc(ago(c.at))}</em></div></div>
        `).join("") : `<p class="empty">${t("noComments")}</p>`}</div>
        <form class="comment-box" data-comment-form="${esc(id)}">
          <input name="text" maxlength="280" placeholder="${t("commentHint")}" autocomplete="off">
          <button type="submit">${t("post")}</button>
        </form>
      </div>
    `);
  }
  async function commentsSheet(id) {
    paintComments(id);
    await pullComments([id]);
    if ($("[data-comment-form]")?.dataset.commentForm === id) paintComments(id);
  }

  async function toggleLike(id) {
    if (!logged()) { needAuth("like"); return; }
    const on = !state.liked.has(id);
    if (on) state.liked.add(id); else state.liked.delete(id);
    state.likeCounts[id] = Math.max(0, (state.likeCounts[id] || 0) + (on ? 1 : -1));
    render();
    try {
      if (on) await sb("user_liked_outfits", "", { method: "POST", body: { user_id: state.me.id, outfit_id: id }, prefer: "return=minimal" });
      else await sb("user_liked_outfits", `user_id=eq.${state.me.id}&outfit_id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
    } catch {
      if (on) state.liked.delete(id); else state.liked.add(id);
      state.likeCounts[id] = Math.max(0, (state.likeCounts[id] || 0) + (on ? -1 : 1));
      render();
    }
  }

  async function toggleHype(id, on) {
    if (!logged()) { needAuth("hype"); return; }
    if (!id) return;
    const was = state.hyped.has(id);
    if (was === on) return;
    if (on) state.hyped.add(id); else state.hyped.delete(id);
    state.hypeCounts[id] = Math.max(0, (state.hypeCounts[id] || 0) + (on ? 1 : -1));
    render();
    try {
      if (on) await sb("drip_news_hypes", "", { method: "POST", body: { user_id: state.me.id, news_id: id }, prefer: "return=minimal" });
      else await sb("drip_news_hypes", `user_id=eq.${state.me.id}&news_id=eq.${id}`, { method: "DELETE", prefer: "return=minimal" });
    } catch {
      if (on) state.hyped.delete(id); else state.hyped.add(id);
      state.hypeCounts[id] = Math.max(0, (state.hypeCounts[id] || 0) + (on ? -1 : 1));
      render();
    }
  }

  async function toggleFollow(name) {
    if (!logged()) { needAuth("follow"); return; }
    const a = artistByName(name);
    if (!a) return;
    const on = !state.followed.has(a.name);
    if (on) state.followed.add(a.name); else state.followed.delete(a.name);
    render();
    try {
      if (on) await sb("user_follows_artist", "", { method: "POST", body: { user_id: state.me.id, artist_id: a.id }, prefer: "return=minimal" });
      else await sb("user_follows_artist", `user_id=eq.${state.me.id}&artist_id=eq.${a.id}`, { method: "DELETE", prefer: "return=minimal" });
    } catch {
      if (on) state.followed.delete(a.name); else state.followed.add(a.name);
      render();
    }
  }

  async function postComment(id, text) {
    if (!logged()) { needAuth("comment"); return; }
    const body = text.trim();
    if (!body) return;
    try {
      await sb("comments", "", {
        method: "POST",
        body: { outfit_id: id, user_id: state.me.id, text: body, username: state.me.username, avatar_url: state.me.avatar || null },
        prefer: "return=minimal",
      });
    } catch {
      try {
        await sb("comments", "", { method: "POST", body: { outfit_id: id, user_id: state.me.id, text: body }, prefer: "return=minimal" });
      } catch { snack(t("errAuth")); return; }
    }
    await pullComments([id]);
    paintComments(id);
    render();
  }

  async function signIn(email, password) {
    state.busy = true; state.authErr = ""; render();
    try {
      const data = await auth("token?grant_type=password", { email: email.trim(), password });
      saveSession(data);
      await hydrateMe();
      state.busy = false;
      go("#/");
    } catch (e) {
      const msg = String(e.message || "").toLowerCase();
      state.authErr = msg.includes("confirm") ? t("confirm") : t("errAuth");
      state.busy = false;
      render();
    }
  }

  async function nickTaken(nick, exceptId) {
    try {
      const rows = await sb("wears_public_nicks", `select=id,username&username=eq.${encodeURIComponent(nick)}`);
      return (rows || []).some((r) => nickOf(r.username) === nick && r.id !== exceptId);
    } catch {
      return false;
    }
  }

  async function saveNick(raw) {
    if (!logged()) return;
    const nick = nickOf(raw);
    if (!nickOk(nick)) { errorDlg(t("nickInvalid")); render(); return; }
    if (nick === state.me.username) return;
    if (await nickTaken(nick, state.me.id)) { errorDlg(t("nickTaken")); render(); return; }
    try {
      await sb("users", `id=eq.${state.me.id}`, { method: "PATCH", body: { username: nick }, prefer: "return=minimal" });
      state.me.username = nick;
    } catch {
      errorDlg(t("nickTaken"));
    }
    render();
  }

  async function signUp(email, password, username) {
    const nick = nickOf(username);
    if (!nickOk(nick)) { errorDlg(t("nickInvalid")); return; }
    if (await nickTaken(nick)) { errorDlg(t("nickTaken")); return; }
    state.busy = true; state.authErr = ""; render();
    try {
      const data = await auth("signup", { email: email.trim(), password });
      if (data.user && (!data.user.identities || data.user.identities.length === 0) && !data.session && !data.access_token) {
        state.authErr = t("inUse"); state.busy = false; render(); return;
      }
      if (data.access_token) saveSession(data);
      else if (data.session?.access_token) saveSession(data.session);
      else {
        try {
          const sess = await auth("token?grant_type=password", { email: email.trim(), password });
          saveSession(sess);
        } catch (e) {
          const msg = String(e.message || "").toLowerCase();
          state.authErr = msg.includes("confirm") ? t("confirm") : t("errSignup");
          state.busy = false; render(); return;
        }
      }
      await hydrateMe();
      if (logged()) {
        try {
          await sb("users", `id=eq.${state.me.id}`, { method: "PATCH", body: { username: nick }, prefer: "return=minimal" });
        } catch {
          try { await sb("users", "", { method: "POST", body: { id: state.me.id, username: nick }, prefer: "return=minimal" }); } catch {}
        }
        state.me.username = nick;
        state.region = state.contentRegion;
      }
      state.busy = false;
      go(logged() ? "#/account" : "#/login");
      if (!logged()) state.authErr = t("confirm");
    } catch (e) {
      const msg = String(e.message || "").toLowerCase();
      state.authErr = msg.includes("already") || msg.includes("registered") ? t("inUse") : t("errSignup");
      state.busy = false;
      render();
    }
  }

  async function signOut() {
    try { await fetch(`${SB}/auth/v1/logout`, { method: "POST", headers: headers({ "Content-Type": "application/json" }) }); } catch {}
    clearSession();
    go("#/");
  }

  async function startOAuth(provider) {
    const rand = crypto.getRandomValues(new Uint8Array(32));
    const verifier = btoa(String.fromCharCode(...rand)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    sessionStorage.setItem("tw.pkce", verifier);
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier));
    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
    const redirect = `${location.origin}${location.pathname}`;
    location.href = `${SB}/auth/v1/authorize?provider=${encodeURIComponent(provider)}&redirect_to=${encodeURIComponent(redirect)}&code_challenge=${challenge}&code_challenge_method=S256&apikey=${KEY}`;
  }

  async function finishOAuth() {
    const q = new URLSearchParams(location.search);
    const code = q.get("code");
    const hashBits = new URLSearchParams(location.hash.replace(/^#/, ""));
    const access = hashBits.get("access_token");
    if (access) {
      saveSession({
        access_token: access,
        refresh_token: hashBits.get("refresh_token"),
        expires_in: hashBits.get("expires_in"),
      });
      history.replaceState({}, "", location.pathname);
      await hydrateMe();
      go(state.me?.username ? "#/" : "#/create");
      return true;
    }
    if (code) {
      const verifier = sessionStorage.getItem("tw.pkce") || "";
      try {
        const data = await auth("token?grant_type=pkce", { auth_code: code, code_verifier: verifier });
        saveSession(data);
        history.replaceState({}, "", location.pathname);
        await hydrateMe();
        go("#/");
        return true;
      } catch {
        history.replaceState({}, "", location.pathname);
      }
    }
    return false;
  }

  async function uploadAvatar(file) {
    if (!logged() || !file) return;
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
    const safe = ext === "png" ? "png" : "jpg";
    const path = `${state.me.id}_${Date.now()}.${safe}`;
    const r = await fetch(`${SB}/storage/v1/object/avatars/${path}`, {
      method: "POST",
      headers: headers({ "Content-Type": file.type || (safe === "png" ? "image/png" : "image/jpeg"), "x-upsert": "true" }),
      body: file,
    });
    if (!r.ok) { snack(t("errAuth")); return; }
    const url = `${SB}/storage/v1/object/public/avatars/${path}`;
    try { await sb("users", `id=eq.${state.me.id}`, { method: "PATCH", body: { profile_image_url: url }, prefer: "return=minimal" }); } catch {}
    state.me.avatar = url;
    render();
  }

  async function setPublic(on) {
    if (!logged()) return;
    state.me.isPublic = on;
    render();
    try { await sb("users", `id=eq.${state.me.id}`, { method: "PATCH", body: { is_public: on }, prefer: "return=minimal" }); } catch {}
  }

  function navGlyph(key, on) {
    if (key === "home") return on ? I.home : I.homeO;
    if (key === "stars") return on ? I.star : I.starO;
    if (key === "news") return on ? I.news : I.newsO;
    return "";
  }

  function paintChrome() {
    const { path } = hash();
    const nav = path === "stars" || path === "s" ? "stars" : path === "news" || path === "n" ? "news" : ["join", "login", "create", "account"].includes(path) ? "join" : path === "search" || path === "b" ? "" : "home";
    const joinLabel = logged() ? t("account") : t("join");
    const joinHref = logged() ? "#/account" : "#/join";
    const labels = { home: t("home"), stars: t("stars"), news: t("news"), join: joinLabel };
    document.querySelectorAll("[data-nav]").forEach((el) => {
      const key = el.dataset.nav;
      const on = key === nav;
      el.classList.toggle("is-on", on);
      const ico = el.querySelector(".nav-ico");
      const lbl = el.querySelector(".nav-lbl");
      if (ico) ico.innerHTML = navGlyph(key, on);
      if (lbl && labels[key]) lbl.textContent = labels[key];
      if (key === "join" && el.tagName === "A") el.setAttribute("href", joinHref);
    });
    ["navJoin", "drawerJoin"].forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.tagName === "A") el.setAttribute("href", joinHref);
    });
    if ($("#btnSearch")) {
      $("#btnSearch").textContent = state.lang === "tr" ? "ARA" : "SEARCH";
      $("#btnSearch").classList.toggle("is-on", path === "search" || path === "b");
    }
    if ($("#btnSearchDrawer")) {
      $("#btnSearchDrawer").textContent = state.lang === "tr" ? "ARA" : "SEARCH";
      $("#btnSearchDrawer").classList.toggle("is-on", path === "search" || path === "b");
    }
    if ($("#btnMenu")) $("#btnMenu").textContent = t("menu");
    document.querySelectorAll(".drawer-meta [data-lang]").forEach((el) => {
      el.classList.toggle("is-on", el.dataset.lang === state.lang);
    });
    document.documentElement.lang = state.lang === "tr" ? "tr" : "en";
  }

  function bindForms() {
    $("#loginForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email") || "").trim();
      const password = String(fd.get("password") || "");
      if (!email || !password) { errorDlg(t("errFields")); return; }
      signIn(email, password);
    });
    $("#createForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const email = String(fd.get("email") || "").trim();
      const username = String(fd.get("username") || "");
      const password = String(fd.get("password") || "");
      if (!email || !username || !password) { errorDlg(t("errFields")); return; }
      if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) { errorDlg(t("passDesc")); return; }
      signUp(email, password, username);
    });
    $("#avatarFile")?.addEventListener("change", (e) => {
      const file = e.target.files?.[0];
      if (file) uploadAvatar(file);
    });
  }

  function revealImages(root) {
    root.querySelectorAll("img").forEach((img) => {
      const on = () => img.classList.add("is-on");
      if (img.complete && img.naturalWidth) on();
      else {
        img.addEventListener("load", on, { once: true });
        img.addEventListener("error", on, { once: true });
      }
    });
  }
  function enterView(view) {
    window.clearTimeout(enterTimer);
    const done = (e) => {
      if (e && e.target !== view) return;
      view.classList.remove("is-enter");
      view.removeEventListener("animationend", done);
      window.clearTimeout(enterTimer);
    };
    view.classList.remove("is-enter");
    void view.offsetWidth;
    view.classList.add("is-enter");
    view.addEventListener("animationend", done);
    enterTimer = window.setTimeout(() => done(), 500);
  }
  function render() {
    const view = $("#view");
    const { path, id } = hash();
    const routeKey = `${path}/${id}`;
    const routeChanged = routeKey !== lastRoute;
    const readyFlip = state.ready && state.ready !== lastReady;
    lastRoute = routeKey;
    lastReady = state.ready;
    let html = "";
    if (path === "stars") html = stars();
    else if (path === "news") html = news();
    else if (path === "join") html = joinPage();
    else if (path === "login") html = loginPage();
    else if (path === "create") html = createPage();
    else if (path === "account") html = accountPage();
    else if (path === "s") html = starPage(id);
    else if (path === "f") html = fitPage(id);
    else if (path === "p") html = piecePage(id);
    else if (path === "n") html = newsPage(id);
    else if (path === "search") html = searchPage();
    else if (path === "b") html = brandPage(id);
    else html = home();
    view.innerHTML = html;
    if (routeChanged) window.scrollTo(0, 0);
    if ((routeChanged && state.ready) || readyFlip) enterView(view);
    else view.classList.remove("is-enter");
    revealImages(view);
    bindCarousel(view);
    bindForms();
    bindSearch();
    bindBrandMarks(view);
    bindTallies(view);
    bindMastAlign(view);
    paintChrome();
  }

  function cycleRegion() {
    const order = ["Global", "North America", "Europe", "Asia"];
    state.privateFeed = false;
    state.region = order[(order.indexOf(state.region) + 1) % order.length];
    render();
  }

  document.addEventListener("dblclick", (e) => {
    if (e.target.closest(".photo-nav, [data-car-step], [data-car-to], .dots")) {
      e.preventDefault();
      e.stopPropagation();
    }
  }, true);

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-close-dlg]")) { hideDlg(); return; }
    if (e.target.closest("[data-drawer-close]") || e.target === $("#drawer")) { closeDrawer(); return; }
    if (e.target.closest(".photo-nav, [data-car-step], [data-car-to], .dots")) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const goTo = e.target.closest("[data-go]")?.dataset.go;
    if (goTo) { e.preventDefault(); hideSheet(); hideDlg(); closeDrawer(); go(goTo); return; }
    const navA = e.target.closest("a[data-nav], .drawer-nav a, .site-nav a");
    if (navA && navA.getAttribute("href")?.startsWith("#")) { closeDrawer(); }
    if (e.target.closest("[data-back]")) { e.preventDefault(); history.back(); return; }
    const like = e.target.closest("button[data-like]")?.dataset.like;
    if (like) { e.preventDefault(); toggleLike(like); return; }
    const com = e.target.closest("[data-comment]")?.dataset.comment;
    if (com) {
      e.preventDefault();
      if (!logged()) { needAuth("comment"); return; }
      commentsSheet(com);
      return;
    }
    if (e.target.closest("[data-save]")) { e.preventDefault(); if (!logged()) needAuth("like"); return; }
    const hypeEl = e.target.closest("[data-hype]");
    if (hypeEl) {
      e.preventDefault();
      toggleHype(hypeEl.dataset.hype, hypeEl.dataset.on === "1");
      return;
    }
    if (e.target.closest("[data-visit]")) {
      snack(t("visiting"));
      const loc = hash();
      if (loc.path === "p") {
        const piece = state.pieces.find((x) => x.id === loc.id);
        if (piece) notePiece(piece, "visit");
      }
    }
    const fol = e.target.closest("[data-follow]")?.dataset.follow;
    if (fol) { e.preventDefault(); toggleFollow(fol); return; }
    if (e.target.closest("[data-private]")) {
      e.preventDefault();
      if (!logged()) { needAuth("follow"); return; }
      state.privateFeed = !state.privateFeed;
      render();
      return;
    }
    const feedRegion = e.target.closest("[data-feed-region]")?.dataset.feedRegion;
    if (feedRegion) {
      e.preventDefault();
      state.privateFeed = false;
      state.region = feedRegion;
      render();
      return;
    }
    const region = e.target.closest("[data-region]");
    if (region) { e.preventDefault(); cycleRegion(); return; }
    const chip = e.target.closest("[data-chip]")?.dataset.chip;
    if (chip) { state.starRegion = chip; render(); return; }
    const trend = e.target.closest("[data-trend]")?.dataset.trend;
    if (trend != null) { state.trending = trend === "1"; render(); return; }
    const searchSort = e.target.closest("[data-search-sort]")?.dataset.searchSort;
    if (searchSort) { state.searchSort = searchSort; render(); return; }
    const tab = e.target.closest("[data-tab]")?.dataset.tab;
    if (tab != null) {
      e.preventDefault();
      closeDrawer();
      const dest = ["#/", "#/stars", "#/news", logged() ? "#/account" : "#/join"][Number(tab)];
      go(dest);
      return;
    }
    const lang = e.target.closest("[data-lang]")?.dataset.lang;
    if (lang) {
      state.lang = lang;
      localStorage.setItem("tw.lang", lang);
      hideSheet();
      render();
      return;
    }
    if (e.target.closest("[data-logout]")) { hideSheet(); signOut(); return; }
    if (e.target.closest("[data-remember]")) { state.remember = !state.remember; render(); return; }
    if (e.target.closest("[data-public]")) { setPublic(!state.me?.isPublic); return; }
    if (e.target.closest("[data-toggle-pass]")) {
      e.preventDefault();
      const form = e.target.closest("form");
      const email = form?.querySelector('[name="email"]')?.value;
      const user = form?.querySelector('[name="username"]')?.value;
      const pass = form?.querySelector('[name="password"]')?.value;
      state.passShown = !state.passShown;
      render();
      const next = $("#loginForm, #createForm");
      if (next) {
        if (email != null) { const el = next.querySelector('[name="email"]'); if (el) el.value = email; }
        if (user != null) { const el = next.querySelector('[name="username"]'); if (el) el.value = user; }
        if (pass != null) { const el = next.querySelector('[name="password"]'); if (el) el.value = pass; }
      }
      return;
    }
    const pick = e.target.closest("[data-pick]")?.dataset.pick;
    if (pick) {
      e.preventDefault();
      const items = pick === "country" ? COUNTRIES : pick === "region" ? REGIONS : ["English", "Türkçe"];
      const current = pick === "country" ? state.country : pick === "region" ? state.contentRegion : (state.lang === "tr" ? "Türkçe" : "English");
      const title = pick === "country" ? t("country") : pick === "region" ? t("regionOpt") : t("lang");
      showSheet(`
        <div class="sheet-head"><span></span><p>${esc(title)}</p><button type="button" data-close>${I.close}</button></div>
        ${items.map((item) => `<button class="sheet-row" type="button" data-picked="${esc(pick)}" data-value="${esc(item)}" ${item === current ? 'style="background:#000;color:#fff"' : ""}>${esc(item).toUpperCase()}${item === current ? I.check : ""}</button>`).join("")}
      `);
      return;
    }
    const picked = e.target.closest("[data-picked]");
    if (picked) {
      const kind = picked.dataset.picked;
      const value = picked.dataset.value;
      if (kind === "country") { state.country = value; localStorage.setItem("tw.country", value); }
      if (kind === "region") { state.contentRegion = value; localStorage.setItem("tw.contentRegion", value); state.region = value; }
      if (kind === "language") {
        state.lang = value === "Türkçe" ? "tr" : "en";
        localStorage.setItem("tw.lang", state.lang);
      }
      hideSheet();
      render();
      return;
    }
    if (e.target.closest("[data-pick-photo]")) { $("#avatarFile")?.click(); return; }
    const oauth = e.target.closest("[data-oauth]")?.dataset.oauth;
    if (oauth) { e.preventDefault(); startOAuth(oauth); return; }
    if (e.target.closest("[data-forgot]")) {
      e.preventDefault();
      showSheet(`
        <p class="sheet-title">${t("forgot")}</p>
        <form class="pad" data-reset>
          <div class="field"><label>${t("email")}</label><input name="email" type="email"></div>
          <button class="cta is-fill" type="submit">${t("sendReset")}</button>
        </form>
      `);
      return;
    }
    const more = e.target.closest("[data-more]")?.dataset.more;
    if (more) {
      showSheet(`
        <p class="sheet-title">${esc(more)}</p>
        <button class="sheet-row" type="button" data-go="#/s/${encodeURIComponent(more)}">${esc(more)}</button>
        <button class="sheet-row" type="button" data-close>${state.lang === "tr" ? "KAPAT" : "CLOSE"}</button>
      `);
    }
  });

  document.addEventListener("submit", (e) => {
    const form = e.target.closest("[data-comment-form]");
    if (form) {
      e.preventDefault();
      const id = form.dataset.commentForm;
      const text = form.querySelector("input")?.value || "";
      postComment(id, text);
      return;
    }
    const reset = e.target.closest("[data-reset]");
    if (reset) {
      e.preventDefault();
      const email = String(new FormData(reset).get("email") || "").trim();
      if (!email) return;
      auth("recover", { email }).then(() => { hideSheet(); snack(t("forgotSent")); }).catch(() => snack(t("errAuth")));
    }
  });

  document.addEventListener("focusout", (e) => {
    const input = e.target.closest?.("[data-nick-input]");
    if (input) saveNick(input.value);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && e.target.closest?.("[data-nick-input]")) {
      e.preventDefault();
      e.target.blur();
    }
  });

  window.addEventListener("hashchange", () => { closeDrawer(); window.scrollTo(0, 0); render(); });
  $("#btnMenu")?.addEventListener("click", () => {
    const el = $("#drawer");
    if (el && !el.hidden) closeDrawer();
    else openDrawer();
  });
  $("#btnSearch")?.addEventListener("click", () => { closeDrawer(); searchUI(); });
  $("#btnSearchDrawer")?.addEventListener("click", () => { closeDrawer(); searchUI(); });

  (async () => {
    restoreSession();
    const redirected = await finishOAuth();
    if (logged() && !redirected) await hydrateMe();
    paintChrome();
    render();
    load();
  })();
})();
