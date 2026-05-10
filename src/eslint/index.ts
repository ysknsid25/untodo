import { noTodo } from "./rules/no-todo";
import { noFixme } from "./rules/no-fixme";
import { noHack } from "./rules/no-hack";

const rules = {
    "no-todo": noTodo,
    "no-fixme": noFixme,
    "no-hack": noHack,
};

const configs = {
    recommended: [
        {
            rules: {
                "untodo/no-todo": "warn",
                "untodo/no-fixme": "warn",
                "untodo/no-hack": "warn",
            },
        },
    ],
};

export default {
    rules,
    configs,
};
