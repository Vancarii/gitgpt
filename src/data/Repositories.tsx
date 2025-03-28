// filepath: /Users/yechengwang/Desktop/SFU/Spring2025/CMPT363/group-project/gitgpt/src/data/repositories.ts
import { Repository } from "../types/chat";

export const sampleRepositories: Repository[] = [
  {
    id: "1",
    name: "react-native-app",
    language: "TypeScript",
    stars: 124,
    forks: 38,
    description:
      "A React Native application for mobile development with TypeScript support",
    isPrivate: false,
  },
  {
    id: "2",
    name: "personal-website",
    language: "JavaScript",
    stars: 15,
    forks: 3,
    description:
      "Personal portfolio website built with Next.js and Tailwind CSS",
    isPrivate: true,
  },
  {
    id: "3",
    name: "data-visualization-tool",
    language: "Python",
    stars: 87,
    forks: 12,
    description:
      "A tool for visualizing complex datasets using matplotlib and seaborn",
    isPrivate: false,
  },
  {
    id: "4",
    name: "algorithm-challenges",
    language: "C++",
    stars: 45,
    forks: 7,
    description:
      "Solutions to various algorithm challenges and competitive programming problems",
    isPrivate: false,
  },
];
