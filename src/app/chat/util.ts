import * as sdk from "microsoft-cognitiveservices-speech-sdk";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import { uint8ArrayToBase64 } from "../../utils/utils";
import axios from "axios";
import {
  AudioConfig,
  SpeakerAudioDestination,
  SpeechSynthesizer,
  SpeechTranslationConfig,
  TranslationRecognizer,
} from "microsoft-cognitiveservices-speech-sdk";
import { Dispatch, SetStateAction } from "react";
import { Message } from "../../types";

export const queryApi = async ({
  conversation_id,
  query_id,
  english_query,
  conversation_location,
  conversation_language,
  user_audio,
  language_query,
}: any) => {
  const reqData = {
    conversation_id,
    query_id,
    english_query,
    conversation_location,
    conversation_language,
    user_audio: user_audio !== "" ? uint8ArrayToBase64(user_audio) : "",
    language_query,
  };

  try {
    const res = await axios.post("/api/v2/user_query/", reqData);

    if (res.data.error) {
      toast.error(res.data.error, {
        autoClose: 5000,
        position: "top-right",
      });

      return {
        error: res.data.error,
        data: null,
      };
    }

    if (res.status !== 200) {
      toast.error(res.data.error, {
        autoClose: 5000,
        position: "top-right",
      });
      return {
        error: res.data.error,
        data: null,
      };
    } else {
      return res.data;
    }
  } catch (error: any) {
    console.error("Error:", error.response.data || error.message);
  }
};

export const textToSpeech = (
  text: string,
  language: string,
  voice: string,
  onStart: any,
  onEnd: any,
) => {
  const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY as string;
  const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION as string;

  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    serviceRegion,
  );

  language = language.toLowerCase();

  switch (language) {
    case "hindi":
      speechConfig.speechRecognitionLanguage = "hi-IN";
      if (voice === "female") {
        speechConfig.speechSynthesisVoiceName = "hi-IN-SwaraNeural";
      } else {
        speechConfig.speechSynthesisVoiceName = "hi-IN-MadhurNeural";
      }
      break;

    case "tamil":
      speechConfig.speechRecognitionLanguage = "ta-IN";
      if (voice === "female") {
        speechConfig.speechSynthesisVoiceName = "ta-IN-PallaviNeural";
      } else {
        speechConfig.speechSynthesisVoiceName = "ta-IN-ValluvarNeural";
      }
      break;

    case "kannada":
      speechConfig.speechRecognitionLanguage = "kn-IN";
      if (voice === "female") {
        speechConfig.speechSynthesisVoiceName = "kn-IN-SapnaNeural";
      } else {
        speechConfig.speechSynthesisVoiceName = "kn-IN-GaganNeural";
      }
      break;

    default:
      speechConfig.speechRecognitionLanguage = "en-IN";
      if (voice === "female") {
        speechConfig.speechSynthesisVoiceName = "en-IN-NeerjaNeural";
      } else {
        speechConfig.speechSynthesisVoiceName = "en-IN-PrabhatNeural";
      }
      break;
  }

  const player = new SpeakerAudioDestination();
  const audioConfig = sdk.AudioConfig.fromSpeakerOutput(player);
  const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

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
    },
  );

  return { player };
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

interface TranslationOnceFromMicProps {
  language: string;
  location: string;
  sessionId: string;
  voice: string;
  isAudioPlaying: boolean;
  messages: Message[];
  setIsAudioPlaying: Dispatch<SetStateAction<boolean>>;
  setIsRecording: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setCurrentPlayingIndex: Dispatch<SetStateAction<number | undefined>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setTtsController: Dispatch<
    SetStateAction<sdk.SpeakerAudioDestination | null>
  >;
}

export const translationOnceFromMic = ({
  language,
  location,
  sessionId,
  voice,
  isAudioPlaying,
  messages,
  setIsAudioPlaying,
  setIsRecording,
  setMessages,
  setCurrentPlayingIndex,
  setIsLoading,
  setTtsController,
}: TranslationOnceFromMicProps) => {
  const speechKey = process.env.NEXT_PUBLIC_SPEECH_KEY as string;
  const serviceRegion = process.env.NEXT_PUBLIC_SPEECH_REGION as string;

  const translationConfig = SpeechTranslationConfig.fromSubscription(
    speechKey,
    serviceRegion,
  );

  translationConfig.setProperty(
    sdk.PropertyId.Speech_SegmentationSilenceTimeoutMs,
    "1500",
  );
  language = language.toLowerCase();

  switch (language) {
    case "hindi":
      translationConfig.speechRecognitionLanguage = "hi-IN";
      break;

    case "kannada":
      translationConfig.speechRecognitionLanguage = "kn-IN";
      break;

    case "tamil":
      translationConfig.speechRecognitionLanguage = "ta-IN";
      break;

    default:
      translationConfig.speechRecognitionLanguage = "en-IN";
  }

  // translationConfig.speechRecognitionLanguage = "en-US";
  translationConfig.addTargetLanguage("en");
  // Set silence timeout in milliseconds
  // translationConfig.setProperty(
  //   sdk.PropertyId[
  //     sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs
  //   ],
  //   "5000"
  // );

  const audioConfig = AudioConfig.fromDefaultMicrophoneInput();

  const recognizer = new TranslationRecognizer(translationConfig, audioConfig);

  const message: Message = {
    id: uuidv4(),
    question: {
      englishText: "",
      hindiText: "",
      audio: "",
      kannadaText: "",
      tamilText: "",
    },
    answer: "",
    isLoading: false,
    vote: 0,
  };

  const wavFragments: { [id: number]: ArrayBuffer } = {};
  let wavFragmentCount = 0;

  const con: sdk.Connection = sdk.Connection.fromRecognizer(recognizer);

  con.messageSent = (args: sdk.ConnectionMessageEventArgs): void => {
    if (
      args.message.path === "audio" &&
      args.message.isBinaryMessage &&
      args.message.binaryMessage !== null
    ) {
      wavFragments[wavFragmentCount++] = args.message.binaryMessage;
    }
  };

  const recognizeOnceAsync = (): Promise<sdk.TranslationRecognitionResult> =>
    new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(async (result) => {
        resolve(result as sdk.TranslationRecognitionResult);

        let byteCount: number = 0;
        for (let i: number = 0; i < wavFragmentCount; i++) {
          byteCount += wavFragments[i].byteLength;
        }

        const sentAudio: Uint8Array = new Uint8Array(byteCount);

        byteCount = 0;
        for (let i: number = 0; i < wavFragmentCount; i++) {
          sentAudio.set(new Uint8Array(wavFragments[i]), byteCount);
          byteCount += wavFragments[i].byteLength;
        }

        const reqBody = {
          conversation_id: sessionId,
          query_id: message.id,
          english_query:
            language.toLowerCase() === "english"
              ? result.text
              : result.translations.get("en"),
          conversation_location: location,
          conversation_language: language,
          user_audio: sentAudio,
          language_query: "",
        };

        // Get question text based on language
        switch (language) {
          case "hindi":
            message.question.hindiText = result.text;
            reqBody.language_query = result.text;
            break;

          case "kannada":
            message.question.kannadaText = result.text;
            reqBody.language_query = result.text;
            break;

          case "tamil":
            message.question.tamilText = result.text;
            reqBody.language_query = result.text;
            break;

          default:
            message.question.englishText = result.text;
            reqBody.language_query = result.text;
        }

        // always get english text
        // message.question.englishText = result.translations.get("en");
        message.isLoading = true;
        setIsLoading(true);

        setMessages((prevMsgs) => [...prevMsgs, message]);
        setIsRecording(false);

        const data = await queryApi(reqBody);
        if (data) {
          message.answer = data.answer;
        }

        setIsLoading(false);
        message.isLoading = false;

        setMessages((prevMsgs) => {
          const index = prevMsgs.length - 1;
          const newMsgs = [...prevMsgs];
          newMsgs[index] = { ...message };
          return newMsgs;
        });

        const textToSpeak = message.answer;

        const controller = textToSpeech(
          textToSpeak,
          language,
          voice,
          () => {
            setIsAudioPlaying(true);
          },
          () => {
            setIsAudioPlaying(false);
            setCurrentPlayingIndex(undefined);
          },
        );

        setCurrentPlayingIndex(messages.length);
        setTtsController(controller.player);
      }, reject);
    });

  recognizeOnceAsync();

  return recognizer;
};

interface TranslationFromInputProps {
  text: string;
  language: string;
  location: string;
  sessionId: string;
  setIsAudioPlaying: Dispatch<SetStateAction<boolean>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

export const translateFromInput = async ({
  text,
  language,
  location,
  sessionId,
  setIsAudioPlaying,
  setMessages,
  setIsLoading,
}: TranslationFromInputProps) => {
  // disable recording
  setIsAudioPlaying(true);

  const message: Message = {
    id: uuidv4(),
    question: {
      englishText: "",
      hindiText: "",
      audio: "",
      kannadaText: "",
      tamilText: "",
    },
    answer: "",
    isLoading: false,
    vote: 0,
  };

  switch (language.toLowerCase()) {
    case "hindi":
      message.question.hindiText = text;
      break;

    case "kannada":
      message.question.kannadaText = text;
      break;

    case "tamil":
      message.question.tamilText = text;
      break;

    default:
      message.question.englishText = text;
      break;
  }

  const reqBody = {
    conversation_id: sessionId,
    query_id: message.id,
    english_query: text,
    conversation_location: location,
    conversation_language: language,
    user_audio: "",
    language_query: text,
  };

  try {
    setIsLoading(true);
    message.isLoading = true;

    setMessages((prevMsgs) => [...prevMsgs, message]);

    const data = await queryApi(reqBody);
    if (data) {
      message.answer = data.answer;
    }

    message.isLoading = false;
    setIsLoading(false);
    setIsAudioPlaying(false);

    setMessages((prevMsgs) => {
      const index = prevMsgs.length - 1;
      const newMsgs = [...prevMsgs];
      newMsgs[index] = { ...message };
      return newMsgs;
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    setIsAudioPlaying(false);
    setIsLoading(false);
  }
};

export const voteApi = async (
  conversation_id: string,
  query_id: string,
  feedback: number,
) => {
  const reqBody = {
    conversation_id,
    query_id,
    feedback,
  };

  try {
    const res = await axios.put("/api/v2/feedback", reqBody);

    if (res.data.error) {
      toast.error(res.data.error, {
        autoClose: 5000,
        position: "top-right",
      });

      return {
        error: res.data.error,
        data: null,
      };
    }

    if (res.status !== 200) {
      toast.error(res.data.error, {
        autoClose: 5000,
        position: "top-right",
      });
      return {
        error: res.data.error,
        data: null,
      };
    } else {
      return {
        error: null,
        data: res.data,
      };
    }
  } catch (error: any) {
    const errorText = `Failed to vote.`;
    toast.error(errorText, {
      autoClose: 5000,
      position: "top-right",
    });
    console.error("Error:", error.response.data || error.message);
    return {
      error: null,
      data: null,
    };
  }
};
