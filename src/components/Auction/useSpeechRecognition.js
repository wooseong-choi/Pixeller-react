import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition as useSpeechRecognitionLib } from 'react-speech-recognition';
import { analyzeBid, detectBidIntent } from './bidAnalyzer';

const useSpeechRecognition = (initialPrice = 5000) => {
    
    // 가장 최근에 인식된 음성 결과를 저장하는 state
    const [lastResult, setLastResult] = useState('');

    // 가장 최근에 인식된 음성 결과의 신뢰도를 저장하는 state
    const [confidence, setConfidence] = useState(0);
    
    // 현재 가격을 저장하는 state
    const [currentPrice, setCurrentPrice] = useState(initialPrice);

    // react-speech-recognition 라이브러리의 useSpeechRecognition 훅 사용
    const {
        transcript, // 인식된 전체 텍스트
        listening, // 현재 음성 인식 중인지 여부
        resetTranscript, // transcript를 초기화하는 함수
        browserSupportsSpeechRecognition // 브라우저가 음성 인식을 지원하는지 여부
    } = useSpeechRecognitionLib();

    // 음성 인식 설정을 위한 useEffect
    useEffect(() => {
        if (browserSupportsSpeechRecognition) {
        
            // SpeechRecognition 객체 가져오기
            const recognition = SpeechRecognition.getRecognition();
            if (recognition) {
            
                // 음성 인식 설정 
                recognition.lang = 'ko-KR'; // 인식 언어 한국어 설정
                recognition.continuous = true; // 연속 인식 모드 활성화
                recognition.interimResults = true; // 중간 결과 활성화
                recognition.maxAlternatives = 1; // 가장 정확한 결과 하나만 반환
                
                // 음성 인식 시작 시 호출되는 콜백
                // recognition.onstart = () => console.log('Speech recognition started');

                // 음성 인식 종료 시 호출되는 콜백
                // recognition.onend = () => console.log('Speech recognition ended');

                // 음성 인식 오류 발생 시 호출되는 콜백
                // recognition.onerror = (event) => console.error('Speech recognition error', event);

                // 음성 인식 결과가 생성될 때마다 호출되는 콜백
                recognition.onresult = (event) => {

                    // 가장 최근에 인식된 결과 가져오기
                    const result = event.results[event.results.length - 1];
                    const transcriptResult = result[0].transcript;
                    const confidenceScore = result[0].confidence;
                    
                    console.log('Speech recognition result:', transcriptResult);
                    console.log('Confidence:', confidenceScore * 100);
                    
                    // 가장 최근에 인식된 결과를 lastResult state에 저장
                    setLastResult(transcriptResult);
                    setConfidence(confidenceScore);

                    const analysis = analyzeBid(transcriptResult);
                    console.log('Bid analysis:', analysis);

                    if (detectBidIntent(analysis) && analysis.numbers.length > 0) {
                        const newPrice = Math.max(...analysis.numbers);
                        console.log("New price:", newPrice, "Current price:", currentPrice);
                        if (!isNaN(newPrice) && newPrice > currentPrice) {
                            setCurrentPrice(newPrice);
                            console.log('이 금액으로 업데이트됨:', newPrice);
                        }
                    }
                };
            }
        }
    }, [browserSupportsSpeechRecognition, currentPrice]);

    // 음성 인식 시작 함수
    const handleStart = useCallback(() => {
        // console.log('Starting speech recognition...');
        SpeechRecognition.startListening({ continuous: true, language: 'ko-KR' });
    }, []);

    // 음성 인식 중지 함수
    const handleStop = useCallback(() => {
        // console.log('Stopping speech recognition...');
        SpeechRecognition.stopListening();
    }, []);

    const resetPrice = useCallback(() => {
        setCurrentPrice(initialPrice);
    }, [initialPrice]);

    // 훅 반환값들    
    return {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
        lastResult,
        confidence,
        currentPrice,
        handleStart,
        handleStop,
        resetPrice
  };
};

export default useSpeechRecognition;