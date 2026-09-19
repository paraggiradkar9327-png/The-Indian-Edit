export type ScreenId =
  | 'screen-login'
  | 'screen-otp'
  | 'screen-welcome'
  | 'screen-level-1'
  | 'screen-level-2'
  | 'screen-level-3'
  | 'screen-level-4'
  | 'screen-level-5'
  | 'screen-result'
  | 'screen-social'
  | 'screen-upload'
  | 'screen-scratch';

export interface PersonalityType {
  id: string;
  name: string;
  tags: string;
  quote: string;
  desc: string;
  tagline?: string;
  description?: string;
  signatureCocktail?: {
    name: string;
    ingredients: string;
    garnish: string;
  };
}

export interface RewardGift {
  id: string;
  name: string;
  desc: string;
  description?: string;
  code: string;
  value?: string;
  icon?: string;
}

export type CityCategory = 'CITY' | 'CULTURE' | 'FOOD' | 'TECHNOLOGY' | 'LIFESTYLE' | 'FUTURE';

export interface CityElementItem {
  id: number;
  category: CityCategory;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface GameState {
  userName: string;
  userCity: string;
  userPhone: string;
  otpVerified: boolean;
  currentScreen: ScreenId;
  
  // Level 1: Harvest / Bottle Rush
  scoreRush: number;
  scoreBottle: number;
  bottlesCollected: number;
  bonusPoints: number;

  // Level 2: Zero Mile Map
  scoreZero: number;
  nagpurGuessed: boolean;
  userCityGuessed: boolean;
  userPinLocation: { x: number; y: number } | null;

  // Level 3: Decode The Bottle
  decodeScore: number;
  decodeDetailsFound: number;
  decodeCompleted: boolean;

  // Level 4: Master The Blend
  blendScore: number;
  blendBaseScore: number;
  blendSpeedBonus: number;
  blendIncorrectAttempts: number;
  blendCompleted: boolean;

  // Level 5: The Indian Edit — Hunt The Edit
  huntScore: number;
  huntBottlesFound: number;
  huntCompleted: boolean;
  huntBestTime: number;
  scoreCity: number;
  cityElements: Record<CityCategory, number>;

  // Final Master
  totalScore: number;
  personality: PersonalityType | null;
  screenshotUploaded: boolean;
  uploadedScreenshotUrl: string | null;
  scratchRevealed: boolean;
  selectedGift: RewardGift | null;
  rewardClaimed: boolean;
  soundMuted: boolean;
}
