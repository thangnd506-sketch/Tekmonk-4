
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PlanRequest } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateTripPlan = async (params: PlanRequest) => {
  const prompt = `Hãy lập một kế hoạch du lịch chi tiết từng ngày tại Việt Nam từ ngày ${params.startDate} đến ngày ${params.endDate}.
  - Mức ngân sách: ${params.budget}
  - Sở thích: ${params.interests.join(', ')}
  - Phương tiện di chuyển: ${params.transport}
  - Loại hình lưu trú: ${params.accommodation}
  - Số lượng người: ${params.groupSize}
  
  Yêu cầu trả về định dạng JSON với các thông tin bằng tiếng Việt. Mỗi ngày bao gồm 'day' (số ngày), 'location' (tên thành phố/địa điểm), và 'activities' (mảng các đối tượng {time: thời gian, description: mô tả hoạt động, cost: chi phí ước tính tính bằng VNĐ}).
  Đồng thời bao gồm một tổng chi phí ước tính 'totalEstimate'.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          itinerary: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.INTEGER },
                location: { type: Type.STRING },
                activities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      time: { type: Type.STRING },
                      description: { type: Type.STRING },
                      cost: { type: Type.INTEGER }
                    }
                  }
                }
              }
            }
          },
          totalEstimate: { type: Type.INTEGER }
        }
      }
    }
  });

  return JSON.parse(response.text);
};

export const playPronunciation = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Hãy phát âm rõ ràng bằng tiếng Việt: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      const dataInt16 = new Int16Array(bytes.buffer);
      const buffer = audioContext.createBuffer(1, dataInt16.length, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
      }

      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Lỗi phát âm:", error);
  }
};
