
import { Province, FoodItem, Phrase } from './types';

export const PROVINCES: Province[] = [
  {
    id: 'hanoi',
    name: 'Hà Nội',
    region: 'North',
    description: 'Thủ đô ngàn năm văn hiến với kiến trúc cổ kính, văn hóa ẩm thực phong phú và sự giao thoa giữa truyền thống và hiện đại.',
    highlights: [
      { name: 'Phố Cổ', image: 'https://picsum.photos/seed/hanoi-1/400/300', rating: 4.8, description: 'Những con phố nhỏ đầy sức sống và lịch sử.' },
      { name: 'Hồ Hoàn Kiếm', image: 'https://picsum.photos/seed/hanoi-2/400/300', rating: 4.9, description: 'Trái tim của thủ đô với Tháp Rùa cổ kính.' }
    ],
    specialties: ['Phở Hà Nội', 'Bún Chả', 'Cà Phê Trứng'],
    climate: 'Nhiệt đới gió mùa với 4 mùa rõ rệt.',
    bestTime: 'Tháng 9 đến tháng 11 (Mùa thu) hoặc tháng 3 đến tháng 4 (Mùa xuân).'
  },
  {
    id: 'danang',
    name: 'Đà Nẵng',
    region: 'Central',
    description: 'Thành phố đáng sống nhất Việt Nam, nổi tiếng với những bãi biển tuyệt đẹp và những cây cầu biểu tượng.',
    highlights: [
      { name: 'Ngũ Hành Sơn', image: 'https://picsum.photos/seed/danang-1/400/300', rating: 4.7, description: 'Năm ngọn núi đá vôi với hệ thống hang động và chùa chiền.' },
      { name: 'Cầu Vàng', image: 'https://picsum.photos/seed/danang-2/400/300', rating: 4.9, description: 'Cây cầu biểu tượng được nâng đỡ bởi đôi bàn tay khổng lồ.' }
    ],
    specialties: ['Mì Quảng', 'Bánh Tráng Cuốn Thịt Heo'],
    climate: 'Nhiệt đới, chia làm hai mùa mưa và khô.',
    bestTime: 'Tháng 1 đến tháng 5.'
  },
  {
    id: 'hcmc',
    name: 'TP. Hồ Chí Minh',
    region: 'South',
    description: 'Trung tâm kinh tế năng động nhất Việt Nam, nơi giao thoa của nhiều luồng văn hóa và nhịp sống hiện đại hối hả.',
    highlights: [
      { name: 'Nhà thờ Đức Bà', image: 'https://picsum.photos/seed/hcmc-1/400/300', rating: 4.6, description: 'Công trình kiến trúc Pháp cổ kính biểu tượng.' },
      { name: 'Chợ Bến Thành', image: 'https://picsum.photos/seed/hcmc-2/400/300', rating: 4.5, description: 'Ngôi chợ sầm uất lâu đời bậc nhất Sài Gòn.' }
    ],
    specialties: ['Cơm Tấm', 'Hủ Tiếu Nam Vang', 'Bánh Mì'],
    climate: 'Nhiệt đới với hai mùa mưa nắng rõ rệt.',
    bestTime: 'Tháng 12 đến tháng 4 năm sau.'
  }
];

export const FOODS: FoodItem[] = [
  {
    name: 'Phở Bò',
    region: 'North',
    image: 'https://picsum.photos/seed/pho/400/300',
    priceRange: '40.000 - 100.000 VNĐ',
    description: 'Món ăn quốc hồn quốc túy của Việt Nam với nước dùng thanh ngọt, bánh phở mềm và thịt bò thơm ngon.',
    spots: ['Phở Thìn (Lò Đúc)', 'Phở Gia Truyền (Bát Đàn)'],
    isMustTry: true,
    tags: ['Món nước', 'Thịt bò', 'Truyền thống']
  },
  {
    name: 'Mì Quảng',
    region: 'Central',
    image: 'https://picsum.photos/seed/miquang/400/300',
    priceRange: '30.000 - 60.000 VNĐ',
    description: 'Sợi mì vàng óng ăn kèm với nước dùng đậm đà, tôm, thịt heo và bánh đa giòn rụm.',
    spots: ['Mì Quảng Ếch Bếp Trang'],
    isMustTry: true,
    tags: ['Mì', 'Đặc sản miền Trung']
  }
];

export const PHRASES: Phrase[] = [
  { vietnamese: 'Xin chào', english: 'Hello', pronunciation: 'Sin chow' },
  { vietnamese: 'Cảm ơn', english: 'Thank you', pronunciation: 'Gahm uhn' },
  { vietnamese: 'Bao nhiêu tiền?', english: 'How much?', pronunciation: 'Bow nyew tyen?' },
  { vietnamese: 'Ngon quá', english: 'Very delicious', pronunciation: 'Ngohn kwah' }
];
