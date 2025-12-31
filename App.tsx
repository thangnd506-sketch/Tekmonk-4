
import React, { useState } from 'react';
import { 
  Map as MapIcon, 
  Sparkles, 
  Library, 
  Utensils, 
  Info, 
  Calculator, 
  MessageCircle, 
  CreditCard,
  ChevronRight,
  Search,
  Volume2,
  Calendar,
  Users,
  Briefcase,
  Star,
  MapPin
} from 'lucide-react';
import { PROVINCES, FOODS, PHRASES } from './constants';
import { Province, PlanRequest, FoodItem } from './types';
import { generateTripPlan, playPronunciation } from './geminiService';

// --- View Components ---

const InteractiveMap: React.FC = () => {
  const [selectedProvince, setSelectedProvince] = useState<Province | null>(null);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-2">Bản đồ Tương tác Việt Nam</h1>
        <p className="text-gray-600">Chọn một vùng miền để khám phá các tỉnh thành nổi bật.</p>
      </div>

      <div className="flex-1 relative flex flex-col md:flex-row gap-8 p-6 overflow-auto">
        <div className="flex-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center min-h-[400px]">
          <div className="relative w-full max-w-sm aspect-[1/2] flex flex-col items-center gap-4">
            <div 
              onClick={() => setSelectedProvince(PROVINCES.find(p => p.region === 'North') || null)}
              className="w-full h-1/3 bg-blue-100 hover:bg-blue-200 transition-colors rounded-2xl flex items-center justify-center cursor-pointer border-2 border-blue-300 relative group"
            >
              <span className="font-bold text-blue-700">Miền Bắc</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MapPin className="text-blue-600" />
              </div>
            </div>
            <div 
              onClick={() => setSelectedProvince(PROVINCES.find(p => p.region === 'Central') || null)}
              className="w-full h-1/3 bg-amber-100 hover:bg-amber-200 transition-colors rounded-2xl flex items-center justify-center cursor-pointer border-2 border-amber-300 relative group"
            >
              <span className="font-bold text-amber-700">Miền Trung</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MapPin className="text-amber-600" />
              </div>
            </div>
            <div 
              onClick={() => setSelectedProvince(PROVINCES.find(p => p.region === 'South') || null)}
              className="w-full h-1/3 bg-emerald-100 hover:bg-emerald-200 transition-colors rounded-2xl flex items-center justify-center cursor-pointer border-2 border-emerald-300 relative group"
            >
              <span className="font-bold text-emerald-700">Miền Nam</span>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <MapPin className="text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-[400px] flex flex-col gap-4">
          {selectedProvince ? (
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-lg animate-in fade-in slide-in-from-right duration-300">
              <h2 className="text-2xl font-bold mb-1">{selectedProvince.name}</h2>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ${
                selectedProvince.region === 'North' ? 'bg-blue-50 text-blue-700' :
                selectedProvince.region === 'Central' ? 'bg-amber-50 text-amber-700' :
                'bg-emerald-50 text-emerald-700'
              }`}>
                Khu vực {selectedProvince.region === 'North' ? 'Phía Bắc' : selectedProvince.region === 'Central' ? 'Miền Trung' : 'Phía Nam'}
              </span>
              <p className="text-gray-600 mb-6">{selectedProvince.description}</p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Điểm đến nổi bật</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedProvince.highlights.map(h => (
                      <div key={h.name} className="relative group overflow-hidden rounded-xl h-24">
                        <img src={h.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/30 flex items-end p-2">
                          <span className="text-white text-xs font-medium">{h.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Khí hậu</h3>
                    <p className="text-sm">{selectedProvince.climate}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">Thời điểm đẹp nhất</h3>
                    <p className="text-sm">{selectedProvince.bestTime}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Ẩm thực phải thử</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProvince.specialties.map(s => (
                      <span key={s} className="bg-gray-100 px-3 py-1 rounded-full text-xs font-medium">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <MapIcon className="w-12 h-12 text-gray-300 mb-4" />
              <p className="text-gray-500 font-medium">Chọn một vùng trên bản đồ để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AITripPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);
  const [formData, setFormData] = useState<PlanRequest>({
    startDate: '',
    endDate: '',
    budget: 'medium',
    interests: [],
    transport: 'Máy bay',
    accommodation: 'Khách sạn 3*',
    groupSize: '2 người'
  });

  const interestsOptions = ['Văn hóa', 'Thiên nhiên', 'Ẩm thực', 'Phiêu lưu', 'Nghỉ dưỡng', 'Biển'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateTripPlan(formData);
      setPlan(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2 text-emerald-900">
          <Sparkles className="text-emerald-500" />
          Lập kế hoạch bằng AI
        </h1>
        <p className="text-gray-600">Chia sẻ sở thích của bạn, AI sẽ thiết kế hành trình hoàn hảo nhất.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-y-auto max-h-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Thời gian</label>
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="date" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onChange={e => setFormData(p => ({ ...p, startDate: e.target.value }))}
                />
                <input 
                  type="date" 
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  onChange={e => setFormData(p => ({ ...p, endDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Ngân sách dự kiến</label>
              <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-200">
                {[
                  { id: 'budget', label: 'Tiết kiệm' },
                  { id: 'medium', label: 'Trung bình' },
                  { id: 'premium', label: 'Cao cấp' }
                ].map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setFormData(p => ({ ...p, budget: b.id as any }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${formData.budget === b.id ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-400'}`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700">Sở thích</label>
              <div className="flex flex-wrap gap-2">
                {interestsOptions.map(opt => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => toggleInterest(opt)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      formData.interests.includes(opt) 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-emerald-200'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Số lượng người</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  onChange={e => setFormData(p => ({ ...p, groupSize: e.target.value }))}
                >
                  <option>1 người</option>
                  <option>Cặp đôi</option>
                  <option>Nhóm (3-5)</option>
                  <option>Đoàn lớn (6+)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Phương tiện</label>
                <select 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  onChange={e => setFormData(p => ({ ...p, transport: e.target.value }))}
                >
                  <option>Máy bay</option>
                  <option>Tàu hỏa</option>
                  <option>Xe cá nhân</option>
                  <option>Xe khách</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Đang thiết kế lộ trình...
                </>
              ) : 'Tạo hành trình ngay'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-8 overflow-y-auto max-h-full pb-10">
          {plan ? (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-emerald-600 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Hành trình của bạn</h3>
                  <p className="opacity-80 text-sm">{plan.itinerary.length} Ngày khám phá Việt Nam</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70 uppercase font-bold tracking-widest">Dự chi</p>
                  <p className="text-2xl font-black">{plan.totalEstimate?.toLocaleString()} VNĐ</p>
                </div>
              </div>

              {plan.itinerary.map((day: any) => (
                <div key={day.day} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 font-bold text-lg">
                      {day.day}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">Ngày {day.day}: {day.location}</h4>
                      <p className="text-xs text-gray-400 uppercase font-medium">Hoạt động trong ngày</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {day.activities.map((act: any, idx: number) => (
                      <div key={idx} className="flex gap-4 group">
                        <div className="text-sm font-bold text-gray-400 w-16 pt-1">{act.time}</div>
                        <div className="flex-1 pb-4 border-b border-gray-50 group-last:border-0">
                          <p className="text-sm font-medium text-gray-800">{act.description}</p>
                          <p className="text-xs text-emerald-600 font-bold mt-1">~ {act.cost?.toLocaleString()} VNĐ</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Sẵn sàng xách ba lô lên?</h3>
              <p className="text-gray-500 max-w-md">Điền thông tin vào biểu mẫu bên cạnh để nhận được lộ trình du lịch cá nhân hóa từ AI.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const FoodExplorer: React.FC = () => {
  const [filter, setFilter] = useState('Tất cả');
  const regions = ['Tất cả', 'Miền Bắc', 'Miền Trung', 'Miền Nam'];

  const getRegionKey = (r: string) => {
    if (r === 'Miền Bắc') return 'North';
    if (r === 'Miền Trung') return 'Central';
    if (r === 'Miền Nam') return 'South';
    return 'All';
  };

  const filteredFoods = filter === 'Tất cả' ? FOODS : FOODS.filter(f => f.region === getRegionKey(filter));

  return (
    <div className="p-6 h-full flex flex-col overflow-hidden">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Khám phá Ẩm thực</h1>
          <p className="text-gray-600">Hành trình trải nghiệm hương vị đa dạng của ba miền Bắc - Trung - Nam.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {regions.map(r => (
            <button
              key={r}
              onClick={() => setFilter(r)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === r ? 'bg-emerald-600 text-white shadow-md' : 'text-gray-500 hover:text-emerald-600'}`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto pb-10">
        {filteredFoods.map((food, idx) => (
          <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col">
            <div className="relative h-48">
              <img src={food.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              {food.isMustTry && (
                <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg">
                  Phải thử
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold">{food.name}</h3>
                <span className="text-emerald-600 font-bold text-sm">{food.region === 'North' ? 'Miền Bắc' : food.region === 'Central' ? 'Miền Trung' : 'Miền Nam'}</span>
              </div>
              <p className="text-gray-500 text-sm mb-4 flex-1 line-clamp-2">{food.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {food.tags.map(t => (
                  <span key={t} className="bg-gray-50 text-gray-500 px-2 py-1 rounded-lg text-[10px] font-bold uppercase">{t}</span>
                ))}
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Giá trung bình</p>
                  <p className="text-sm font-bold text-emerald-700">{food.priceRange}</p>
                </div>
                <button className="bg-emerald-50 text-emerald-600 p-2 rounded-xl hover:bg-emerald-600 hover:text-white transition-colors">
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Vietnam101: React.FC = () => {
  const sections = [
    { title: 'Trước khi đi', icon: <Briefcase className="w-5 h-5" />, items: ['Yêu cầu Visa', 'Tiền tệ (VNĐ)', 'SIM & 4G', 'Mẹo đóng gói'] },
    { title: 'Di chuyển', icon: <MapPin className="w-5 h-5" />, items: ['Ứng dụng Grab / Be', 'Xe khách giường nằm', 'Tàu hỏa', 'Vé máy bay nội địa'] },
    { title: 'Văn hóa địa phương', icon: <Star className="w-5 h-5" />, items: ['Trang phục đền chùa', 'Văn hóa tiền Tip', 'Quy tắc bàn ăn', 'Cử chỉ giao tiếp'] },
  ];

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto">
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-black mb-3 text-emerald-950">Cẩm nang Việt Nam</h1>
        <p className="text-emerald-800/60 font-medium">Mọi thứ bạn cần biết để có một hành trình suôn sẻ và ý nghĩa tại dải đất hình chữ S.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        {sections.map((s, idx) => (
          <div key={idx} className="bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              {s.icon}
            </div>
            <h3 className="text-xl font-bold mb-4">{s.title}</h3>
            <ul className="space-y-3">
              {s.items.map(item => (
                <li key={item} className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 cursor-pointer transition-colors group">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-200 group-hover:bg-emerald-500"></div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-emerald-900 rounded-[50px] p-10 text-white relative overflow-hidden mb-10">
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-black mb-4">Học tiếng Việt cơ bản</h2>
            <p className="text-emerald-200/80 mb-8 font-medium">Một vài câu nói cơ bản sẽ giúp bạn gắn kết hơn với người bản địa. Nhấp để nghe phát âm từ AI.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PHRASES.map((p, idx) => (
                <button 
                  key={idx}
                  onClick={() => playPronunciation(p.vietnamese)}
                  className="bg-white/10 hover:bg-white/20 p-4 rounded-3xl backdrop-blur-md border border-white/10 text-left transition-all flex items-center justify-between group"
                >
                  <div>
                    <p className="text-xs font-bold opacity-60 uppercase mb-1">{p.english}</p>
                    <p className="font-black text-lg">{p.vietnamese}</p>
                    <p className="text-[10px] font-mono opacity-50 italic">{p.pronunciation}</p>
                  </div>
                  <Volume2 className="text-emerald-400 group-hover:scale-125 transition-transform" />
                </button>
              ))}
            </div>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="w-64 h-64 bg-emerald-800 rounded-full flex items-center justify-center border-8 border-emerald-700/50">
              <MessageCircle className="w-32 h-32 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BudgetCalculator: React.FC = () => {
  const [days, setDays] = useState(7);
  const [people, setPeople] = useState(2);
  const [style, setStyle] = useState('Trung bình');

  const costs = {
    'Tiết kiệm': { food: 250000, stay: 400000, trans: 100000, sightseeing: 100000 },
    'Trung bình': { food: 600000, stay: 1500000, trans: 300000, sightseeing: 300000 },
    'Cao cấp': { food: 2000000, stay: 6000000, trans: 1000000, sightseeing: 1000000 }
  };

  const current = costs[style as keyof typeof costs];
  const totalFood = current.food * days * people;
  const totalStay = current.stay * days * (people > 2 ? Math.ceil(people/2) : 1);
  const totalTrans = current.trans * days;
  const totalSight = current.sightseeing * days * people;
  const total = totalFood + totalStay + totalTrans + totalSight;

  return (
    <div className="p-6 h-full flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold mb-2">Tính toán Ngân sách</h1>
          <p className="text-gray-600">Nhận ước tính thực tế cho hành trình sắp tới của bạn.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-8 bg-white p-8 rounded-[40px] shadow-sm border border-gray-100">
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase flex items-center justify-between">
                Thời gian
                <span className="text-emerald-600 text-lg">{days} Ngày</span>
              </label>
              <input 
                type="range" min="1" max="30" value={days} 
                onChange={e => setDays(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase flex items-center justify-between">
                Số lượng người
                <span className="text-emerald-600 text-lg">{people} Người</span>
              </label>
              <input 
                type="range" min="1" max="10" value={people} 
                onChange={e => setPeople(Number(e.target.value))}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
            </div>
            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase">Phong cách du lịch</label>
              <div className="grid grid-cols-3 gap-2">
                {['Tiết kiệm', 'Trung bình', 'Cao cấp'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`py-3 rounded-2xl text-xs font-bold border transition-all ${style === s ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' : 'bg-gray-50 text-gray-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="bg-emerald-950 p-8 rounded-[40px] text-white shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
               <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Tổng chi phí dự kiến</p>
               <h2 className="text-4xl font-black mb-1">{total.toLocaleString()} <span className="text-xl font-normal opacity-60">VNĐ</span></h2>
               <p className="text-emerald-400 text-sm font-medium">~ ${(total / 25000).toFixed(0)} USD</p>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              {[
                { label: 'Chỗ ở', value: totalStay, icon: <MapIcon size={16} /> },
                { label: 'Ăn uống', value: totalFood, icon: <Utensils size={16} /> },
                { label: 'Di chuyển', value: totalTrans, icon: <MapPin size={16} /> },
                { label: 'Tham quan', value: totalSight, icon: <Star size={16} /> }
              ].map(item => (
                <div key={item.label} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="text-emerald-600 p-2 bg-emerald-50 rounded-xl">{item.icon}</div>
                    <span className="text-xs font-bold text-gray-400 uppercase">{item.label}</span>
                  </div>
                  <p className="font-black text-lg">{item.value.toLocaleString()} <span className="text-[10px] font-normal opacity-40">VNĐ</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

type View = 'map' | 'planner' | 'library' | 'food' | 'info' | 'budget' | 'community' | 'booking';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('map');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { id: 'map', label: 'Bản đồ Tương tác', icon: <MapIcon size={20} /> },
    { id: 'planner', label: 'Lập hành trình AI', icon: <Sparkles size={20} /> },
    { id: 'library', label: 'Thư viện điểm đến', icon: <Library size={20} /> },
    { id: 'food', label: 'Khám phá ẩm thực', icon: <Utensils size={20} /> },
    { id: 'info', label: 'Cẩm nang du lịch', icon: <Info size={20} /> },
    { id: 'budget', label: 'Tính toán ngân sách', icon: <Calculator size={20} /> },
    { id: 'community', label: 'Cộng đồng', icon: <MessageCircle size={20} /> },
    { id: 'booking', label: 'Đặt dịch vụ', icon: <CreditCard size={20} /> },
  ];

  const renderView = () => {
    switch (activeView) {
      case 'map': return <InteractiveMap />;
      case 'planner': return <AITripPlanner />;
      case 'food': return <FoodExplorer />;
      case 'info': return <Vietnam101 />;
      case 'budget': return <BudgetCalculator />;
      default: return (
        <div className="h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Đang phát triển</h2>
            <p>Tính năng này sẽ sớm ra mắt trong bản cập nhật tới!</p>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] overflow-hidden">
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-gray-100 transition-all duration-300 flex flex-col relative z-50`}>
        <div className="p-6 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 vn-gradient rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-emerald-200">
            VN
          </div>
          {sidebarOpen && <span className="font-black text-xl tracking-tight">Explore<span className="text-emerald-600">VN</span></span>}
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all ${
                activeView === item.id 
                ? 'bg-emerald-50 text-emerald-700 font-bold' 
                : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
              }`}
            >
              <div className={`${activeView === item.id ? 'text-emerald-600' : 'text-gray-400'}`}>
                {item.icon}
              </div>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-50">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center justify-center p-3 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all"
          >
            {sidebarOpen ? <ChevronRight className="rotate-180" /> : <ChevronRight />}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-20 bg-white/60 backdrop-blur-md flex items-center justify-between px-8 border-b border-gray-100 sticky top-0 z-40">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              placeholder="Tìm kiếm điểm đến, món ăn, văn hóa..." 
              className="w-full bg-gray-50 border-none rounded-2xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-2xl">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-emerald-700">Trạng thái: Trực tuyến</span>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-emerald-50 transition-colors">
              <Users size={20} className="text-gray-500" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-gray-50/30">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
