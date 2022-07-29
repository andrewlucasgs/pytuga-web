import * as monaco from "monaco-editor";
import {
  pythonTokens,
  pytugaTokens,
  tugalinhaTokens,
  turtleTokens,
} from "./pytugaTokens";

export default function () {
  monaco.languages.register({ id: "pytuga" });
  monaco.languages.setLanguageConfiguration("pytuga", {
    comments: {
      lineComment: "#",
      blockComment: ["'''", "'''"],
    },
    brackets: [
      ["{", "}"],
      ["[", "]"],
      ["(", ")"],
    ],
    autoClosingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"', notIn: ["string"] },
      { open: "'", close: "'", notIn: ["string", "comment"] },
    ],
    surroundingPairs: [
      { open: "{", close: "}" },
      { open: "[", close: "]" },
      { open: "(", close: ")" },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    onEnterRules: [
      {
        beforeText: new RegExp(
          "^\\s*(?:def|class|for|if|elif|else|while|try|with|finally|except|async).*?:\\s*$"
        ),
        action: { indentAction: monaco.languages.IndentAction.Indent },
      },
    ],
    folding: {
      offSide: true,
      markers: {
        start: new RegExp("^\\s*#region\\b"),
        end: new RegExp("^\\s*#endregion\\b"),
      },
    },
  });
  monaco.languages.setMonarchTokensProvider("pytuga", {
    defaultToken: "",
    tokenPostfix: ".python",

    keywords: [
      ...pythonTokens,
      ...pytugaTokens,
      ...tugalinhaTokens,
      ...turtleTokens,
    ],

    brackets: [
      { open: "{", close: "}", token: "delimiter.curly" },
      { open: "[", close: "]", token: "delimiter.bracket" },
      { open: "(", close: ")", token: "delimiter.parenthesis" },
    ],

    tokenizer: {
      root: [
        { include: "@whitespace" },
        { include: "@numbers" },
        { include: "@strings" },

        [/[,:;]/, "delimiter"],
        [/[{}\[\]()]/, "@brackets"],
        [
          /([a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ0-9_]+)(?=\([^\)]*\)(\.[^\)]*\))?)/,
          "variable.function",
        ],

        [
          /@[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ0-9_]*/,
          "tag",
        ],
        [
          /[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ0-9_:]*/,
          {
            cases: {
              "@keywords": "keyword",
              "@default": "identifier",
            },
          },
        ],
      ],

      // Deal with white space, including single and multi-line comments
      whitespace: [
        [/\s+/, "white"],
        [/(^#.*$)/, "comment"],
        [/'''/, "string", "@endDocString"],
        [/"""/, "string", "@endDblDocString"],
      ],
      endDocString: [
        [/[^']+/, "string"],
        [/\\'/, "string"],
        [/'''/, "string", "@popall"],
        [/'/, "string"],
      ],
      endDblDocString: [
        [/[^"]+/, "string"],
        [/\\"/, "string"],
        [/"""/, "string", "@popall"],
        [/"/, "string"],
      ],

      // Recognize hex, negatives, decimals, imaginaries, longs, and scientific notation
      numbers: [
        [/-?0x([abcdef]|[ABCDEF]|\d)+[lL]?/, "number.hex"],
        [/-?(\d*\.)?\d+([eE][+\-]?\d+)?[jJ]?[lL]?/, "number"],
      ],

      // Recognize strings, including those broken across lines with \ (but not without)
      strings: [
        [/'$/, "string.escape", "@popall"],
        [/'/, "string.escape", "@stringBody"],
        [/"$/, "string.escape", "@popall"],
        [/"/, "string.escape", "@dblStringBody"],
      ],
      stringBody: [
        [/[^\\']+$/, "string", "@popall"],
        [/[^\\']+/, "string"],
        [/\\./, "string"],
        [/'/, "string.escape", "@popall"],
        [/\\$/, "string"],
      ],
      dblStringBody: [
        [/[^\\"]+$/, "string", "@popall"],
        [/[^\\"]+/, "string"],
        [/\\./, "string"],
        [/"/, "string.escape", "@popall"],
        [/\\$/, "string"],
      ],
    },
  });

  monaco.editor.defineTheme("pytugaTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [
      {
        foreground: "50fa7b",
        token: "variable.function",
      },
      {
        background: "282a36",
        token: "",
      },
      {
        foreground: "6272a4",
        token: "comment",
      },
      {
        foreground: "f1fa8c",
        token: "string",
      },
      {
        foreground: "bd93f9",
        token: "constant.numeric",
      },
      {
        foreground: "bd93f9",
        token: "constant.language",
      },
      {
        foreground: "bd93f9",
        token: "constant.character",
      },
      {
        foreground: "bd93f9",
        token: "constant.other",
      },
      {
        foreground: "ffb86c",
        token: "variable.other.readwrite.instance",
      },
      {
        foreground: "ff79c6",
        token: "constant.character.escaped",
      },
      {
        foreground: "ff79c6",
        token: "constant.character.escape",
      },
      {
        foreground: "ff79c6",
        token: "string source",
      },
      {
        foreground: "ff79c6",
        token: "string source.ruby",
      },
      {
        foreground: "ff79c6",
        token: "keyword",
      },
      {
        foreground: "ff79c6",
        token: "storage",
      },
      {
        foreground: "8be9fd",
        fontStyle: "italic",
        token: "storage.type",
      },
      {
        foreground: "50fa7b",
        fontStyle: "underline",
        token: "entity.name.class",
      },
      {
        foreground: "50fa7b",
        fontStyle: "italic underline",
        token: "entity.other.inherited-class",
      },
      {
        foreground: "50fa7b",
        token: "entity.name.function",
      },

      {
        foreground: "ffb86c",
        fontStyle: "italic",
        token: "variable.parameter",
      },
      {
        foreground: "ff79c6",
        token: "entity.name.tag",
      },
      {
        foreground: "50fa7b",
        token: "entity.other.attribute-name",
      },
      {
        foreground: "FF0000",
        token: "support.function",
      },
      {
        foreground: "6be5fd",
        token: "support.constant",
      },
      {
        foreground: "66d9ef",
        fontStyle: " italic",
        token: "support.type",
      },
      {
        foreground: "66d9ef",
        fontStyle: " italic",
        token: "support.class",
      },
      {
        foreground: "f8f8f0",
        background: "ff79c6",
        token: "invalid",
      },
      {
        foreground: "f8f8f0",
        background: "bd93f9",
        token: "invalid.deprecated",
      },
      {
        foreground: "cfcfc2",
        token: "meta.structure.dictionary.json string.quoted.double.json",
      },
      {
        foreground: "6272a4",
        token: "meta.diff",
      },
      {
        foreground: "6272a4",
        token: "meta.diff.header",
      },
      {
        foreground: "ff79c6",
        token: "markup.deleted",
      },
      {
        foreground: "50fa7b",
        token: "markup.inserted",
      },
      {
        foreground: "e6db74",
        token: "markup.changed",
      },
      {
        foreground: "bd93f9",
        token: "constant.numeric.line-number.find-in-files - match",
      },
      {
        foreground: "e6db74",
        token: "entity.name.filename",
      },
      {
        foreground: "f83333",
        token: "message.error",
      },
      {
        foreground: "eeeeee",
        token:
          "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json",
      },
      {
        foreground: "eeeeee",
        token:
          "punctuation.definition.string.end.json - meta.structure.dictionary.value.json",
      },
      {
        foreground: "8be9fd",
        token: "meta.structure.dictionary.json string.quoted.double.json",
      },
      {
        foreground: "f1fa8c",
        token: "meta.structure.dictionary.value.json string.quoted.double.json",
      },
      {
        foreground: "50fa7b",
        token:
          "meta meta meta meta meta meta meta.structure.dictionary.value string",
      },
      {
        foreground: "ffb86c",
        token:
          "meta meta meta meta meta meta.structure.dictionary.value string",
      },
      {
        foreground: "ff79c6",
        token: "meta meta meta meta meta.structure.dictionary.value string",
      },
      {
        foreground: "bd93f9",
        token: "meta meta meta meta.structure.dictionary.value string",
      },
      {
        foreground: "50fa7b",
        token: "meta meta meta.structure.dictionary.value string",
      },
      {
        foreground: "ffb86c",
        token: "meta meta.structure.dictionary.value string",
      },
    ],
    colors: {
      "editor.foreground": "#f8f8f2",
      "editor.background": "#282a36",
      "editor.selectionBackground": "#44475a",
      "editor.lineHighlightBackground": "#44475a",
      "editorCursor.foreground": "#f8f8f0",
      "editorWhitespace.foreground": "#3B3A32",
      "editorIndentGuide.activeBackground": "#9D550FB0",
      "editor.selectionHighlightBorder": "#222218",
    },
  });

  monaco.languages.registerCompletionItemProvider("pytuga", {
    provideCompletionItems: () => {
      var suggestions = [
        ...pythonTokens.map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: "Python",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
        ...pytugaTokens.map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: "Pytuga",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
        ...turtleTokens.map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: "Turtle",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
        ...tugalinhaTokens.map((keyword) => ({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          detail: "Tugalinhas",
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        })),
        {
          label: "ola mundo",
          kind: monaco.languages.CompletionItemKind.Text,
          insertText: "mostre('olá mundo')",
        },
        {
          label: "paraatépasso",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ["para cada ${1:nome} de ${2:início} até ${3:fim} a cada ${4:passo} faça:", "\t$0"].join("\n"),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "paraaté",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ["para cada ${1:nome} de ${2:início} até ${3:fim} faça:", "\t$0"].join("\n"),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
        {
          label: "paracada",
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ["para cada ${1:nome} em ${2:sequência} faça:", "\t$0"].join("\n"),
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        },
      ];
      return { suggestions: suggestions };
    },
  });
}
