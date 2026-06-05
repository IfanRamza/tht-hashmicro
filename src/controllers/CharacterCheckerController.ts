import type { Request, Response } from "express";
import {
  characterCheckerService,
  type CharacterCheckerService,
  type MatchMode,
} from "../services/CharacterCheckerService";

type CharacterCheckerControllerDependencies = {
  characterCheckerService: CharacterCheckerService;
};

export function createCharacterCheckerController(
  dependencies: CharacterCheckerControllerDependencies,
) {
  const { characterCheckerService } = dependencies;

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
        result: characterCheckerService.calculateMatch(input1, input2, mode),
        form: { input1, input2, mode },
      });
    },
  };
}

export const characterCheckerController = createCharacterCheckerController({
  characterCheckerService,
});
