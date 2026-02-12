export enum Emotion {
  NEUTRAL = 'NEUTRAL',
  HAPPY = 'HAPPY',
  BLUSH = 'BLUSH',
  HUG = 'HUG',
  EATING = 'EATING',
  SLEEP = 'SLEEP',
  GIGGLE = 'GIGGLE',
  DIZZY = 'DIZZY',
  KISS = 'KISS',
  HURT = 'HURT',
  CRY = 'CRY',
  SHOCKED = 'SHOCKED', // Soot face
  SCARED = 'SCARED',
  // New Emotions
  SNEEZE = 'SNEEZE',
  SNEEZE_BUILD = 'SNEEZE_BUILD',
  COLD = 'COLD',
  DANCE = 'DANCE',
  SECRET = 'SECRET',
  COOL = 'COOL'
}

export type TeddyPart = 'head' | 'belly' | 'nose' | 'note' | 'left_ear' | 'right_ear' | 'face_left' | 'face_right';

export type Costume = {
  head: 'none' | 'hat' | 'bunny' | 'crown' | 'flower' | 'cap' | 'viking' | 'headphones' | 'party' | 'cowboy' | 'beanie' | 'beret';
  eyes: 'none' | 'sunglasses' | 'glasses' | 'monocle' | 'star' | '3d' | 'patch' | 'aviator';
  neck: 'none' | 'bowtie' | 'scarf' | 'necklace' | 'chain' | 'bandana' | 'tie' | 'pearls';
};