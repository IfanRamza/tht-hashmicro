import type { Request, Response } from "express";

type MatchMode = "sensitive" | "insensitive";

type CharacterMatchResult = {
  matchedCharacters: string[];
  totalCharacters: number;
  matchedCount: number;
  percentage: number;
};

type CharacterMatchCalculator = (
  input1: string,
  input2: string,
  mode: MatchMode,
) => CharacterMatchResult;

function calculateCharacterMatch(
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
    source.length === 0 ? 0 : (matchedCharacters.length / source.length) * 100;

  return {
    matchedCharacters,
    totalCharacters: source.length,
    matchedCount: matchedCharacters.length,
    percentage,
  };
}

type CharacterCheckerControllerDependencies = {
  calculateCharacterMatch: CharacterMatchCalculator;
};

export function createCharacterCheckerController(
  dependencies: CharacterCheckerControllerDependencies,
) {
  const { calculateCharacterMatch } = dependencies;

  return {
    index(_req: Request, res: Response): void {
      res.render("character-checker/index", {
        title: "Character Checker",
        result: null,
        form: {
          input1: "ABBCD",
          input2: "Gallant Duck",
          mode: "sensitive",
        },
      });
    },

    check(req: Request, res: Response): void {
      const { input1, input2, mode } = req.body as {
        input1: string;
        input2: string;
        mode: MatchMode;
      };

      res.render("character-checker/index", {
        title: "Character Checker",
        result: calculateCharacterMatch(input1, input2, mode),
        form: { input1, input2, mode },
      });
    },
  };
}

export const characterCheckerController = createCharacterCheckerController({
  calculateCharacterMatch,
});
