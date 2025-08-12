import { AppState } from './types';

export const COUNTRIES = {
  ad: {
    name: 'andorra',
    timezones: ['europe/andorra'],
  },
  ae: {
    name: 'united arab emirates',
    timezones: ['asia/dubai'],
  },
  af: {
    name: 'afghanistan',
    timezones: ['asia/kabul'],
  },
  ag: {
    name: 'antigua and barbuda',
    timezones: ['america/antigua'],
  },
  ai: {
    name: 'anguilla',
    timezones: ['america/anguilla'],
  },
  al: {
    name: 'albania',
    timezones: ['europe/tirane'],
  },
  am: {
    name: 'armenia',
    timezones: ['asia/yerevan'],
  },
  ao: {
    name: 'angola',
    timezones: ['africa/luanda'],
  },
  aq: {
    name: 'antarctica',
    timezones: [
      'antarctica/casey',
      'antarctica/davis',
      'antarctica/dumontdurville',
      'antarctica/mawson',
      'antarctica/mcmurdo',
      'antarctica/palmer',
      'antarctica/rothera',
      'antarctica/syowa',
      'antarctica/troll',
      'antarctica/vostok',
    ],
  },
  ar: {
    name: 'argentina',
    timezones: [
      'america/argentina/buenos_aires',
      'america/argentina/catamarca',
      'america/argentina/cordoba',
      'america/argentina/jujuy',
      'america/argentina/la_rioja',
      'america/argentina/mendoza',
      'america/argentina/rio_gallegos',
      'america/argentina/salta',
      'america/argentina/san_juan',
      'america/argentina/san_luis',
      'america/argentina/tucuman',
      'america/argentina/ushuaia',
    ],
  },
  as: {
    name: 'american samoa',
    timezones: ['pacific/pago_pago'],
  },
  at: {
    name: 'austria',
    timezones: ['europe/vienna'],
  },
  au: {
    name: 'australia',
    timezones: [
      'antarctica/macquarie',
      'australia/adelaide',
      'australia/brisbane',
      'australia/broken_hill',
      'australia/currie',
      'australia/darwin',
      'australia/eucla',
      'australia/hobart',
      'australia/lindeman',
      'australia/lord_howe',
      'australia/melbourne',
      'australia/perth',
      'australia/sydney',
    ],
  },
  aw: {
    name: 'aruba',
    timezones: ['america/aruba'],
  },
  ax: {
    name: 'aland islands',
    timezones: ['europe/mariehamn'],
  },
  az: {
    name: 'azerbaijan',
    timezones: ['asia/baku'],
  },
  ba: {
    name: 'bosnia and herzegovina',
    timezones: ['europe/sarajevo'],
  },
  bb: {
    name: 'barbados',
    timezones: ['america/barbados'],
  },
  bd: {
    name: 'bangladesh',
    timezones: ['asia/dhaka'],
  },
  be: {
    name: 'belgium',
    timezones: ['europe/brussels'],
  },
  bf: {
    name: 'burkina faso',
    timezones: ['africa/ouagadougou'],
  },
  bg: {
    name: 'bulgaria',
    timezones: ['europe/sofia'],
  },
  bh: {
    name: 'bahrain',
    timezones: ['asia/bahrain'],
  },
  bi: {
    name: 'burundi',
    timezones: ['africa/bujumbura'],
  },
  bj: {
    name: 'benin',
    timezones: ['africa/porto-novo'],
  },
  bl: {
    name: 'saint-barthelemy',
    timezones: ['america/st_barthelemy'],
  },
  bm: {
    name: 'bermuda',
    timezones: ['atlantic/bermuda'],
  },
  bn: {
    name: 'brunei',
    timezones: ['asia/brunei'],
  },
  bo: {
    name: 'bolivia',
    timezones: ['america/la_paz'],
  },
  bq: {
    name: 'bonaire, sint eustatius and saba',
    timezones: ['america/anguilla'],
  },
  br: {
    name: 'brazil',
    timezones: [
      'america/araguaina',
      'america/bahia',
      'america/belem',
      'america/boa_vista',
      'america/campo_grande',
      'america/cuiaba',
      'america/eirunepe',
      'america/fortaleza',
      'america/maceio',
      'america/manaus',
      'america/noronha',
      'america/porto_velho',
      'america/recife',
      'america/rio_branco',
      'america/santarem',
      'america/sao_paulo',
    ],
  },
  bs: {
    name: 'the bahamas',
    timezones: ['america/nassau'],
  },
  bt: {
    name: 'bhutan',
    timezones: ['asia/thimphu'],
  },
  bv: {
    name: 'bouvet island',
    timezones: ['europe/oslo'],
  },
  bw: {
    name: 'botswana',
    timezones: ['africa/gaborone'],
  },
  by: {
    name: 'belarus',
    timezones: ['europe/minsk'],
  },
  bz: {
    name: 'belize',
    timezones: ['america/belize'],
  },
  ca: {
    name: 'canada',
    timezones: [
      'america/atikokan',
      'america/blanc-sablon',
      'america/cambridge_bay',
      'america/creston',
      'america/dawson',
      'america/dawson_creek',
      'america/edmonton',
      'america/fort_nelson',
      'america/glace_bay',
      'america/goose_bay',
      'america/halifax',
      'america/inuvik',
      'america/iqaluit',
      'america/moncton',
      'america/nipigon',
      'america/pangnirtung',
      'america/rainy_river',
      'america/rankin_inlet',
      'america/regina',
      'america/resolute',
      'america/st_johns',
      'america/swift_current',
      'america/thunder_bay',
      'america/toronto',
      'america/vancouver',
      'america/whitehorse',
      'america/winnipeg',
      'america/yellowknife',
    ],
  },
  cc: {
    name: 'cocos (keeling) islands',
    timezones: ['indian/cocos'],
  },
  cd: {
    name: 'democratic republic of the congo',
    timezones: ['africa/kinshasa', 'africa/lubumbashi'],
  },
  cf: {
    name: 'central african republic',
    timezones: ['africa/bangui'],
  },
  cg: {
    name: 'congo',
    timezones: ['africa/brazzaville'],
  },
  ch: {
    name: 'switzerland',
    timezones: ['europe/zurich'],
  },
  ci: {
    name: "cote d'ivoire (ivory coast)",
    timezones: ['africa/abidjan'],
  },
  ck: {
    name: 'cook islands',
    timezones: ['pacific/rarotonga'],
  },
  cl: {
    name: 'chile',
    timezones: ['america/punta_arenas', 'america/santiago', 'pacific/easter'],
  },
  cm: {
    name: 'cameroon',
    timezones: ['africa/douala'],
  },
  cn: {
    name: 'china',
    timezones: ['asia/shanghai', 'asia/urumqi'],
  },
  co: {
    name: 'colombia',
    timezones: ['america/bogota'],
  },
  cr: {
    name: 'costa rica',
    timezones: ['america/costa_rica'],
  },
  cu: {
    name: 'cuba',
    timezones: ['america/havana'],
  },
  cv: {
    name: 'cape verde',
    timezones: ['atlantic/cape_verde'],
  },
  cw: {
    name: 'curaçao',
    timezones: ['america/curacao'],
  },
  cx: {
    name: 'christmas island',
    timezones: ['indian/christmas'],
  },
  cy: {
    name: 'cyprus',
    timezones: ['asia/famagusta', 'asia/nicosia'],
  },
  cz: {
    name: 'czech republic',
    timezones: ['europe/prague'],
  },
  de: {
    name: 'germany',
    timezones: ['europe/berlin', 'europe/busingen'],
  },
  dj: {
    name: 'djibouti',
    timezones: ['africa/djibouti'],
  },
  dk: {
    name: 'denmark',
    timezones: ['europe/copenhagen'],
  },
  dm: {
    name: 'dominica',
    timezones: ['america/dominica'],
  },
  do: {
    name: 'dominican republic',
    timezones: ['america/santo_domingo'],
  },
  dz: {
    name: 'algeria',
    timezones: ['africa/algiers'],
  },
  ec: {
    name: 'ecuador',
    timezones: ['america/guayaquil', 'pacific/galapagos'],
  },
  ee: {
    name: 'estonia',
    timezones: ['europe/tallinn'],
  },
  eg: {
    name: 'egypt',
    timezones: ['africa/cairo'],
  },
  eh: {
    name: 'western sahara',
    timezones: ['africa/el_aaiun'],
  },
  er: {
    name: 'eritrea',
    timezones: ['africa/asmara'],
  },
  es: {
    name: 'spain',
    timezones: ['africa/ceuta', 'atlantic/canary', 'europe/madrid'],
  },
  et: {
    name: 'ethiopia',
    timezones: ['africa/addis_ababa'],
  },
  fi: {
    name: 'finland',
    timezones: ['europe/helsinki'],
  },
  fj: {
    name: 'fiji islands',
    timezones: ['pacific/fiji'],
  },
  fk: {
    name: 'falkland islands',
    timezones: ['atlantic/stanley'],
  },
  fm: {
    name: 'micronesia',
    timezones: ['pacific/chuuk', 'pacific/kosrae', 'pacific/pohnpei'],
  },
  fo: {
    name: 'faroe islands',
    timezones: ['atlantic/faroe'],
  },
  fr: {
    name: 'france',
    timezones: ['europe/paris'],
  },
  ga: {
    name: 'gabon',
    timezones: ['africa/libreville'],
  },
  gb: {
    name: 'united kingdom',
    timezones: ['europe/london'],
  },
  gd: {
    name: 'grenada',
    timezones: ['america/grenada'],
  },
  ge: {
    name: 'georgia',
    timezones: ['asia/tbilisi'],
  },
  gf: {
    name: 'french guiana',
    timezones: ['america/cayenne'],
  },
  gg: {
    name: 'guernsey',
    timezones: ['europe/guernsey'],
  },
  gh: {
    name: 'ghana',
    timezones: ['africa/accra'],
  },
  gi: {
    name: 'gibraltar',
    timezones: ['europe/gibraltar'],
  },
  gl: {
    name: 'greenland',
    timezones: [
      'america/danmarkshavn',
      'america/nuuk',
      'america/scoresbysund',
      'america/thule',
    ],
  },
  gm: {
    name: 'the gambia ',
    timezones: ['africa/banjul'],
  },
  gn: {
    name: 'guinea',
    timezones: ['africa/conakry'],
  },
  gp: {
    name: 'guadeloupe',
    timezones: ['america/guadeloupe'],
  },
  gq: {
    name: 'equatorial guinea',
    timezones: ['africa/malabo'],
  },
  gr: {
    name: 'greece',
    timezones: ['europe/athens'],
  },
  gs: {
    name: 'south georgia',
    timezones: ['atlantic/south_georgia'],
  },
  gt: {
    name: 'guatemala',
    timezones: ['america/guatemala'],
  },
  gu: {
    name: 'guam',
    timezones: ['pacific/guam'],
  },
  gw: {
    name: 'guinea-bissau',
    timezones: ['africa/bissau'],
  },
  gy: {
    name: 'guyana',
    timezones: ['america/guyana'],
  },
  hk: {
    name: 'hong kong s.a.r.',
    timezones: ['asia/hong_kong'],
  },
  hm: {
    name: 'heard island and mcdonald islands',
    timezones: ['indian/kerguelen'],
  },
  hn: {
    name: 'honduras',
    timezones: ['america/tegucigalpa'],
  },
  hr: {
    name: 'croatia',
    timezones: ['europe/zagreb'],
  },
  ht: {
    name: 'haiti',
    timezones: ['america/port-au-prince'],
  },
  hu: {
    name: 'hungary',
    timezones: ['europe/budapest'],
  },
  id: {
    name: 'indonesia',
    timezones: [
      'asia/jakarta',
      'asia/jayapura',
      'asia/makassar',
      'asia/pontianak',
    ],
  },
  ie: {
    name: 'ireland',
    timezones: ['europe/dublin'],
  },
  il: {
    name: 'israel',
    timezones: ['asia/jerusalem'],
  },
  im: {
    name: 'man (isle of)',
    timezones: ['europe/isle_of_man'],
  },
  in: {
    name: 'india',
    timezones: ['asia/kolkata'],
  },
  io: {
    name: 'british indian ocean territory',
    timezones: ['indian/chagos'],
  },
  iq: {
    name: 'iraq',
    timezones: ['asia/baghdad'],
  },
  ir: {
    name: 'iran',
    timezones: ['asia/tehran'],
  },
  is: {
    name: 'iceland',
    timezones: ['atlantic/reykjavik'],
  },
  it: {
    name: 'italy',
    timezones: ['europe/rome'],
  },
  je: {
    name: 'jersey',
    timezones: ['europe/jersey'],
  },
  jm: {
    name: 'jamaica',
    timezones: ['america/jamaica'],
  },
  jo: {
    name: 'jordan',
    timezones: ['asia/amman'],
  },
  jp: {
    name: 'japan',
    timezones: ['asia/tokyo'],
  },
  ke: {
    name: 'kenya',
    timezones: ['africa/nairobi'],
  },
  kg: {
    name: 'kyrgyzstan',
    timezones: ['asia/bishkek'],
  },
  kh: {
    name: 'cambodia',
    timezones: ['asia/phnom_penh'],
  },
  ki: {
    name: 'kiribati',
    timezones: ['pacific/enderbury', 'pacific/kiritimati', 'pacific/tarawa'],
  },
  km: {
    name: 'comoros',
    timezones: ['indian/comoro'],
  },
  kn: {
    name: 'saint kitts and nevis',
    timezones: ['america/st_kitts'],
  },
  kp: {
    name: 'north korea',
    timezones: ['asia/pyongyang'],
  },
  kr: {
    name: 'south korea',
    timezones: ['asia/seoul'],
  },
  kw: {
    name: 'kuwait',
    timezones: ['asia/kuwait'],
  },
  ky: {
    name: 'cayman islands',
    timezones: ['america/cayman'],
  },
  kz: {
    name: 'kazakhstan',
    timezones: [
      'asia/almaty',
      'asia/aqtau',
      'asia/aqtobe',
      'asia/atyrau',
      'asia/oral',
      'asia/qostanay',
      'asia/qyzylorda',
    ],
  },
  la: {
    name: 'laos',
    timezones: ['asia/vientiane'],
  },
  lb: {
    name: 'lebanon',
    timezones: ['asia/beirut'],
  },
  lc: {
    name: 'saint lucia',
    timezones: ['america/st_lucia'],
  },
  li: {
    name: 'liechtenstein',
    timezones: ['europe/vaduz'],
  },
  lk: {
    name: 'sri lanka',
    timezones: ['asia/colombo'],
  },
  lr: {
    name: 'liberia',
    timezones: ['africa/monrovia'],
  },
  ls: {
    name: 'lesotho',
    timezones: ['africa/maseru'],
  },
  lt: {
    name: 'lithuania',
    timezones: ['europe/vilnius'],
  },
  lu: {
    name: 'luxembourg',
    timezones: ['europe/luxembourg'],
  },
  lv: {
    name: 'latvia',
    timezones: ['europe/riga'],
  },
  ly: {
    name: 'libya',
    timezones: ['africa/tripoli'],
  },
  ma: {
    name: 'morocco',
    timezones: ['africa/casablanca'],
  },
  mc: {
    name: 'monaco',
    timezones: ['europe/monaco'],
  },
  md: {
    name: 'moldova',
    timezones: ['europe/chisinau'],
  },
  me: {
    name: 'montenegro',
    timezones: ['europe/podgorica'],
  },
  mf: {
    name: 'saint-martin (french part)',
    timezones: ['america/marigot'],
  },
  mg: {
    name: 'madagascar',
    timezones: ['indian/antananarivo'],
  },
  mh: {
    name: 'marshall islands',
    timezones: ['pacific/kwajalein', 'pacific/majuro'],
  },
  mk: {
    name: 'north macedonia',
    timezones: ['europe/skopje'],
  },
  ml: {
    name: 'mali',
    timezones: ['africa/bamako'],
  },
  mm: {
    name: 'myanmar',
    timezones: ['asia/yangon'],
  },
  mn: {
    name: 'mongolia',
    timezones: ['asia/choibalsan', 'asia/hovd', 'asia/ulaanbaatar'],
  },
  mo: {
    name: 'macau s.a.r.',
    timezones: ['asia/macau'],
  },
  mp: {
    name: 'northern mariana islands',
    timezones: ['pacific/saipan'],
  },
  mq: {
    name: 'martinique',
    timezones: ['america/martinique'],
  },
  mr: {
    name: 'mauritania',
    timezones: ['africa/nouakchott'],
  },
  ms: {
    name: 'montserrat',
    timezones: ['america/montserrat'],
  },
  mt: {
    name: 'malta',
    timezones: ['europe/malta'],
  },
  mu: {
    name: 'mauritius',
    timezones: ['indian/mauritius'],
  },
  mv: {
    name: 'maldives',
    timezones: ['indian/maldives'],
  },
  mw: {
    name: 'malawi',
    timezones: ['africa/blantyre'],
  },
  mx: {
    name: 'mexico',
    timezones: [
      'america/bahia_banderas',
      'america/cancun',
      'america/chihuahua',
      'america/hermosillo',
      'america/matamoros',
      'america/mazatlan',
      'america/merida',
      'america/mexico_city',
      'america/monterrey',
      'america/ojinaga',
      'america/tijuana',
    ],
  },
  my: {
    name: 'malaysia',
    timezones: ['asia/kuala_lumpur', 'asia/kuching'],
  },
  mz: {
    name: 'mozambique',
    timezones: ['africa/maputo'],
  },
  na: {
    name: 'namibia',
    timezones: ['africa/windhoek'],
  },
  nc: {
    name: 'new caledonia',
    timezones: ['pacific/noumea'],
  },
  ne: {
    name: 'niger',
    timezones: ['africa/niamey'],
  },
  nf: {
    name: 'norfolk island',
    timezones: ['pacific/norfolk'],
  },
  ng: {
    name: 'nigeria',
    timezones: ['africa/lagos'],
  },
  ni: {
    name: 'nicaragua',
    timezones: ['america/managua'],
  },
  nl: {
    name: 'netherlands',
    timezones: ['europe/amsterdam'],
  },
  no: {
    name: 'norway',
    timezones: ['europe/oslo'],
  },
  np: {
    name: 'nepal',
    timezones: ['asia/kathmandu'],
  },
  nr: {
    name: 'nauru',
    timezones: ['pacific/nauru'],
  },
  nu: {
    name: 'niue',
    timezones: ['pacific/niue'],
  },
  nz: {
    name: 'new zealand',
    timezones: ['pacific/auckland', 'pacific/chatham'],
  },
  om: {
    name: 'oman',
    timezones: ['asia/muscat'],
  },
  pa: {
    name: 'panama',
    timezones: ['america/panama'],
  },
  pe: {
    name: 'peru',
    timezones: ['america/lima'],
  },
  pf: {
    name: 'french polynesia',
    timezones: ['pacific/gambier', 'pacific/marquesas', 'pacific/tahiti'],
  },
  pg: {
    name: 'papua new guinea',
    timezones: ['pacific/bougainville', 'pacific/port_moresby'],
  },
  ph: {
    name: 'philippines',
    timezones: ['asia/manila'],
  },
  pk: {
    name: 'pakistan',
    timezones: ['asia/karachi'],
  },
  pl: {
    name: 'poland',
    timezones: ['europe/warsaw'],
  },
  pm: {
    name: 'saint pierre and miquelon',
    timezones: ['america/miquelon'],
  },
  pn: {
    name: 'pitcairn island',
    timezones: ['pacific/pitcairn'],
  },
  pr: {
    name: 'puerto rico',
    timezones: ['america/puerto_rico'],
  },
  ps: {
    name: 'palestinian territory occupied',
    timezones: ['asia/gaza', 'asia/hebron'],
  },
  pt: {
    name: 'portugal',
    timezones: ['atlantic/azores', 'atlantic/madeira', 'europe/lisbon'],
  },
  pw: {
    name: 'palau',
    timezones: ['pacific/palau'],
  },
  py: {
    name: 'paraguay',
    timezones: ['america/asuncion'],
  },
  qa: {
    name: 'qatar',
    timezones: ['asia/qatar'],
  },
  re: {
    name: 'reunion',
    timezones: ['indian/reunion'],
  },
  ro: {
    name: 'romania',
    timezones: ['europe/bucharest'],
  },
  rs: {
    name: 'serbia',
    timezones: ['europe/belgrade'],
  },
  ru: {
    name: 'russia',
    timezones: [
      'asia/anadyr',
      'asia/barnaul',
      'asia/chita',
      'asia/irkutsk',
      'asia/kamchatka',
      'asia/khandyga',
      'asia/krasnoyarsk',
      'asia/magadan',
      'asia/novokuznetsk',
      'asia/novosibirsk',
      'asia/omsk',
      'asia/sakhalin',
      'asia/srednekolymsk',
      'asia/tomsk',
      'asia/ust-nera',
      'asia/vladivostok',
      'asia/yakutsk',
      'asia/yekaterinburg',
      'europe/astrakhan',
      'europe/kaliningrad',
      'europe/kirov',
      'europe/moscow',
      'europe/samara',
      'europe/saratov',
      'europe/ulyanovsk',
      'europe/volgograd',
    ],
  },
  rw: {
    name: 'rwanda',
    timezones: ['africa/kigali'],
  },
  sa: {
    name: 'saudi arabia',
    timezones: ['asia/riyadh'],
  },
  sb: {
    name: 'solomon islands',
    timezones: ['pacific/guadalcanal'],
  },
  sc: {
    name: 'seychelles',
    timezones: ['indian/mahe'],
  },
  sd: {
    name: 'sudan',
    timezones: ['africa/khartoum'],
  },
  se: {
    name: 'sweden',
    timezones: ['europe/stockholm'],
  },
  sg: {
    name: 'singapore',
    timezones: ['asia/singapore'],
  },
  sh: {
    name: 'saint helena',
    timezones: ['atlantic/st_helena'],
  },
  si: {
    name: 'slovenia',
    timezones: ['europe/ljubljana'],
  },
  sj: {
    name: 'svalbard and jan mayen islands',
    timezones: ['arctic/longyearbyen'],
  },
  sk: {
    name: 'slovakia',
    timezones: ['europe/bratislava'],
  },
  sl: {
    name: 'sierra leone',
    timezones: ['africa/freetown'],
  },
  sm: {
    name: 'san marino',
    timezones: ['europe/san_marino'],
  },
  sn: {
    name: 'senegal',
    timezones: ['africa/dakar'],
  },
  so: {
    name: 'somalia',
    timezones: ['africa/mogadishu'],
  },
  sr: {
    name: 'suriname',
    timezones: ['america/paramaribo'],
  },
  ss: {
    name: 'south sudan',
    timezones: ['africa/juba'],
  },
  st: {
    name: 'sao tome and principe',
    timezones: ['africa/sao_tome'],
  },
  sv: {
    name: 'el salvador',
    timezones: ['america/el_salvador'],
  },
  sx: {
    name: 'sint maarten (dutch part)',
    timezones: ['america/anguilla'],
  },
  sy: {
    name: 'syria',
    timezones: ['asia/damascus'],
  },
  sz: {
    name: 'eswatini',
    timezones: ['africa/mbabane'],
  },
  tc: {
    name: 'turks and caicos islands',
    timezones: ['america/grand_turk'],
  },
  td: {
    name: 'chad',
    timezones: ['africa/ndjamena'],
  },
  tf: {
    name: 'french southern territories',
    timezones: ['indian/kerguelen'],
  },
  tg: {
    name: 'togo',
    timezones: ['africa/lome'],
  },
  th: {
    name: 'thailand',
    timezones: ['asia/bangkok'],
  },
  tj: {
    name: 'tajikistan',
    timezones: ['asia/dushanbe'],
  },
  tk: {
    name: 'tokelau',
    timezones: ['pacific/fakaofo'],
  },
  tl: {
    name: 'timor-leste',
    timezones: ['asia/dili'],
  },
  tm: {
    name: 'turkmenistan',
    timezones: ['asia/ashgabat'],
  },
  tn: {
    name: 'tunisia',
    timezones: ['africa/tunis'],
  },
  to: {
    name: 'tonga',
    timezones: ['pacific/tongatapu'],
  },
  tr: {
    name: 'turkey',
    timezones: ['europe/istanbul'],
  },
  tt: {
    name: 'trinidad and tobago',
    timezones: ['america/port_of_spain'],
  },
  tv: {
    name: 'tuvalu',
    timezones: ['pacific/funafuti'],
  },
  tw: {
    name: 'taiwan',
    timezones: ['asia/taipei'],
  },
  tz: {
    name: 'tanzania',
    timezones: ['africa/dar_es_salaam'],
  },
  ua: {
    name: 'ukraine',
    timezones: [
      'europe/kiev',
      'europe/simferopol',
      'europe/uzhgorod',
      'europe/zaporozhye',
    ],
  },
  ug: {
    name: 'uganda',
    timezones: ['africa/kampala'],
  },
  um: {
    name: 'united states minor outlying islands',
    timezones: ['pacific/midway', 'pacific/wake'],
  },
  us: {
    name: 'united states',
    timezones: [
      'america/adak',
      'america/anchorage',
      'america/boise',
      'america/chicago',
      'america/denver',
      'america/detroit',
      'america/indiana/indianapolis',
      'america/indiana/knox',
      'america/indiana/marengo',
      'america/indiana/petersburg',
      'america/indiana/tell_city',
      'america/indiana/vevay',
      'america/indiana/vincennes',
      'america/indiana/winamac',
      'america/juneau',
      'america/kentucky/louisville',
      'america/kentucky/monticello',
      'america/los_angeles',
      'america/menominee',
      'america/metlakatla',
      'america/new_york',
      'america/nome',
      'america/north_dakota/beulah',
      'america/north_dakota/center',
      'america/north_dakota/new_salem',
      'america/phoenix',
      'america/sitka',
      'america/yakutat',
      'pacific/honolulu',
    ],
  },
  uy: {
    name: 'uruguay',
    timezones: ['america/montevideo'],
  },
  uz: {
    name: 'uzbekistan',
    timezones: ['asia/samarkand', 'asia/tashkent'],
  },
  va: {
    name: 'vatican city state (holy see)',
    timezones: ['europe/vatican'],
  },
  vc: {
    name: 'saint vincent and the grenadines',
    timezones: ['america/st_vincent'],
  },
  ve: {
    name: 'venezuela',
    timezones: ['america/caracas'],
  },
  vg: {
    name: 'virgin islands (british)',
    timezones: ['america/tortola'],
  },
  vi: {
    name: 'virgin islands (us)',
    timezones: ['america/st_thomas'],
  },
  vn: {
    name: 'vietnam',
    timezones: ['asia/ho_chi_minh'],
  },
  vu: {
    name: 'vanuatu',
    timezones: ['pacific/efate'],
  },
  wf: {
    name: 'wallis and futuna islands',
    timezones: ['pacific/wallis'],
  },
  ws: {
    name: 'samoa',
    timezones: ['pacific/apia'],
  },
  xk: {
    name: 'kosovo',
    timezones: ['europe/belgrade'],
  },
  ye: {
    name: 'yemen',
    timezones: ['asia/aden'],
  },
  yt: {
    name: 'mayotte',
    timezones: ['indian/mayotte'],
  },
  za: {
    name: 'south africa',
    timezones: ['africa/johannesburg'],
  },
  zm: {
    name: 'zambia',
    timezones: ['africa/lusaka'],
  },
  zw: {
    name: 'zimbabwe',
    timezones: ['africa/harare'],
  },
};

export const INITIAL_STATE: AppState = {
  apiData: '',
  isConnected: true,
  isLoading: false,
  isWv: false,
};
