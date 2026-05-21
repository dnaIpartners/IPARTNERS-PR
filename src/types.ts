export interface PRRequestParams {
  keywords: string;
  type: string;
  embargo: string;
  companyName: string;
  companyLink: string;
  contact: string;
  tone: string;
  length: string;
  generateImage: boolean;
  imageStyle?: string;
}

export interface CopywritingRequestParams {
  keywords: string;       // 핵심 소구 및 정보
  platform: string;       // SNS 광고 카피, 제품 슬로건, 블로그 제목 등
  tone: string;           // 말투/톤 (트렌디, 전문적, 유머러스 등)
  count: number;          // 매칭 헤드라인/본문 안의 추천안 개수
  targetAudience: string;// 주 타겟 대상
  length: string;         // 짧게, 보통, 길게
}

export interface PRHistoryItem {
  id: string;
  type: 'press-release' | 'copywriting';
  date: string;
  title: string;
  content: string;
  platform?: string; // For copywriting
}
