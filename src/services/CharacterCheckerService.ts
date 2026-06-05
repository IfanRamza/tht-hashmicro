export type MatchMode = "sensitive" | "insensitive";

export type CharacterMatchResult = {
  matchedCharacters: string[];
  totalCharacters: number;
  matchedCount: number;
  percentage: number;
};

export function createCharacterCheckerService() {
  return {
    calculateMatch(
      input1: string,
      input2: string,
      mode: MatchMode,
    ): CharacterMatchResult {
      const source = mode === "insensitive" ? input1.toLowerCase() : input1;
      const target = mode === "insensitive" ? input2.toLowerCase() : input2;
      const matchedCharacters: string[] = [];

      for (const character of source) {
        if (target.includes(character)) {
          matchedCharacters.push(character);
        }
      }

      const percentage =
        source.length === 0
          ? 0
          : (matchedCharacters.length / source.length) * 100;

      return {
        matchedCharacters,
        totalCharacters: source.length,
        matchedCount: matchedCharacters.length,
        percentage,
      };
    },
  };
}

export type CharacterCheckerService = ReturnType<
  typeof createCharacterCheckerService
>;

export const characterCheckerService = createCharacterCheckerService();
