// 해당 코드는 nlp 모델을 사용하는게 아닌, 규칙 기반 접근 방식 (정규식 사용)
// 한국어 숫자 처리를 위한 정규식
const koreanNumberRegex = /(\d{1,3}(,\d{3})|\d+)(\s)*(십|백|천|만|억)?((\s)*\d+(\s)*(십|백|천)?)?((\s)*\d+(\s)*(십|백)?)?((\s)*\d+)?(\s)*(원)?/g;

export const analyzeBid = (text) => {
  console.log('Analyzing text:', text);  // 디버그 로그 추가

  // 금액 추출 (정규식 사용)
  const amounts = [];
  let match;
  while ((match = koreanNumberRegex.exec(text)) !== null) {
    let amount = match[0].trim();
    amounts.push(amount);
  }

  // 숫자 추출 (compromise의 numbers() 메서드 대신 정규식 사용)
  const numbers = amounts.map(amount => convertToWon(amount));

  // console.log('Extracted amounts:', amounts);  // 디버그 로그 추가
  // console.log('Extracted numbers:', numbers);  // 디버그 로그 추가

  return {
    amounts,
    numbers,
    original: text
  };
};

// 금액을 원 단위로 변환
export const convertToWon = (amount) => {
  const cleanAmount = amount.replace(/,/g, '').replace('원', '').trim();
  const unitMap = {
    '십': 10,
    '백': 100,
    '천': 1000,
    '만': 10000,
    '억': 100000000
  };

  let result = 0;
  let tempResult = 0;
  let currentNumber = 0;

  const parts = cleanAmount.split(/(\d+|\D+)/).filter(Boolean);

  for (let i = 0; i < parts.length; i++) {
    if (/\d+/.test(parts[i])) {
      currentNumber = parseInt(parts[i]);
    } else {
      const unit = unitMap[parts[i].trim()];
      if (unit) {
        if (currentNumber === 0) currentNumber = 1;
        if (unit === 10000) {
          result += tempResult * unit;
          result += currentNumber * unit;
          tempResult = 0;
        } else if (unit === 100000000) {
          result = (result + tempResult) * unit;
          tempResult = 0;
        } else {
          tempResult += currentNumber * unit;
        }
        currentNumber = 0;
      }
    }
  }

  result += tempResult + currentNumber;
  return result || parseInt(cleanAmount);
};

// 입찰 의도 파악
export const detectBidIntent = (analysis) => {
    return analysis.amounts.length > 0;
  };