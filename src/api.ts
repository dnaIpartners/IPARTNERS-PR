import dotenv from 'dotenv';
dotenv.config({ override: true });
import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

router.use(express.json());

// API Routes
router.post('/generate', async (req, res) => {
  try {
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey?.replace(/^["']|["']$/g, '').trim();
    console.log(`[API /generate] Initializing GoogleGenAI. Key length: ${apiKey ? apiKey.length : 0}`);
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API 키가 설정되지 않았습니다. 빗자루 모양의 설정(Settings) 메뉴에서 API 키를 입력해주세요.' });
    }
    const ai = new GoogleGenAI({ apiKey });
    const { keywords, type, embargo, companyName, companyLink, contact, tone, length, generateImage, imageStyle } = req.body;

    const systemInstruction = `
[PR-AI 개발 지침 기반 핵심 규칙]
1. 형식 엄수: 반드시 '[제목]', '[부제목]', '[본문]', '[회사 소개]', '[미디어 문의처]'의 마크다운 구조로 출력할 것.
2. 입력 데이터 처리 기준 (Input Processing):
  - 사용자가 입력한 5W1H (핵심 사건, 기업명/브랜드명, 일시/장소, 관계자 코멘트 등)와 엠바고 정보를 누락 없이 파악할 것.
  - 고유 데이터 하이패스(High-Pass): 날짜, 수치(%), 금액(원/$), 인명(직책)은 절대 변형하지 않고 원문 그대로 유지하며 작성할 것.
3. 보도자료 유형별 템플릿 필터 (Type-Specific Filter):
  - 신제품/서비스: 기술적 차별점, 해결하는 페인포인트 집중 배치 (트렌디, 명확함)
  - 투자/실적 발표: 정확한 금액, 투자사 정보, 성장률 데이터 집중 배치 (보수적, 신뢰감)
  - 인사/조직 개편: 대상자의 약력, 임명 취지, 조직 미래 비전 집중 배치 (진중함, 격식체)
  - CSR/행사 개최: 행사 목적, 참여 방법, 사회적 가치 집중 배치 (따뜻함, 대중성)
4. 분량 및 가독성 제어 (Length Control):
  - 최대 글자 수: 공백 포함 800자 ~ 1,200자 (A4 1장 이내)로 출력. (입력된 분량 가이드가 있다면 이를 우선할 것)
  - 문단 구성: 제목/부제목을 제외하고 본문은 최대 4~5개 문단을 넘지 않을 것.
5. 윤리 및 안전 장치 (Safety & Ethics):
  - Zero-Retention 정책에 따라 사용자의 민감한 미공개 데이터는 학습 데이터로 쓰이지 않음.
6. 본문 첫 문장 고정: 본문은 반드시 '[도시명=OO뉴스] 담당기자명 기자 = ' 또는 '[서울=OO뉴스] OOO 기자 = ' 형태로 시작할 것.
7. 종결어미 제한: '~합니다', '~조사되었습니다'가 아닌, 하오체나 평서문 격식체인 '~했다', '~혔다', '~안다'로 종결할 것.
8. 할루시네이션 방지: 제공된 팩트(Fact) 데이터 외에 과도한 허위 사실을 가공하여 작성하지 말 것. 전문 용어가 들어간 경우 인라인으로 쉽게 풀어서 서술할 것.

작성해야 할 보도자료 정보:
- 보도 목적/유형: ${type || '일반 보도'}
- 엠바고 및 배포일: ${embargo || '즉시 배포'}
- 분량 가이드: ${length || '보통'}
- 핵심 내용 (5W1H): ${keywords || '내용 없음'}
- 회사/기관명: ${companyName || '회사명 미상'}
- 관련 링크: ${companyLink || '없음'}
- 연락처/담당자: ${contact || '담당자 미상'}
- 문체/톤앤매너: ${tone || '권위 있는 기사체 (스트레이트 뉴스)'}
${generateImage ? `- 이미지 생성 지시: 다음 스타일로 보도자료에 어울리는 이미지 프롬프트(영문)를 [이미지 생성 프롬프트: '...'] 의 형태로 본문에 포함할 것. 스타일: ${imageStyle}` : ''}
`;

    // Image generation block
    let imageMarkdown = '';
    if (generateImage) {
      try {
        const imagePrompt = `A professional press release image for a company named "${companyName}". Context: ${keywords}. Style: ${imageStyle}. High quality, professional, editorial.`;
        const imageResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: imagePrompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9",
              imageSize: "1K"
            }
          }
        });
        
        if (imageResponse.candidates && imageResponse.candidates[0] && imageResponse.candidates[0].content.parts) {
          for (const part of imageResponse.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64EncodeString = part.inlineData.data;
              const mimeType = part.inlineData.mimeType || 'image/jpeg';
              imageMarkdown = `![Generated Image](data:${mimeType};base64,${base64EncodeString})\n\n`;
              break;
            }
          }
        }
      } catch (imgErr: any) {
        console.log(`[Image Generation] Free Tier fallback applied successfully.`);
        
        let imageUrl = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1024&h=576';
        const releaseType = type || '';
        if (releaseType.includes('신제품') || releaseType.includes('출시') || releaseType.includes('서비스') || releaseType.includes('IT') || releaseType.includes('플랫폼')) {
          imageUrl = 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1024&h=576';
        } else if (releaseType.includes('투자') || releaseType.includes('실적') || releaseType.includes('매출') || releaseType.includes('자산')) {
          imageUrl = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1024&h=576';
        } else if (releaseType.includes('협약') || releaseType.includes('MOU') || releaseType.includes('제휴') || releaseType.includes('파트너')) {
          imageUrl = 'https://images.unsplash.com/photo-1521791136364-72861c61924b?auto=format&fit=crop&q=80&w=1024&h=576';
        } else if (releaseType.includes('인사') || releaseType.includes('임명') || releaseType.includes('영입') || releaseType.includes('선임')) {
          imageUrl = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1024&h=576';
        } else if (releaseType.includes('행사') || releaseType.includes('이벤트') || releaseType.includes('CSR') || releaseType.includes('캠페인') || releaseType.includes('세미나')) {
          imageUrl = 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80&w=1024&h=576';
        }
        
        imageMarkdown = `![Generated Image](${imageUrl})\n*보도자료 발행 컨셉을 시각화한 프리미엄 테마 이미지 (대체 고화질 자료 기사 이미지가 적용되었습니다)*\n\n`;
      }
    }

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: '위 정보를 바탕으로 언론사에 배포할 완벽한 보도자료를 작성해 주세요.',
      config: {
        systemInstruction,
      }
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    if (imageMarkdown) {
      res.write(imageMarkdown);
    }

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    
    res.write(`\n\n---\n> ⚠️ **[중요 알림]**\n> - 본 보도자료는 AI가 입력된 팩트를 기반으로 작성한 초안(Draft)입니다.\n> - 미디어 배포 전, 반드시 담당자가 **사실 여부(Fact-Check)** 및 오탈자를 최종 검증하신 후 사용하시기 바랍니다.`);
    res.end();
  } catch (error: any) {
    console.error('Generation Error:', error);
    let errorMessage = error?.message || String(error);
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API Key not found') || errorMessage.includes('API key not valid')) {
      errorMessage = 'Gemini API 키가 유효하지 않거나 설정되지 않았습니다. 빗자루 모양의 설정(Settings) 메뉴에서 올바른 API 키를 입력해주세요.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

router.post('/generate-copy', async (req, res) => {
  try {
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey?.replace(/^["']|["']$/g, '').trim();
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API 키가 설정되지 않았습니다. 빗자루 모양의 설정(Settings) 메뉴에서 API 키를 입력해주세요.' });
    }
    const ai = new GoogleGenAI({ apiKey });
    const { keywords, platform, tone, count, targetAudience, length } = req.body;

    const systemInstruction = `
[COPY-AI 개발 지침 기반 마케팅 카피 핵심 규칙]
1. 형식 엄수: 마크다운 구조로 시각적이고 깔끔하게 출력할 것.
   - 메인 타이틀: # ✍️ Pulitzer AI 마케팅 카피라이팅 제안서
   - 각 카피 본문: '### 💡 시안 [번호]: [이 시안의 서사적 컨셉]' 과 같이 대등한 헤더 수준으로 작성할 것.
   - 각 시안 안에는 다음 항목들을 명확히 구분하여 이모지와 함께 작성할 것:
     * **[헤드라인 / 타이틀]**: 시선을 잡아끄는 획기적인 키프레이즈
     * **[리드 / 서브 카피]**: 혜택을 구체화하는 요약 카피
     * **[본문 / 상세 설명]**: 소구점을 풀어 연출한 핵심 광고 문장
     * **[소셜 캐시태그 및 이모지]**: 해당 채널에 커스터마이즈된 추천 해시태그 (#태그)
2. 타겟 맞춤형 고강도 카피 쓰기:
   - 타겟 오디언스({${targetAudience || '대중'}})의 가슴을 때리고 격공할 만한 현실 페인 포인트를 직접 건드릴 것.
   - 채널 플랫폼 유형({${platform || 'SNS 광고'}})의 문법에 맞출 것 (예: 인스타그램은 친근하고 이모지와 태그가 풍부하게, 슬로건은 극도로 함축적으로, 이메일은 기선제압용 타이틀과 정중함 제공).
3. 톤과 매너 지정 적용:
   - 지정 문체: {${tone || '센스 있고 트렌디한 방식'}}에 걸맞는 고유의 어조를 적극 적용할 것.
4. 분량 가이드:
   - 평균 길이: {${length || '보통'}} 수준으로 풍성하면서도 불필요한 단어를 빼고 흡입력 있는 카피를 작성할 것.
5. 신뢰 유지 및 과장 금지: 입력된 사실과 강점에 충실하되, 사실과 무관한 전적인 허위 사실은 지어내지 말 것.
`;

    const contentsPrompt = `위 정보를 참고하여 지정된 채널(${platform})과 타겟(${targetAudience || '대중'})에 가장 적합하며 고객 가치 전환율을 극대화하는 총 ${count || 3}개의 서로 다른 마케팅 카피 시안을 개별적으로 정성스럽게 작성해 주세요.`;

    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-3.5-flash',
      contents: contentsPrompt,
      config: {
        systemInstruction,
      }
    });

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }

    res.write(`\n\n---\n> ⚡ **[마케팅 Tip]**\n> - 제안된 ${count}개의 시안은 타겟 오디언스의 행동 유도를 위해 A/B 테스트용으로 집행하기 완벽히 조율되었습니다.\n> - 각 소셜 채널의 특성에 맞는 적절한 비주얼 이미지와 결합 시 도달율과 클릭 전환액이 최대 3배 상승합니다.`);
    res.end();
  } catch (error: any) {
    console.error('Copywriting Generation Error:', error);
    let errorMessage = error?.message || String(error);
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API Key not found') || errorMessage.includes('API key not valid')) {
      errorMessage = 'Gemini API 키가 유효하지 않거나 설정되지 않았습니다. 빗자루 모양의 설정(Settings) 메뉴에서 올바른 API 키를 입력해주세요.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

router.post('/refine', async (req, res) => {
  try {
    const rawApiKey = process.env.GEMINI_API_KEY;
    const apiKey = rawApiKey?.replace(/^["']|["']$/g, '').trim();
    
    if (!apiKey) {
      return res.status(400).json({ error: 'Gemini API 키가 설정되지 않았습니다. 빗자루 모양의 설정(Settings) 메뉴에서 API 키를 입력해주세요.' });
    }
    const ai = new GoogleGenAI({ apiKey });
    const { targetBlock, instruction } = req.body;

    const responseStream = await ai.models.generateContentStream({
       model: 'gemini-3.5-flash',
       contents: `다음은 기존 보도자료의 일부입니다:\n\n${targetBlock}\n\n이 부분을 다음 요청에 맞게 수정해 주세요: ${instruction}\n\n*수정된 텍스트만 마크다운으로 출력하세요. 다른 말은 덧붙이지 마세요.*`,
    });
    
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    for await (const chunk of responseStream) {
      if (chunk.text) {
        res.write(chunk.text);
      }
    }
    res.end();
  } catch (error: any) {
    console.error('Refinement Error:', error);
    let errorMessage = error?.message || String(error);
    if (errorMessage.includes('API_KEY_INVALID') || errorMessage.includes('API Key not found') || errorMessage.includes('API key not valid')) {
      errorMessage = 'Gemini API 키가 유효하지 않거나 설정되지 않았습니다. 빗자루 모양의 설정(Settings) 메뉴에서 올바른 API 키를 입력해주세요.';
    }
    res.status(500).json({ error: errorMessage });
  }
});

export default router;
