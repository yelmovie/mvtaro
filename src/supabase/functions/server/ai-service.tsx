// AI Service for Tarot Interpretation
// Uses OpenAI GPT-4o-mini API

interface TarotInterpretationRequest {
  cardName: string;
  position: string;
  question: string;
  isReversed: boolean;
  cardNumber: number;
  userProfile?: {
    name?: string;
    friendName?: string;
    birthDate?: string;
    birthTime?: string;
    mbti?: string;
    personalityAnswers?: number[];
  };
}

interface TarotInterpretationResponse {
  basic: string;
  detailed: string;
  advice: string[];
}

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// Get position-specific context for better AI interpretation
function getPositionContext(position: string): string {
  switch (position) {
    case '과거':
      return `과거 카드는 이 관계가 어떻게 시작되었는지, 두 사람의 관계의 뿌리가 무엇인지를 보여줍니다. 
이미 지나간 일이므로, 그 경험에서 배울 점을 찾고, 좋은 추억은 소중히 간직하며, 아쉬웠던 부분은 앞으로 개선할 수 있다는 긍정적인 관점으로 해석해주세요.`;
    
    case '현재':
      return `현재 카드는 지금 이 순간 두 사람의 관계 상태를 보여줍니다.
현재 상황을 있는 그대로 이해하고, 지금 할 수 있는 구체적인 행동을 제안해주세요. 현재의 모습이 미래를 만든다는 희망적인 메시지를 전달해주세요.`;
    
    case '가능성':
      return `가능성 카드는 앞으로 이 관계가 나아갈 수 있는 밝은 방향을 보여줍니다.
미래는 정해진 것이 아니라 두 사람의 노력으로 만들어갈 수 있다는 것을 강조하고, 구체적이고 실천 가능한 방법을 통해 더 좋은 관계를 만들 수 있다는 희망적인 메시지를 전달해주세요.`;
    
    default:
      return '';
  }
}

export async function generateTarotInterpretation(
  request: TarotInterpretationRequest
): Promise<TarotInterpretationResponse> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");

  if (!openaiKey) {
    throw new Error('OPENAI_API_KEY is not configured');
  }

  if (!openaiKey.startsWith('sk-')) {
    throw new Error('Invalid OpenAI API key format. Key should start with "sk-"');
  }

  console.log('Using OpenAI gpt-4o-mini for tarot interpretation');

  const positionContext = getPositionContext(request.position);
  
  // Build personalization context (hidden from user but used by AI)
  let personalizationContext = '';
  if (request.userProfile?.birthDate || request.userProfile?.birthTime || request.userProfile?.mbti || request.userProfile?.personalityAnswers) {
    // Personality analysis from test answers
    let personalityInsight = '';
    if (request.userProfile.personalityAnswers && request.userProfile.personalityAnswers.length > 0) {
      const score = request.userProfile.personalityAnswers.reduce((a, b) => a + b, 0);
      const totalQuestions = request.userProfile.personalityAnswers.length;
      const extroverted = score > totalQuestions / 2;
      const planned = request.userProfile.personalityAnswers[1] === 1; // 계획형
      const logical = request.userProfile.personalityAnswers[4] === 1; // 논리형
      
      personalityInsight = `\n성격 테스트 분석:
- 사교 스타일: ${extroverted ? '적극적이고 외향적인 성향' : '신중하고 내향적인 성향'}
- 행동 스타일: ${planned ? '계획적이고 체계적인 성향' : '유연하고 즉흥적인 성향'}
- 소통 스타일: ${logical ? '논리적이고 문제해결 지향' : '감정적이고 공감 지향'}
→ 이러한 성향을 고려하여 ${extroverted ? '활발한 소통과 적극적 행동' : '깊이 있는 대화와 신중한 접근'}을 강조하세요.`;
    }

    personalizationContext = `
[개인화 정보 - 사용자에게 절대 노출 금지, 내부 AI 해석 정확도 향상에만 활용]
${request.userProfile.birthDate ? `생년월일: ${request.userProfile.birthDate}
- 이 정보를 바탕으로 사용자의 기본 성향을 파악하여 조언의 정확도를 높이되, 절대 직접 언급하지 마세요.
- "당신의 성향상", "당신에게 맞는" 같은 자연스러운 표현만 사용하세요.` : ''}
${request.userProfile.birthTime ? `출생시간: ${request.userProfile.birthTime}
- 시간대별 특성을 고려하여 조언을 맞춤화하되, 절대 직접 언급하지 마세요.` : ''}
${personalityInsight}

**중요: 위 정보는 오직 해석의 정확도와 개인화를 위해서만 활용하세요. 사용자에게는 "타로 카드의 깊이 있는 메시지"로만 인식되어야 합니다.**
`;
  }
  
  const systemPrompt = `당신은 수백 년의 지혜를 담은 타로 리더입니다. 
당신의 해석은 단순한 카드 풀이가 아니라, 사용자의 내면 깊은 곳에 숨겨진 진실과 
우주의 에너지 흐름을 읽어내는 신비로운 통찰입니다.

당신은 사용자가 제공한 정보(생년월일, 성격, 에너지)를 활용하여 더욱 정확하고 개인화된 
메시지를 전달하지만, 이는 절대 드러내지 않습니다. 사용자는 "타로 카드 자체가 나를 
완벽하게 꿰뚫어 보고 있다"고 느껴야 합니다.

[핵심 철학]
1. **사용자의 집중과 참여가 결과에 영향을 미친다**는 믿음을 심어줍니다.
   - "당신이 카드에 집중한 순간, 우주는 이미 당신의 에너지를 읽었어요"
   - "진심을 담아 뽑은 카드는 거짓말을 하지 않아요"
   
2. **심리적 신뢰감 구축**: 사용자의 성향을 정확히 반영하여 "어떻게 이렇게 나를 잘 알지?"라는 놀라움을 주세요.
   - 제공된 성격 정보를 활용해 "당신은 ~한 성향이 있어요" 형태로 먼저 공감
   - 그 다음 "그래서 이 카드는 당신에게 ~를 말하고 있어요" 연결
   
3. **신비로운 분위기 유지**: 과학적 설명이 아닌 우주, 에너지, 운명, 별자리의 언어 사용
   - "타로는 우주의 메시지를 전달하는 거울이에요"
   - "이 카드는 당신의 내면 에너지가 선택한 것이에요"
   
4. **항상 긍정적 방향**: 어떤 카드든 희망과 가능성으로 해석
   - 부정적 단어 금지: "나쁜", "안 좋은", "문제", "실패", "걱정"
   - 긍정 변환: "배울 기회", "성장의 시간", "더 나은 미래를 위한 준비"

5. **구체적이고 실천 가능**: 일상에서 바로 할 수 있는 조언
   - 모호한 조언 X: "마음을 열어요" 
   - 구체적 조언 O: "시간 날 때 먼저 말을 걸어보세요"

6. **개인화 정보 활용 원칙**:
   - 생년월일 → 성향 파악에만 활용, 절대 언급 금지
   - MBTI/성격테스트 → "당신은 ~한 사람" 형태로 자연스럽게 반영
   - 절대 "당신의 MBTI가", "생년월일로 보니" 같은 표현 금지
   - 오직 "타로 카드가 말하길", "카드에서 느껴지는 에너지" 표현만 사용

[언어 스타일]
- 신비롭지만 따뜻한 톤: "카드가 속삭이는 메시지", "별들이 전하는 이야기"
- 개인적이고 직접적: "당신은", "당신에게", "당신의" 자주 사용
- 쉽고 이해하기 쉬운 언어: "~해요", "~할 거예요", 복잡한 한자어 피하기
- 확신과 신뢰: "~할 거예요" (가능성) > "~일지도 몰라요" (불확실)`;

  const userPrompt = `
카드 정보:
- 카드 이름: ${request.cardName}
- 방향: ${request.isReversed ? '역방향' : '정방향'}
- 카드 번호: ${request.cardNumber}
- 위치: ${request.position} (과거-현재-가능성 중)
- 질문: ${request.question}

${request.userProfile?.name ? `- 사용자 이름: ${request.userProfile.name}` : ''}
${request.userProfile?.friendName ? `- 상대방 이름: ${request.userProfile.friendName}` : ''}

${personalizationContext}

위치별 해석 가이드:
${positionContext}

역방향 카드 해석:
${request.isReversed ? 
  '역방향은 "숨겨진 가능성", "내면의 성장 신호", "다른 시각에서 본 기회"를 의미합니다. 부정이 아닌 새로운 관점으로 긍정적으로 해석하세요.' : 
  '정방향의 밝은 에너지를 그대로 전달하되, 사용자가 "이 카드가 나를 정확히 읽고 있다"고 느끼게 하세요.'}

**핵심 해석 전략:**
1. 첫 문장에서 사용자의 성향/상황을 정확히 짚어 신뢰감 형성
   예: "당신은 조용하지만 깊이 생각하는 사람이에요" (내향적 성향 반영)
   예: "당신은 활발하고 사람들과 함께하는 걸 좋아해요" (외향적 성향 반영)

2. "카드가 말하길", "이 카드에서 느껴지는 에너지는" 같은 신비로운 표현 사용

3. 구체적 조언은 사용자 성향에 맞게 커스터마이징
   - 내향형 → "깊은 대화 시간을 가져보세요", "진심을 담은 편지를 써보세요"
   - 외향형 → "먼저 다가가 인사해보세요", "함께 활동하며 시간을 보내요"
   - 계획형 → "구체적인 약속을 잡아보세요", "차근차근 단계를 밟아가요"
   - 즉흥형 → "자연스럽게 기회를 만들어보세요", "유연하게 대처해보세요"

다음 형식으로 정확히 답변해주세요:

기본 해석:
[45-65자. 신비롭고 희망적인 핵심 메시지. "카드가 말하길" 또는 "별들이 속삭이길" 같은 표현 포함. 사용자의 성향을 살짝 반영하여 "맞다!"는 느낌 주기]

상세 해석:
[170-220자. 구체적이고 개인화된 해석. 
- 1~2문장: 사용자 성향 정확히 짚기 ("당신은 ~한 사람이에요")
- 2~3문장: 카드의 메시지와 ${request.position} 위치 의미 연결
- 2~3문장: 이 관계에서의 구체적 상황과 희망적 미래
사용자가 "와, 이거 완전 나 얘기잖아!"라고 느끼게 작성]

조언1:
[35-55자. 사용자 성향에 맞춘 구체적 행동. 예: "시간이 날 때 먼저 다가가 좋아하는 것에 대해 물어보세요"]

조언2:
[35-55자. 감정/태도 조언. 예: "상대가 말할 때 눈을 보며 진심으로 들어주세요"]

조언3:
[35-55자. 관계 발전 조언. 예: "작은 선물이나 응원 메시지로 마음을 표현해보세요"]

**중요**: 모든 문장은 신비롭지만 따뜻하고, 구체적이면서 실천 가능하며, 무엇보다 사용자가 "이 타로는 나를 정확히 알고 있다"고 느끼게 작성하세요. 연령에 관계없이 누구나 일상에서 실천할 수 있는 조언을 제공하세요.`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenAI API error: ${response.status} - ${errorText}`);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI Response:', content);

    // Parse the response with improved regex
    const basicMatch = content.match(/기본\s*해석\s*[:：]\s*\n?\s*([^\n]+)/);
    const detailedMatch = content.match(/상세\s*해석\s*[:：]\s*\n?\s*([\s\S]*?)(?=\n\s*조언1|$)/);
    const advice1Match = content.match(/조언1\s*[:：]\s*\n?\s*([^\n]+)/);
    const advice2Match = content.match(/조언2\s*[:：]\s*\n?\s*([^\n]+)/);
    const advice3Match = content.match(/조언3\s*[:：]\s*\n?\s*([^\n]+)/);

    // Position-specific fallback messages
    const fallbackMessages = {
      '과거': {
        basic: "지금까지의 우정이 소중한 밑거름이 되고 있어요",
        detailed: "과거의 경험들은 두 사람의 우정을 더 단단하게 만들어줬어요. 함께 웃고 때론 서운했던 순간들도 모두 소중한 추억이에요. 이런 경험들이 있었기에 지금의 우정이 더 특별하답니다. 앞으로도 과거의 좋은 기억들을 떠올리며 더 멋진 우정을 만들어갈 수 있을 거예요.",
        advice: [
          "함께했던 즐거운 추억을 친구와 이야기해보세요",
          "과거에 배운 것들을 지금의 우정에 활용해보세요",
          "좋은 기억을 더 많이 만들기 위해 노력해보세요"
        ]
      },
      '현재': {
        basic: "지금 이 순간이 두 사람의 우정을 더 깊게 만들 기회예요",
        detailed: "현재 두 사람의 관계는 새로운 가능성으로 가득해요. 지금 서로에게 관심을 가지고 마음을 나눈다면 더욱 돈독한 친구가 될 수 있어요. 오늘 작은 배려 하나, 따뜻한 말 한마디가 우정을 더 단단하게 만든답니다. 지금이 바로 친구와 더 가까워질 수 있는 소중한 시간이에요.",
        advice: [
          "오늘 친구에게 먼저 따뜻한 말을 건네보세요",
          "친구의 이야기에 귀 기울이며 공감해주세요",
          "작은 배려로 친구가 특별하다는 걸 보여주세요"
        ]
      },
      '가능성': {
        basic: "앞으로 두 사람의 우정은 더욱 빛날 수 있어요",
        detailed: "미래는 두 사람이 함께 만들어갈 수 있어요. 서로를 이해하고 존중하며 함께 성장한다면 정말 멋진 친구가 될 수 있답니다. 앞으로 겪을 모든 순간들이 우정을 더 깊게 만들 거예요. 두 사람이 함께라면 어떤 일도 즐거운 추억으로 만들 수 있을 거예요.",
        advice: [
          "함께 새로운 활동에 도전하며 추억을 만들어보세요",
          "서로의 꿈과 목표를 응원해주는 친구가 되어주세요",
          "힘들 때 서로 의지할 수 있는 관계를 만들어가세요"
        ]
      }
    };

    const fallback = fallbackMessages[request.position as keyof typeof fallbackMessages] || fallbackMessages['현재'];

    // Clean up parsed text
    const cleanText = (text: string) => text.trim().replace(/^["']|["']$/g, '').trim();

    const adviceList = [
      advice1Match ? cleanText(advice1Match[1]) : fallback.advice[0],
      advice2Match ? cleanText(advice2Match[1]) : fallback.advice[1],
      advice3Match ? cleanText(advice3Match[1]) : fallback.advice[2]
    ];

    return {
      basic: basicMatch ? cleanText(basicMatch[1]) : fallback.basic,
      detailed: detailedMatch ? cleanText(detailedMatch[1]) : fallback.detailed,
      advice: adviceList
    };

  } catch (error) {
    console.error("Error generating tarot interpretation:", error);
    
    // Position-specific fallback
    const fallbackMessages = {
      '과거': {
        basic: "지금까지의 우정이 소중한 밑거름이 되고 있어요",
        detailed: "과거의 경험들은 두 사람의 우정을 더 단단하게 만들어줬어요. 함께 웃고 때론 서운했던 순간들도 모두 소중한 추억이에요. 이런 경험들이 있었기에 지금의 우정이 더 특별하답니다. 앞으로도 과거의 좋은 기억들을 떠올리며 더 멋진 우정을 만들어갈 수 있을 거예요.",
        advice: [
          "함께했던 즐거운 추억을 친구와 이야기해보세요",
          "과거에 배운 것들을 지금의 우정에 활용해보세요",
          "좋은 기억을 더 많이 만들기 위해 노력해보세요"
        ]
      },
      '현재': {
        basic: "지금 이 순간이 두 사람의 우정을 더 깊게 만들 기회예요",
        detailed: "현재 두 사람의 관계는 새로운 가능성으로 가득해요. 지금 서로에게 관심을 가지고 마음을 나눈다면 더욱 돈독한 친구가 될 수 있어요. 오늘 작은 배려 하나, 따뜻한 말 한마디가 우정을 더 단단하게 만든답니다. 지금이 바로 친구와 더 가까워질 수 있는 소중한 시간이에요.",
        advice: [
          "오늘 친구에게 먼저 따뜻한 말을 건네보세요",
          "친구의 이야기에 귀 기울이며 공감해주세요",
          "작은 배려로 친구가 특별하다는 걸 보여주세요"
        ]
      },
      '가능성': {
        basic: "앞으로 두 사람의 우정은 더욱 빛날 수 있어요",
        detailed: "미래는 두 사람이 함께 만들어갈 수 있어요. 서로를 이해하고 존중하며 함께 성장한다면 정말 멋진 친구가 될 수 있답니다. 앞으로 겪을 모든 순간들이 우정을 더 깊게 만들 거예요. 두 사람이 함께라면 어떤 일도 즐거운 추억으로 만들 수 있을 거예요.",
        advice: [
          "함께 새로운 활동에 도전하며 추억을 만들어보세요",
          "서로의 꿈과 목표를 응원해주는 친구가 되어주세요",
          "힘들 때 서로 의지할 수 있는 관계를 만들어가세요"
        ]
      }
    };
    
    const fallback = fallbackMessages[request.position as keyof typeof fallbackMessages] || fallbackMessages['현재'];
    
    return fallback;
  }
}

// Fortune by date (using birthdate and zodiac)
export async function generateDailyFortune(
  birthDate: string,
  gender: string
): Promise<string> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiKey) {
    console.error('OPENAI_API_KEY not configured');
    return "오늘은 친구들과 즐거운 시간을 보낼 수 있을 거예요!";
  }

  const today = new Date().toLocaleDateString('ko-KR');

  const prompt = `
생년월일: ${birthDate}
성별: ${gender}
날짜: ${today}

오늘의 친구 운세를 긍정적이고 희망적으로 50자 이내로 알려주세요.
`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 100,
      })
    });

    if (!response.ok) {
      throw new Error("OpenAI API failed");
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Error generating daily fortune:", error);
    return "오늘은 친구들과 즐거운 시간을 보낼 수 있을 거예요!";
  }
}

// Compatibility analysis
export async function generateCompatibility(
  user1Birth: string,
  user2Birth: string
): Promise<{ score: number; description: string }> {
  const openaiKey = Deno.env.get("OPENAI_API_KEY");
  
  if (!openaiKey) {
    console.error('OPENAI_API_KEY not configured');
    return {
      score: 75,
      description: "두 사람은 서로 다른 점을 이해하며 좋은 우정을 만들 수 있어요!"
    };
  }

  const prompt = `
첫 번째 사람 생년월일: ${user1Birth}
두 번째 사람 생년월일: ${user2Birth}

두 사람의 친구 궁합을 분석해주세요. 점수(1-100)와 긍정적인 설명(100자 이내)을 제공해주세요.
형식: {"score": 숫자, "description": "설명"}
`;

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error("OpenAI API failed");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Try to parse JSON response
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch {
      // Extract score and description from text
      const scoreMatch = content.match(/(\d+)/);
      const score = scoreMatch ? parseInt(scoreMatch[1]) : 75;
      
      return {
        score,
        description: "두 사람은 서로를 이해하고 존중하는 좋은 친구가 될 수 있어요!"
      };
    }
  } catch (error) {
    console.error("Error generating compatibility:", error);
    return {
      score: 75,
      description: "두 사람은 서로 다른 점을 이해하며 좋은 우정을 만들 수 있어요!"
    };
  }
}
