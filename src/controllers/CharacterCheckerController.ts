import type { Request, Response } from "express";

type MatchMode = "sensitive" | "insensitive";

function calculateCharacterMatch(input1: string, input2: string, mode: MatchMode) {
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

export const characterCheckerController = {
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
