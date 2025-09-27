"use client";
import React, { useState } from "react";

// 20-question bank based on Learn page content
const QUIZ_BANK = [
  {
    question: "What is a key innovation of Reactive Network?",
    options: [
      "Reactive smart contracts",
      "Proof-of-Work mining",
      "Centralized governance",
      "Single-chain operation"
    ],
    answer: 0
  },
  {
    question: "What do reactive smart contracts do?",
    options: [
      "Monitor and respond to events across blockchains",
      "Only execute when directly called",
      "Mine new tokens",
      "Store NFTs"
    ],
    answer: 0
  },
  {
    question: "What is NOT a feature of Reactive Network?",
    options: [
      "Manual contract execution only",
      "Real-time reactivity",
      "Multi-chain support",
      "Secure & decentralized"
    ],
    answer: 0
  },
  {
    question: "Which of these is a use case for Reactive Network?",
    options: [
      "Cross-chain yield farming automation",
      "Offline transaction signing",
      "Single-chain staking only",
      "Centralized exchange trading"
    ],
    answer: 0
  },
  {
    question: "What is the core execution environment called?",
    options: [
      "RVM Core",
      "EVM Classic",
      "Solidity Engine",
      "Chainlink Node"
    ],
    answer: 0
  },
  {
    question: "What mechanism does Reactive Network use for consensus?",
    options: [
      "Hybrid Proof-of-Stake",
      "Proof-of-Work",
      "Delegated Proof-of-Stake",
      "Proof-of-Authority"
    ],
    answer: 0
  },
  {
    question: "Which is a key feature of Reactive Network?",
    options: [
      "Real-time event streaming",
      "Manual block validation",
      "Centralized control",
      "No cross-chain support"
    ],
    answer: 0
  },
  {
    question: "What is the REACT token used for?",
    options: [
      "Network operations and governance",
      "Only NFT minting",
      "Airdrops only",
      "Testnet access only"
    ],
    answer: 0
  },
  {
    question: "Which blockchain is NOT natively supported?",
    options: [
      "Bitcoin",
      "Ethereum",
      "Polygon",
      "BSC"
    ],
    answer: 0
  },
  {
    question: "What does the event subscription system do?",
    options: [
      "Tracks activities across multiple blockchains",
      "Stores private keys",
      "Runs centralized servers",
      "Issues fiat payments"
    ],
    answer: 0
  },
  {
    question: "What is a benefit of real-time reactivity?",
    options: [
      "Instant cross-chain automation",
      "Slower transaction times",
      "Manual event polling",
      "No automation"
    ],
    answer: 0
  },
  {
    question: "What is a validator required to do?",
    options: [
      "Stake REACT tokens",
      "Mine blocks",
      "Run a centralized server",
      "Hold NFTs"
    ],
    answer: 0
  },
  {
    question: "What is a use of the REACT token?",
    options: [
      "Gas fees for contract execution",
      "Paying for internet",
      "Buying hardware",
      "Minting fiat currency"
    ],
    answer: 0
  },
  {
    question: "What is a feature of the event system?",
    options: [
      "Configurable event filters",
      "Fixed event list only",
      "No filtering",
      "Manual event entry"
    ],
    answer: 0
  },
  {
    question: "What is the main advantage of cross-chain automation?",
    options: [
      "Actions can be triggered across different blockchains",
      "All actions are local only",
      "No automation possible",
      "Manual bridging required"
    ],
    answer: 0
  },
  {
    question: "What is a governance use of REACT?",
    options: [
      "Voting on protocol upgrades",
      "Buying NFTs",
      "Mining rewards",
      "Running a faucet"
    ],
    answer: 0
  },
  {
    question: "What is a security feature of Reactive Network?",
    options: [
      "Decentralized validator network",
      "Single point of failure",
      "Centralized admin",
      "No validation"
    ],
    answer: 0
  },
  {
    question: "What is the RVM compatible with?",
    options: [
      "EVM",
      "Bitcoin Script",
      "Tezos Michelson",
      "Cardano Plutus"
    ],
    answer: 0
  },
  {
    question: "What is a benefit of live price tracking?",
    options: [
      "Instant updates on REACT token price",
      "Manual price entry",
      "No price data",
      "Delayed updates only"
    ],
    answer: 0
  },
  {
    question: "What is a use case for multi-chain support?",
    options: [
      "Multi-chain governance voting",
      "Single-chain staking only",
      "Manual bridging",
      "Centralized exchange only"
    ],
    answer: 0
  }
];

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

function getRandomQuestions(bank: QuizQuestion[], n: number): QuizQuestion[] {
  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}


export default function LearnQuiz() {
  const [quiz, setQuiz] = useState<QuizQuestion[]>(() => getRandomQuestions(QUIZ_BANK, 4));
  const [step, setStep] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([] as number[]);
  const [showResult, setShowResult] = useState<boolean>(false);

  function handleAnswer(idx: number) {
    setAnswers((a: number[]) => [...a, idx]);
    if (step === quiz.length - 1) {
      setShowResult(true);
    } else {
      setStep((s: number) => s + 1);
    }
  }

  function handleRestart() {
    setQuiz(getRandomQuestions(QUIZ_BANK, 4));
    setStep(0);
    setAnswers([]);
    setShowResult(false);
  }

  const score = answers.reduce((acc, a, i) => acc + (a === quiz[i].answer ? 1 : 0), 0);

  return (
    <section className="mt-16 mb-8 max-w-xl mx-auto bg-white/80 dark:bg-neutral-900/80 rounded-2xl p-6 border border-indigo-200 dark:border-indigo-700 shadow-xl">
      <h2 className="text-xl font-bold mb-2 text-indigo-700 dark:text-indigo-300 text-center">Quick Learn Quiz</h2>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6 text-center">Test your knowledge! 4 random questions about Reactive Network.</p>
      {showResult ? (
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">{score} / 4</div>
          <div className="text-lg font-medium text-neutral-700 dark:text-neutral-200">
            {score === 4 ? "Perfect! 🚀" : score >= 2 ? "Nice!" : "Keep learning!"}
          </div>
          <button onClick={handleRestart} className="mt-4 px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 font-semibold">Try Again</button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <div className="text-sm text-neutral-500 mb-2">Question {step + 1} of 4</div>
            <div className="font-semibold text-neutral-900 dark:text-white mb-4">{quiz[step].question}</div>
            <div className="space-y-2">
              {quiz[step].options.map((opt: string, i: number) => (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  className="block w-full text-left px-4 py-2 rounded bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-800 text-indigo-800 dark:text-indigo-200 font-medium transition"
                  disabled={showResult}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
