// Multi-language and transliteration search utility
// Supports Russian (Cyrillic) <-> Uzbek/English (Latin) and culinary synonyms

const CYR_TO_LAT: Record<string, string> = {
  'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 'ж': 'j', 'з': 'z',
  'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r',
  'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'x', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sh',
  'ъ': '', 'ы': 'i', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
};

const LAT_TO_CYR: Record<string, string> = {
  'sh': 'ш', 'ch': 'ч', 'yo': 'ё', 'yu': 'ю', 'ya': 'я', 'ts': 'ц',
  'a': 'а', 'b': 'б', 'v': 'в', 'g': 'г', 'd': 'д', 'e': 'е', 'j': 'ж', 'z': 'з',
  'i': 'и', 'y': 'й', 'k': 'к', 'l': 'л', 'm': 'м', 'n': 'н', 'o': 'о', 'p': 'п',
  'r': 'р', 's': 'с', 't': 'т', 'u': 'у', 'f': 'ф', 'x': 'х', 'c': 'к'
};

const CULINARY_SYNONYMS: Record<string, string[]> = {
  'американ': ['american', 'amerikan', 'america', 'usa', 'бургер', 'fast food'],
  'american': ['американ', 'amerikan', 'америка', 'usa'],
  'америк': ['american', 'amerikan'],
  'суши': ['roll', 'maki', 'set', 'ролл'],
  'роллы': ['roll', 'maki', 'set', 'суши'],
  'ролл': ['roll', 'maki'],
  'картошка': ['fri', 'фри', 'kartoshka'],
  'картофель': ['fri', 'фри'],
  'фри': ['fri', 'картошка', 'картофель'],
  'чай': ['choy', 'tea', 'чайник'],
  'кофе': ['kofe', 'coffee'],
  'напитки': ['mohito', 'choy', 'milksheyk', 'sok', 'cola', 'fanta', 'sprite'],
  'напиток': ['mohito', 'choy', 'milksheyk', 'sok', 'cola', 'fanta', 'sprite'],
  'пицца': ['pizza', 'pide', 'пиде'],
  'бургер': ['burger', 'gamburger', 'бургер', 'чизбургер'],
  'чизбургер': ['chizburger', 'cheeseburger', 'сырный бургер'],
  'гамбургер': ['gamburger', 'hamburger', 'burger'],
  'лаваш': ['lavash', 'tandir'],
  'хотдог': ['hot dog', 'hot-dog', 'hotdog'],
  'хот дог': ['hot dog', 'hot-dog', 'hotdog'],
  'соус': ['sous', 'sauce'],
  'десерт': ['san sebastian', 'vaffle', 'чизкейк', 'вафли'],
  'чизкейк': ['san sebastian', 'cheesecake'],
  'вафли': ['vaffle', 'waffle']
};

export function cyrillicToLatin(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => CYR_TO_LAT[char] || char)
    .join('');
}

export function latinToCyrillic(text: string): string {
  let res = text.toLowerCase();
  for (const [lat, cyr] of Object.entries(LAT_TO_CYR)) {
    res = res.replaceAll(lat, cyr);
  }
  return res;
}

export function getSearchVariants(query: string): string[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return [];

  const variants = new Set<string>();
  variants.add(clean);

  // 1. Cyrillic -> Latin
  const lat = cyrillicToLatin(clean);
  variants.add(lat);
  // Also 'k' <-> 'c' interchange (e.g. amerikan <-> american)
  variants.add(lat.replace(/k/g, 'c'));
  variants.add(lat.replace(/c/g, 'k'));

  // 2. Latin -> Cyrillic
  const cyr = latinToCyrillic(clean);
  variants.add(cyr);

  // 3. Synonym matching
  for (const [key, syns] of Object.entries(CULINARY_SYNONYMS)) {
    if (clean.includes(key) || lat.includes(key) || cyr.includes(key)) {
      syns.forEach((s) => variants.add(s.toLowerCase()));
    }
  }

  return Array.from(variants);
}

export function matchProductSearch(
  product: {
    name?: string | null;
    description?: string | null;
    category?: string | null;
  },
  query: string
): boolean {
  if (!query || !query.trim()) return true;

  const variants = getSearchVariants(query);
  const target = [
    product.name || '',
    product.description || '',
    product.category || ''
  ]
    .join(' ')
    .toLowerCase();

  const targetLat = cyrillicToLatin(target);
  const targetCyr = latinToCyrillic(target);

  return variants.some(
    (v) =>
      target.includes(v) ||
      targetLat.includes(v) ||
      targetCyr.includes(v)
  );
}
