// All site copy lives here. Source: thimphutower.com (cached in _source/), cleaned of typos and
// template leftovers. Anything not stated by the hotel is marked TO_CONFIRM in README.md.

export const hotel = {
  name: 'Thimphu Tower Hotel',
  shortName: 'Thimphu Tower',
  since: 2015,
  rooms: 28,
  stars: 3,
  location: 'Right in the centre of Thimphu, next to the Thimphu Clock Tower.',
  summary:
    'Located in the heart of the city, we have 28 rooms overlooking the Clock Tower Square and the Changlimithang stadium.',
  welcome:
    'Our friendly staff and clean rooms are at your disposal 24 hours a day. Please drop in whenever you visit Thimphu.',
  intro:
    'The Thimphu Tower Hotel is a vibrant 3-star boutique design hotel in the heart of Thimphu with a passion for meaningful comfort and practical luxury. We offer the discerning world traveller an authentic experience of the Bhutan of today, a balance of traditional and modern.',
  address: { line1: 'Clock Tower Square', city: 'Thimphu', country: 'Bhutan', postcode: '00975' },
  phone: { display: '+975 2 335 367', href: 'tel:+97502335367' },
  mobile: { display: '+975 17 110 988', href: 'tel:+97517110988', whatsapp: 'https://wa.me/97517110988' },
  email: 'thimphutowers@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=100063471611976',
  tripadvisor:
    'https://www.tripadvisor.com/Hotel_Review-g293845-d7930068-Reviews-Hotel_Thimphu_Towers-Thimphu_Thimphu_District.html',
  maps: 'https://maps.app.goo.gl/?link=https://www.google.com/maps/place/Hotel+Thimphu+Tower/@27.4738248,89.6386902,17z',
  mapsSearch: 'https://www.google.com/maps/search/?api=1&query=Hotel+Thimphu+Tower+Clock+Tower+Square+Thimphu',
  geo: { lat: 27.4738248, lng: 89.6386902 },
  checkIn: '2:00 PM',
  checkOut: '12:00 PM',
  taxes: 'Rates are per room per night in Ngultrum (Nu), plus 10% BST and 10% service charge.',
  siteUrl: 'https://thimphutower.com',
};

export type Room = {
  slug: string;
  name: string;
  category: 'Deluxe' | 'Premium';
  occupancy: 'Single' | 'Double';
  price: number;
  image: string;
  gallery: string[];
  description: string;
  oldUrl: string;
};

export const rooms: Room[] = [
  {
    slug: 'deluxe-single',
    name: 'Deluxe Single Room',
    category: 'Deluxe',
    occupancy: 'Single',
    price: 4500,
    image: 'room-deluxe-single',
    gallery: ['room-deluxe-single', 'room-double-red', 'room-twin-light'],
    description:
      'Our Deluxe room at single rate. A bedroom with its own bathroom, and buffet breakfast to start the day before you head out into the city.',
    oldUrl: '/del_single.php',
  },
  {
    slug: 'deluxe-double',
    name: 'Deluxe Double Room',
    category: 'Deluxe',
    occupancy: 'Double',
    price: 5000,
    image: 'room-deluxe-double',
    gallery: ['room-deluxe-double', 'room-twin-gold', 'room-twin-timber'],
    description:
      'The Deluxe room at double rate, for couples, friends and families. The same private bathroom and comforts, with space to share.',
    oldUrl: '/del_double.php',
  },
  {
    slug: 'premium-single',
    name: 'Premium Single Room',
    category: 'Premium',
    occupancy: 'Single',
    price: 5500,
    image: 'room-premium-single',
    gallery: ['room-premium-single', 'room-twin-view', 'room-twin-light'],
    description:
      'Our Premium room at single rate. A bedroom with its own bathroom, a work desk with chair, a sofa and a large wardrobe.',
    oldUrl: '/pre_single.php',
  },
  {
    slug: 'premium-double',
    name: 'Premium Double Room',
    category: 'Premium',
    occupancy: 'Double',
    price: 6000,
    image: 'room-premium-double',
    gallery: ['room-premium-double', 'room-bay-view', 'room-twin-view'],
    description:
      'The Premium room at double rate, for couples and families who want the most room. Its own bathroom and generous windows onto Thimphu.',
    oldUrl: '/pre_double.php',
  },
];

/** In-room features stated on every room listing of the original site. */
export const inRoom = [
  'Private bathroom with geyser',
  'Air conditioning',
  'TV',
  'Free Wi-Fi',
  'Fridge',
  'Telephone',
  'Work desk with chair',
  'Sofa',
  'Large wardrobe',
  'Coffee maker',
  'Toiletries',
  'Locker',
  'Buffet breakfast',
];

export const roomServices = [
  'Welcome drinks',
  'Room service',
  'Newspaper',
  'Concierge',
  'Restaurant',
  'Prayer room',
  'Free parking',
  'Children welcome',
  'Bonfire',
  'Designated smoking zone',
];

export const facilities: { group: string; items: string[] }[] = [
  { group: 'Sleep', items: ['Air conditioning', 'Flatscreen TV', 'In-room safe', 'Room service', 'Family rooms', 'Non-smoking rooms'] },
  { group: 'Eat & drink', items: ['Restaurant', 'Bar and lounge', 'Breakfast buffet', 'Free breakfast'] },
  { group: 'Getting around', items: ['Airport transportation', 'Car hire', 'Concierge', 'Baggage storage'] },
  { group: 'Looking after you', items: ['Free high-speed Wi-Fi', 'Laundry service', 'Dry cleaning', 'Ironing service', 'Fitness gym'] },
];

export const dining = {
  title: 'Dining over the square',
  text: 'If you are looking for delicious and refreshing food, curated to your choice, you are welcome at our restaurant, where we have crafted some of the best dishes across all cuisines.',
};

export const experiences = [
  {
    slug: 'festivals',
    title: 'Famous festivals of Bhutan',
    image: 'activity-festival',
    text: 'Bhutan is overflowing with cultural activities, no matter when you plan to visit. In particular, visit during a festival to enjoy a colourful phase of your journey. Every month, Bhutan holds at least one cultural festival or celebration.',
  },
  {
    slug: 'buddha-dordenma',
    title: 'A date with the Buddha',
    image: 'activity-buddha',
    text: 'About a 20-minute drive from the hotel stands one of Bhutan’s most significant landmarks: the 169-foot Buddha Dordenma statue, adorned with 125,000 miniature Buddhas. Visit this majestic structure for a captivating encounter with the embodiment of journeys and awakenings.',
  },
  {
    slug: 'pangrizampa',
    title: 'The star readers of Pangrizampa',
    image: 'activity-astrology',
    text: 'Enriched with ancient legends, Pangrizampa College of Astrology lies a short 30-minute drive from Thimphu town. This revered institution is home to over a hundred monks devoted to the study of astrology.',
  },
  {
    slug: 'personalised-stamps',
    title: 'Personalised stamps',
    image: 'activity-stamps',
    text: 'Capture your moments in Bhutan on a personalised postage stamp, and send word of your journey home to the people you love.',
  },
];

/** Personalised stamps feature: one real image, plus places to take your stamp photo. */
export const stampStories = {
  title: 'Your journey, on a stamp',
  intro:
    'Capture your moments in Bhutan on a personalised postage stamp, and send word of your journey home to the people you love. Bhutan is famous for its stamps; yours can carry your own photograph.',
  steps: [
    { title: 'Choose your photo', text: 'A family portrait, a moment from your trek, the view from your window.' },
    { title: 'Bhutan Post prints it', text: 'Your photo becomes a sheet of real Bhutanese postage stamps.' },
    { title: 'Send it home', text: 'Post your postcards to the people you love, or keep the sheet as a memento.' },
  ],
  image: 'activity-stamps',
  places: [
    { id: 'paro', place: 'Tiger’s Nest viewpoint', region: 'Paro', text: 'Take your family photo on the trail opposite Paro Taktsang, with the monastery on its cliff behind you.' },
    { id: 'punakha', place: 'Punakha Dzong', region: 'Punakha', text: 'Gather three generations on the steps of the dzong, with the river and the whitewashed fortress as your backdrop.' },
    { id: 'dochula', place: 'Dochula Pass', region: 'Thimphu–Punakha road', text: 'Stand among the 108 chortens, with prayer flags overhead and the Himalaya on a clear day.' },
    { id: 'dordenma', place: 'Buddha Dordenma', region: 'Thimphu', text: 'Pose below the golden Buddha above Thimphu, then write your postcards with the whole valley in view.' },
  ],
  share: 'Made a stamp on your trip? Send us the photo. With your permission, we would love to share it here.',
};

/** Events the hotel itself photographed on Clock Tower Square (gallery captions). */
export const squareEvents = ['Tarayana Fair', 'Druk Super Star', 'National Film Awards', 'Festival days', 'First snow'];

export const about = {
  vision: 'To provide the finest hospitality experiences in Bhutan, and in doing so, contribute to nation building.',
  mission: [
    {
      title: 'Creating memorable experiences for our guests',
      text: 'We build and nurture trust through absolute attention to detail, and by truly listening and taking time to understand the needs of our guests.',
    },
    {
      title: 'Growing people',
      text: 'Our guests deserve the very best at all times. To ensure this, we are committed for the very long term to investing time and resources in growing and nurturing our greatest asset: our team, the future leaders in hospitality.',
    },
    {
      title: 'Transforming lives',
      text: 'The Thimphu Tower Hotel is dedicated to creating a positive and meaningful impact on the environment around us. We support sustainable and green practices, the arts, cottage and small enterprises, and community heroes supporting Bhutan’s development goals in both public and private spheres.',
    },
  ],
  community: [
    'Our dedication to women’s empowerment is reflected in our staff, where women lead with grace and expertise.',
    'Reverse-osmosis drinking water removes the need for plastic bottles, and our laundry baskets are made from recycled water bottles by a women’s group in Samdrupjongkhar.',
  ],
};

export const testimonials = [
  {
    name: 'Adin B',
    context: 'Harvard-Bhutan Trek',
    quote:
      'Thimphu Towers was the perfect home base for the Harvard-Bhutan Trek. My room was very comfortable and had a wonderful view of the central square. The hotel’s food was also quite good!',
  },
  {
    name: 'Sanjay Patel',
    context: 'Guest',
    quote:
      'The place is just fantastic and the ambience of this place is just great. The rooms in this property are just awesome and their services were just satisfactory as well. I had a fab experience staying here.',
  },
];

export const downloads = [
  {
    title: 'Harvard/MIT Trek, Group 1 report (2025)',
    size: '1.0 MB',
    text: 'Key findings, analysis and outcomes from the collaborative work of Harvard Group 1.',
    file: '/downloads/Harvard_MIT_GROUP_1_Report_2025.pdf',
    date: '4 February 2026',
  },
  {
    title: 'Harvard/MIT Trek, Group 2 report (2026)',
    size: '2.1 MB',
    text: 'Key findings, analysis and outcomes from the collaborative work of Harvard Group 2.',
    file: '/downloads/Harvard_MIT_Trek_Group_2_Report_2026.pdf',
    date: '4 February 2026',
  },
];

export const nav = [
  { href: '/rooms/', label: 'Rooms' },
  { href: '/the-building/', label: 'The Building' },
  { href: '/experiences/', label: 'Experiences' },
  { href: '/gallery/', label: 'Gallery' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
];

export const galleryCategories = [
  { id: 'all', label: 'Everything' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'building', label: 'The building' },
  { id: 'dining', label: 'Dining' },
  { id: 'square', label: 'On the square' },
  { id: 'people', label: 'Team & community' },
] as const;

export const nu = (n: number) => `Nu ${n.toLocaleString('en-IN')}`;
