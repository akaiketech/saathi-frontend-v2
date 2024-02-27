import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { toast } from "react-toastify";

export const queryApi = async ({
  hindiQuery,
  englishQuery,
  sessionId,
}: any) => {
  const res = await fetch("/api/v1/user_query", {
    method: "POST",
    body: JSON.stringify({
      hindiQuery,
      englishQuery,
      sessionId,
    }),
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error, {
      autoClose: 5000,
      position: "top-right",
    });
  } else {
    return data;
  }
};

export const textToSpeech = (
  text: string,
  language: string,
  voice: string,
  onStart: any,
  onEnd: any
) => {
  const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY;
  const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey ?? "",
    serviceRegion ?? ""
  );

  if (language === "hindi") {
    speechConfig.speechRecognitionLanguage = "hi-IN";
    if (voice === "female") {
      speechConfig.speechSynthesisVoiceName = "hi-IN-SwaraNeural";
    } else {
      speechConfig.speechSynthesisVoiceName = "hi-IN-MadhurNeural";
    }
  } else {
    speechConfig.speechRecognitionLanguage = "en-IN";
    if (voice === "female") {
      speechConfig.speechSynthesisVoiceName = "en-IN-NeerjaNeural";
    } else {
      speechConfig.speechSynthesisVoiceName = "en-IN-PrabhatNeural";
    }
  }

  const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
  const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  // synthesizer.synthesisStarted = (_s, _e) => {
  //   onStart();
  // };

  // synthesizer.synthesisCompleted = (_s, _e) => {
  //   onEnd();
  //   synthesizer.close();
  // };

  let estimatedDuration = text.length * 90;

  synthesizer.synthesisStarted = (_s, _e) => {
    onStart(); // Call your onStart function
    setTimeout(() => {
      onEnd(); // Call your onEnd function
    }, estimatedDuration);
  };

  synthesizer.speakTextAsync(
    text,
    (result) => {
      if (result) {
        synthesizer.close();
        return result.audioData;
      }
    },
    (error) => {
      toast.error(error, {
        autoClose: 5000,
        position: "top-right",
      });
      synthesizer.close();
    }
  );
};

export const feedBackApi = async (sessionId: string, rating: number) => {
  const res = await fetch("/api/v1/session_feedback", {
    method: "POST",
    body: JSON.stringify({
      rating,
      sessionId,
    }),
  });

  const data = await res.json();

  if (data.error) {
    toast.error(data.error, {
      autoClose: 5000,
      position: "top-right",
    });
  } else {
    return data;
  }
};
